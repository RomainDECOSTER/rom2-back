const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const deepPopulate = require('mongoose-deep-populate')(mongoose);

const { mongoDatabase } = require('../../db');
const status = require('../../config/enum/status');
const TokenModel = require('./token');

const MongooseSchema = mongoose.Schema;
const MongoObjectId = MongooseSchema.Types.ObjectId;
const { String } = mongoose.Schema.Types;

const AppModel = new MongooseSchema(
  {
    title: { type: String, required: true },
    app_id: { type: String, required: true, unique: true, index: true },
    api_key: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    tokens: {
      refresh_token: { type: MongoObjectId, ref: 'Token' },
      access_token: { type: MongoObjectId, ref: 'Token' },
      confirm_token: { type: MongoObjectId, ref: 'Token' },
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(status),
      default: status.PENDING,
    },
    last_connection: { type: Date },
  },
  { versionKey: false, timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } },
);

AppModel.plugin(deepPopulate);

AppModel.pre('save', async function preSave(next) {
  if (!this.isModified('api_key')) return next();
  const hash = await bcrypt.hash(this.api_key, 10);
  this.api_key = hash;
  return next();
});

AppModel.methods.isValidKey = function isKeyValid(key) {
  if (this.api_key === undefined || this.api_key === null) {
    return false;
  }
  if (key === undefined || key === null) {
    return false;
  }
  return bcrypt.compare(key, this.api_key);
};

AppModel.methods.newSpecificToken = function newSpecificToken(type) {
  return new Promise((resolve, reject) => {
    this.tokens[type] = new TokenModel({
      type,
      model: 'app',
      model_id: this.id,
    });
    this.tokens[type].generateNewToken().then(token => {
      this.save(function afterSave(err) {
        if (err) reject(err);
        else resolve(token);
      });
    });
  });
};

AppModel.methods.getSpecificToken = function getSpecificToken(type) {
  return new Promise(resolve => {
    if (this.tokens && this.tokens[type] !== undefined) {
      TokenModel.getToken(this.tokens[type])
        .then(token => {
          if (!token.isExpired()) resolve(token);
          else resolve(this.newSpecificToken(type));
        })
        .catch(() => {
          resolve(this.newSpecificToken(type));
        });
    } else {
      resolve(this.newSpecificToken(type));
    }
  });
};

// if create = true, it will generate a news token evens if the actual ones are not expired
AppModel.methods.getOrCreateAuthTokens = function getOrCreateAuthTokens(create = false) {
  const access = 'access_token';
  const refresh = 'refresh_token';

  const accessTokenPromise = create ? this.newSpecificToken(access) : this.getSpecificToken(access);
  return accessTokenPromise.then(accessToken => {
    const refreshTokenPromise = create ? this.newSpecificToken(refresh) : this.getSpecificToken(refresh);
    return refreshTokenPromise.then(refreshToken => {
      return {
        access_token: accessToken.export(),
        refresh_token: refreshToken.export(),
      };
    });
  });
};

AppModel.methods.getAuthTokens = function getAuthTokens() {
  return this.getOrCreateAuthTokens().then(tokens => {
    return this.updateOne({ $set: { last_connection: new Date() } }).then(() => Promise.resolve(tokens));
  });
};

AppModel.methods.refreshAuthTokens = function refreshAuthTokens() {
  return this.getOrCreateAuthTokens(true);
};

AppModel.methods.export = function exportApp() {
  return {
    app_id: this.app_id,
    title: this.title,
  };
};

module.exports = mongoDatabase.model('App', AppModel);

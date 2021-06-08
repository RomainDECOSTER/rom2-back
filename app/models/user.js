const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const deepPopulate = require('mongoose-deep-populate')(mongoose);

const { mongoDatabase } = require('db');
const status = require('config/enum/status');
const config = require('config/application');
const mailgunConfig = require('config/mailgun');
const { EMAIL_SENDING_ERROR } = require('config/codes/errors/server');
const mailgun = require('app/tools/mailgun');
const logger = require('app/tools/logger');
const TokenModel = require('./token');

const MongooseSchema = mongoose.Schema;
const MongoObjectId = MongooseSchema.Types.ObjectId;

const UserModel = new MongooseSchema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    password: {
      type: String,
    },
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
    scopes: { type: [String], required: true },
  },
  { versionKey: false, timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } },
);

UserModel.plugin(deepPopulate);

UserModel.pre('save', async function preSave(next) {
  if (!this.isModified('password')) return next();
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  return next();
});

UserModel.methods.isValidPassword = function isPasswordValid(password) {
  if (this.password === undefined || this.password === null || password === undefined || password === null) {
    return false;
  }
  return bcrypt.compare(password, this.password);
};

UserModel.methods.newSpecificToken = function newSpecificToken(type) {
  return new Promise((resolve, reject) => {
    this.tokens[type] = new TokenModel({
      type,
      model: 'user',
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

UserModel.methods.isApproved = function isApproved() {
  return this.status === status.ACTIVE;
};

// gets token and generate it if expired or non-existent
UserModel.methods.getSpecificToken = function getSpecificToken(type) {
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
UserModel.methods.getOrCreateAuthTokens = function getOrCreateAuthTokens(create = false) {
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

UserModel.methods.getAuthTokens = function getAuthTokens() {
  return this.getOrCreateAuthTokens().then(tokens => {
    return this.updateOne({ $set: { last_connection: new Date() } }).then(() => Promise.resolve(tokens));
  });
};

UserModel.methods.refreshAuthTokens = function refreshAuthTokens() {
  return this.getOrCreateAuthTokens(true);
};

UserModel.methods.hasAccessToModule = function hasAccessToModule(module) {
  if (module && this.modules && this.modules.indexOf(module) !== -1) {
    return true;
  }
  return false;
};

UserModel.methods.export = function exportUser() {
  return {
    email: this.email,
    firstname: this.firstname,
    lastname: this.lastname,
  };
};

UserModel.statics.getUserByEmail = function getUserByEmail(email) {
  return this.findOne({ email });
};

// generates confirm token and sends confirmation email
UserModel.methods.signup = function signup() {
  return new Promise((resolve, reject) => {
    const confirm = 'confirm_token';
    this.tokens[confirm] = new TokenModel({
      type: confirm,
      model: 'user',
      model_id: this.id,
    });
    this.tokens[confirm]
      .generateNewToken()
      .then(token => {
        this.save().then(() => {
          this.sendConfirmationEmail().catch(err => {
            logger.error('[Users] mail gun failed', EMAIL_SENDING_ERROR, { err });
          });
          resolve(token);
        });
      })
      .catch(err => {
        reject(err);
      });
  });
};

// sends an email so the new user can set a password
UserModel.methods.sendConfirmationEmail = function sendConfirmationEmail() {
  const confirmationLink = `${config.BACKOFFICE_URL}/set_password?confirm_token=${this.tokens.confirm_token.token}`;
  const mailData = {
    from: mailgunConfig.MAILGUN_SENDER,
    to: this.email,
    template: mailgunConfig.mailTemplates.CONFIRM_PASSWORD,
    lang: 'fr',
    data: {
      confirm_link: confirmationLink,
      name: this.firstname,
    },
  };

  return mailgun.sendEmail(mailData);
};

UserModel.methods.approved = function approved() {
  this.status = status.ACTIVE;
  return this;
};

UserModel.methods.setPassword = function setPassword(newPassword) {
  if (newPassword === null || newPassword === undefined) {
    return Promise.reject(new Error('invalid password'));
  }
  this.password = newPassword;
  return this.save();
};
UserModel.methods.export = function exportUser() {
  return {
    _id: this.id,
    email: this.email,
    firstname: this.firstname,
    lastname: this.lastname,
    status: this.status,
  };
};

module.exports = mongoDatabase.model('User', UserModel);

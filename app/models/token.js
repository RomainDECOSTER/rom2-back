const mongoose = require('mongoose');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const { mongoDatabase } = require('db');
const config = require('config/application');

const MongooseSchema = mongoose.Schema;
const MongoObjectId = MongooseSchema.Types.ObjectId;

const TokenModel = new MongooseSchema({
  token: { type: String },
  expires_at: { type: Number },
  type: {
    type: String,
    enum: ['access_token', 'refresh_token', 'confirm_token'],
    required: true,
  },
  model: { type: String, enum: ['user', 'app'] },
  model_id: { type: MongoObjectId, required: true },
});

TokenModel.methods.getTokenConfig = function getTokenConfig() {
  const tokenConfigs = {
    access_token: config.TOKENS.ACCESS_TOKEN,
    refresh_token: config.TOKENS.REFRESH_TOKEN,
    confirm_token: config.TOKENS.CONFIRM_TOKEN,
  };
  return tokenConfigs[this.type];
};

TokenModel.methods.generateNewToken = function generateNewToken() {
  const tokenConfig = this.getTokenConfig();
  const privateKey = fs.readFileSync(tokenConfig.PATH_PRIVATE_KEY);
  const publicKey = fs.readFileSync(tokenConfig.PATH_PUBLIC_KEY);
  const payload = { id: this.model_id, model: this.model };
  const token = jwt.sign(payload, privateKey, {
    algorithm: tokenConfig.ALGORITHM,
    expiresIn: tokenConfig.EXPIRES_IN,
  });
  return new Promise((resolve, reject) => {
    try {
      const decodedToken = jwt.verify(token, publicKey);
      this.expires_at = decodedToken.exp;
      this.token = token;
      this.save(function afterSave(err, savedToken) {
        if (err) {
          reject(err);
        } else {
          resolve(savedToken);
        }
      });
    } catch (err) {
      reject(err);
    }
  });
};

TokenModel.statics.getToken = function getToken(tokenId) {
  return mongoDatabase
    .model('Token')
    .findById(tokenId)
    .then(token => {
      if (token) {
        return token;
      }
      return Promise.reject(new Error('No token found'));
    });
};

TokenModel.methods.isExpired = function isExpired() {
  const tokenConfig = this.getTokenConfig();
  const publicKey = fs.readFileSync(tokenConfig.PATH_PUBLIC_KEY);
  try {
    jwt.verify(this.token, publicKey);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return true;
    }
  }
  return false;
};

TokenModel.methods.export = function exportToken() {
  return {
    token: this.token,
    expires_at: this.expires_at,
  };
};

module.exports = mongoDatabase.model('Token', TokenModel);

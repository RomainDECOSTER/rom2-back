const passport = require('passport');

const logger = require('../tools/logger');
const { errors } = require('../../config/codes');

function parseError(err, info, res) {
  logger.error('authentication failed', errors.server.AUTHENTICATION_FAILED, { err });
  if (info) {
    return logger.logAndRespond(res, info);
  }
  return logger.logAndRespond(res, errors.api.ServerError);
}

module.exports = {
  loginUser: (req, res, next) => {
    passport.authenticate('user', (err, user, info) => {
      if (err || !user) {
        return parseError(err, info, res);
      }
      return user
        .getAuthTokens()
        .then(tokens => {
          return res.json({
            user: user.export(),
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
          });
        })
        .catch(error => {
          return logger.logAndRespond(res, error);
        });
    })(req, res, next);
  },

  loginApp: (req, res, next) => {
    passport.authenticate('app', (err, app, info) => {
      if (err || !app) {
        return parseError(err, info, res);
      }
      return app
        .getAuthTokens()
        .then(tokens => {
          return res.json({
            app: app.export(),
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
          });
        })
        .catch(error => {
          return logger.logAndRespond(res, error);
        });
    })(req, res, next);
  },

  refreshTokens: (req, res) => {
    return req.entity
      .refreshAuthTokens()
      .then(tokens => {
        return res.json(tokens);
      })
      .catch(err => {
        return logger.logAndRespond(res, err);
      });
  },
};

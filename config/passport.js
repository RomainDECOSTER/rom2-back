const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const fs = require('fs');

const models = require('app/models');
const logger = require('app/tools/logger');
const { errors } = require('config/codes');
const Status = require('./enum/status');
const config = require('./application');

function tokenStrategy(type) {
  return (req, res, next) => {
    passport.authenticate(type, (err, entity, model, info) => {
      if (err || info) {
        logger.error('auth failed', errors.server.SERVER_ERROR, { err });
        return logger.logAndRespond(res, errors.api.Unauthorized);
      }
      if (model.name === 'TokenExpiredError') {
        return logger.logAndRespond(res, errors.api.TokenExpired);
      }
      if (!entity) {
        return logger.logAndRespond(res, errors.api.Unauthorized);
      }
      req.entity = entity;
      req.entity.model = model;
      return next();
    })(req, res, next);
  };
}

passport.accessTokenStrategy = tokenStrategy('access');
passport.refreshTokenStrategy = tokenStrategy('refresh');
passport.confirmTokenStrategy = tokenStrategy('confirm');

function tokenJwtStrategy(tokenConfig, needActive = true) {
  const publicKey = fs.readFileSync(tokenConfig.PATH_PUBLIC_KEY);
  const signingAlgorithm = tokenConfig.ALGORITHM;

  return new JWTstrategy(
    {
      secretOrKey: publicKey,
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      algorithms: [signingAlgorithm],
    },
    async (token, done) => {
      return models[token.model]
        .findById(token.id)
        .then(entity => {
          if (needActive && entity !== undefined && entity.status !== Status.ACTIVE) {
            return done(null, null, null, errors.api.Unauthorized);
          }
          return done(null, entity, token.model);
        })
        .catch(err => {
          return done(err);
        });
    },
  );
}

passport.use('access', tokenJwtStrategy(config.TOKENS.ACCESS_TOKEN));
passport.use('refresh', tokenJwtStrategy(config.TOKENS.REFRESH_TOKEN));
passport.use('confirm', tokenJwtStrategy(config.TOKENS.CONFIRM_TOKEN, false));

passport.use(
  'user',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        const user = await models.user.findOne({ email });
        if (!user) {
          return done(null, false, errors.api.InvalidCredentials);
        }
        if (user.status !== Status.ACTIVE) {
          return done(null, false, errors.api.UserAccountNotActive);
        }
        const validate = await user.isValidPassword(password);
        if (!validate) {
          return done(null, false, errors.api.InvalidCredentials);
        }
        return done(null, user, { message: 'Logged in Successfully' });
      } catch (error) {
        return done(error);
      }
    },
  ),
);

passport.use(
  'app',
  new LocalStrategy(
    {
      usernameField: 'app_id',
      passwordField: 'api_key',
    },
    async (appId, appKey, done) => {
      try {
        const app = await models.app.findOne({ app_id: appId });
        if (!app) {
          return done(null, false, errors.api.AppInvalidCredentials);
        }
        if (app.status !== Status.ACTIVE) {
          return done(null, false, errors.api.AppAccountNotActive);
        }
        const validate = await app.isValidKey(appKey);
        if (!validate) {
          return done(null, false, errors.api.AppInvalidCredentials);
        }
        return done(null, app, { message: 'Logged in Successfully' });
      } catch (error) {
        return done(error);
      }
    },
  ),
);

module.exports = passport;

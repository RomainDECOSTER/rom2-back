const { errors } = require('config/codes');
const { app: AppModel } = require('app/models');
const controllerTool = require('app/tools/controller');
const logger = require('app/tools/logger');

module.exports = {
  createNewApp: (req, res) => {
    try {
      controllerTool.parseRequiredBody(req);
    } catch (error) {
      return logger.logAndRespond(res, error);
    }

    const fields = [
      { name: 'title', required: true, type: 'string' },
      { name: 'email', required: true, type: 'string' },
      { name: 'app_id', required: true, type: 'string' },
      { name: 'api_key', required: true, type: 'string' },
    ];

    let appFields;
    try {
      appFields = controllerTool.parseFields(req.body, fields);
    } catch (error) {
      logger.logAndRespond(res, error);
    }

    return AppModel.findOne({ app_id: appFields.app_id })
      .then(appFound => {
        if (appFound !== null) {
          return logger.logAndRespond(res, errors.api.AppIdAlreadyTaken);
        }
        return AppModel.create(appFields)
          .then(app => {
            return res.json(app.export());
          })
          .catch(err => {
            logger.error('Create app failed', errors.server.MONGODB_ERROR, { err });
            return logger.logAndRespond(res, errors.api.ServerError);
          });
      })
      .catch(err => {
        logger.error('Find app by app id failed', errors.server.MONGODB_ERROR, { err });
        return logger.logAndRespond(res, errors.api.ServerError);
      });
  },
};

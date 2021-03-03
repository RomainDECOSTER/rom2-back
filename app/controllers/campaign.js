const { campaign: CampaignModel } = require('app/models');
const controllerTool = require('app/tools/controller');
const logger = require('app/tools/logger');
const errors = require('config/codes/errors');

module.exports = {
  list: (req, res) => {
    return CampaignModel.find()
      .lean()
      .then(docs => {
        return res.json(docs);
      })
      .catch(err => {
        logger.error('[Campaign] list failed', errors.server.MONGODB_ERROR, { err });
        return logger.logAndRespond(res, err);
      });
  },
  get: (req, res) => {
    try {
      controllerTool.parsePathId(req);
    } catch (err) {
      logger.logAndRespond(res, err);
    }

    const { id } = req.params;

    return CampaignModel.findById(id)
      .lean()
      .then(doc => {
        return res.json(doc);
      })
      .catch(err => {
        logger.error('[Campaign] get failed', errors.server.MONGODB_ERROR, { err });
        return logger.logAndRespond(res, err);
      });
  },
  create: (req, res) => {
    try {
      controllerTool.parseRequiredBody(req);
    } catch (err) {
      return logger.logAndRespond(res, err);
    }

    const fields = [
      { name: 'name', type: 'string', required: true },
      { name: 'description', type: 'string' },
    ];

    let fieldsToSend = {};
    try {
      fieldsToSend = controllerTool.parseFields(req.body, fields);
    } catch (err) {
      return logger.logAndRespond(res, err);
    }

    return CampaignModel.create(fieldsToSend)
      .then(() => {
        return res.status(201).send();
      })
      .catch(err => {
        logger.error('[Campaign] create failed', errors.server.MONGODB_ERROR, { err });
        return logger.logAndRespond(res, err);
      });
  },
  update: (req, res) => {
    try {
      controllerTool.parsePathId(req);
      controllerTool.parseRequiredBody(req);
    } catch (err) {
      return logger.logAndRespond(res, err);
    }

    const { id } = req.params;

    const fields = [
      { name: 'name', type: 'string', required: true },
      { name: 'description', type: 'string' },
    ];

    let fieldsToSend = {};
    try {
      fieldsToSend = controllerTool.parseFields(req.body, fields);
    } catch (err) {
      return logger.logAndRespond(res, err);
    }

    return CampaignModel.findByIdAndUpdate(id, fieldsToSend)
      .then(() => {
        return res.status(204).send();
      })
      .catch(err => {
        logger.error('[Campaign] update failed', errors.server.MONGODB_ERROR, { err });
        return logger.logAndRespond(res, err);
      });
  },
  delete: (req, res) => {
    try {
      controllerTool.parsePathId(req);
    } catch (err) {
      logger.logAndRespond(res, err);
    }

    const { id } = req.params;

    return CampaignModel.findOneAndDelete(id)
      .then(doc => {
        if (doc === null) {
          return logger.logAndRespond(res, errors.api.NotFound);
        }
        return res.status(204).send();
      })
      .catch(err => {
        logger.error('[Campaign] delete failed', errors.server.MONGODB_ERROR, { err });
        return logger.logAndRespond(res, err);
      });
  },
};

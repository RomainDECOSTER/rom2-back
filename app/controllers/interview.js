const { interview: Model } = require('app/models');
const controllerTool = require('app/tools/controller');
const logger = require('app/tools/logger');
const errors = require('config/codes/errors');

module.exports = {
  list: (req, res) => {
    const fields = [{ name: 'campaign', type: 'string', required: true }];
    let fieldsToSend = {};
    try {
      fieldsToSend = controllerTool.parseFields(req.query, fields);
    } catch (error) {
      return logger.logAndRespond(res, error);
    }
    return Model.find(fieldsToSend)
      .lean()
      .then(docs => {
        return res.json(docs);
      })
      .catch(err => {
        logger.error('[Interview] list failed', errors.server.MONGODB_ERROR, { err });
        return logger.logAndRespond(res, err);
      });
  },
  getInterviewedList: (req, res) => {
    const fields = [
      { name: 'interviewed_id', type: 'string', required: true },
      { name: 'campaign', type: 'string' },
    ];
    let fieldsToSend = {};
    try {
      fieldsToSend = controllerTool.parseFields(req.query, fields);
    } catch (error) {
      return logger.logAndRespond(res, error);
    }
    return Model.find(fieldsToSend)
      .lean()
      .then(docs => {
        return res.json(docs);
      })
      .catch(err => {
        logger.error('[Interview] Interviewed list failed', errors.server.MONGODB_ERROR, { err });
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

    return Model.findById(id)
      .then(doc => {
        return res.json(doc);
      })
      .catch(err => {
        logger.error('[Interview] get failed', errors.server.MONGODB_ERROR, { err });
        return logger.logAndRespond(res, err);
      });
  },
  create: (req, res) => {
    try {
      controllerTool.parseRequiredBody(req);
    } catch (err) {
      return logger.logAndRespond(res, err);
    }

    return Model.create(req.body)
      .then(() => {
        return res.status(204).json({});
      })
      .catch(err => {
        logger.error('[Interview] create failed', errors.server.MONGODB_ERROR, { err });
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

    return Model.findByIdAndUpdate(id, req.body)
      .then(doc => {
        if (doc === null) {
          return logger.logAndRespond(res, errors.api.NotFound);
        }
        return res.status(204).json({});
      })
      .catch(err => {
        logger.error('[Interview] update failed', errors.server.MONGODB_ERROR, { err });
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

    return Model.findByIdAndDelete(id)
      .then(doc => {
        if (doc === null) {
          return logger.logAndRespond(res, errors.api.NotFound);
        }
        return res.status(204).json({});
      })
      .catch(err => {
        logger.error('[Interview] delete failed', errors.server.MONGODB_ERROR, { err });
        return logger.logAndRespond(res, err);
      });
  },
};

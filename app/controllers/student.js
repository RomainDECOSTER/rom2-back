const { student: Model, studentHistory: StudentHistory } = require('app/models');
const controllerTool = require('app/tools/controller');
const logger = require('app/tools/logger');
const errors = require('config/codes/errors');
const uuid = require('uuid');
const ACTIONS = require('app/enums/action');

module.exports = {
  list: (req, res) => {
    try {
      controllerTool.parseRequiredQuery(req);
    } catch (error) {
      return logger.logAndRespond(res, error);
    }
    return Model.find({ campaign: req.query.campaign })
      .select('type general_information.mobile general_information.first_name general_information.last_name general_information.email')
      .lean()
      .then(docs => {
        return res.json(docs);
      })
      .catch(err => {
        logger.error('[Student] list failed', errors.server.MONGODB_ERROR, { err });
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
        logger.error('[Student] get failed', errors.server.MONGODB_ERROR, { err });
        return logger.logAndRespond(res, err);
      });
  },
  create: (req, res) => {
    try {
      controllerTool.parseRequiredBody(req);
    } catch (err) {
      return logger.logAndRespond(res, err);
    }
    const fields = { ...req.body };
    if (fields.uuid === undefined) {
      fields.uuid = uuid.v4();
    }
    return Model.create(fields)
      .then(student => {
        return StudentHistory.create({ user: req.entity.id, action: ACTIONS.CREATE, student: student.export() })
          .then(() => {
            return res.status(204).json({});
          })
          .catch(err => {
            logger.error('[Student] create failed put in history', errors.server.MONGODB_ERROR, { err });
            return logger.logAndRespond(res, err);
          });
      })
      .catch(err => {
        logger.error('[Student] create failed', errors.server.MONGODB_ERROR, { err });
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

    return Model.findByIdAndUpdate(id, req.body, { new: true })
      .then(doc => {
        if (doc === null) {
          return logger.logAndRespond(res, errors.api.NotFound);
        }
        return StudentHistory.create({ user: req.entity.id, action: ACTIONS.UPDATE, student: doc.export() })
          .then(() => {
            return res.status(204).json({});
          })
          .catch(err => {
            logger.error('[Student] update failed put in history', errors.server.MONGODB_ERROR, { err });
            return logger.logAndRespond(res, err);
          });
      })
      .catch(err => {
        logger.error('[Student] update failed', errors.server.MONGODB_ERROR, { err });
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
        return StudentHistory.create({ user: req.entity.id, action: ACTIONS.DELETE, student: doc.export() })
          .then(() => {
            return res.status(204).json({});
          })
          .catch(err => {
            logger.error('[Student] delete failed put in history', errors.server.MONGODB_ERROR, { err });
            return logger.logAndRespond(res, err);
          });
      })
      .catch(err => {
        logger.error('[Student] delete failed', errors.server.MONGODB_ERROR, { err });
        return logger.logAndRespond(res, err);
      });
  },
};

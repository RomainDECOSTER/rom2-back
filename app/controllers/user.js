const { errors } = require('config/codes');
const { user: UserModel } = require('app/models');
const controllerTools = require('app/tools/controller');
const logger = require('app/tools/logger');

module.exports = {
  createNewUser: (req, res) => {
    try {
      controllerTools.parseRequiredBody(req);
    } catch (error) {
      return logger.logAndRespond(res, error);
    }

    const fields = [
      { name: 'firstname', required: true, type: 'string' },
      { name: 'lastname', required: true, type: 'string' },
      { name: 'email', required: true, type: 'string' },
    ];

    let userToAdd;
    try {
      userToAdd = controllerTools.parseFields(req.body, fields);
    } catch (error) {
      return logger.logAndRespond(res, error);
    }

    return UserModel.findOne({ email: userToAdd.email })
      .then(userFound => {
        if (userFound !== null) {
          return logger.logAndRespond(res, errors.api.EmailAlreadyTaken);
        }
        return UserModel.create(userToAdd)
          .then(newUser => {
            return newUser
              .signup()
              .then(user => {
                return res.json(user.export());
              })
              .catch(err => {
                logger.error('Error signup user', errors.server.SERVER_ERROR, { err });
                return logger.logAndRespond(res, errors.api.ServerError);
              });
          })
          .catch(err => {
            logger.error('Create user failed', errors.server.MONGODB_ERROR, { err });
            return logger.logAndRespond(res, errors.api.ServerError);
          });
      })
      .catch(err => {
        logger.error('Find user by email failed', errors.server.MONGODB_ERROR, { err });
        return logger.logAndRespond(res, errors.api.ServerError);
      });
  },
  setPassword: (req, res) => {
    try {
      controllerTools.parseRequiredBody(req);
    } catch (error) {
      return logger.logAndRespond(res, error);
    }
    const fields = [{ name: 'password', required: true, type: 'string' }];

    let approvedFields;
    try {
      approvedFields = controllerTools.parseFields(req.body, fields);
    } catch (error) {
      return logger.logAndRespond(res, error);
    }

    return req.entity
      .approved()
      .setPassword(approvedFields.password)
      .then(() => {
        return res.status(204).send();
      })
      .catch(err => {
        logger.error('Set password failed', errors.server.MONGODB_ERROR, { err });
        return logger.logAndRespond(res, errors.api.ServerError);
      });
  },
  me: (req, res) => {
    return res.json(req.entity.export());
  },
  delete: (req, res) => {
    try {
      controllerTools.parsePathId(req);
    } catch (error) {
      return logger.logAndRespond(res, error);
    }

    return UserModel.findByIdAndDelete(req.params.id)
      .then(() => {
        return res.send(204).send();
      })
      .catch(err => logger.logAndRespond(res, err));
  },
  update: (req, res) => {
    try {
      controllerTools.parsePathId(req);
      controllerTools.parseRequiredBody(req);
    } catch (error) {
      return logger.logAndRespond(res, error);
    }

    const fields = [
      { name: 'firstname', nonNull: true, type: 'string' },
      { name: 'lastname', nonNull: true, type: 'string' },
      { name: 'email', nonNull: true, type: 'string' },
    ];

    let fieldsToEdit;
    try {
      fieldsToEdit = controllerTools.parseFields(req.body, fields);
    } catch (error) {
      return logger.logAndRespond(res, error);
    }

    return UserModel.findByIdAndUpdate(req.params.id, fieldsToEdit)
      .then(user => {
        return res.json(user.export());
      })
      .catch(err => logger.logAndRespond(res, err));
  },
  retrieved: (req, res) => {
    try {
      controllerTools.parsePathId(req);
    } catch (error) {
      return logger.logAndRespond(res, error);
    }

    return UserModel.findById(req.params.id)
      .then(user => {
        return res.json(user.export());
      })
      .catch(err => logger.logAndRespond(res, err));
  },
  find: (req, res) => {
    return UserModel.find()
      .then(users => {
        return res.json(users.map(u => u.export()));
      })
      .catch(err => logger.logAndRespond(res, err));
  },
};

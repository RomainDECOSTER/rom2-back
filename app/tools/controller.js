const mongoose = require('mongoose');

const { errors } = require('../../config/codes');

const { ObjectId } = mongoose.Types;

const controllerTool = {
  parsePathId: req => {
    if (req.params === undefined || req.params === null || req.params.id === undefined || req.params.id === null || ObjectId.isValid(req.params.id) === false) {
      throw errors.api.ObjectIDNotValid;
    }
  },

  parseRequiredBody: req => {
    if (req.body === undefined || req.body === null || Object.keys(req.body).length === 0) {
      throw errors.api.InvalidBodyFields;
    }
  },

  objectIdValidator: element => ObjectId.isValid(element) === true,

  parseBodyFieldBool: (field, required, requiredInModel) => {
    if (required) {
      if (field === undefined || field === null) {
        throw errors.api.MissingRequiredFields;
      }
    }
    if (field === undefined) {
      return;
    }
    if (requiredInModel) {
      if (field === null) {
        throw errors.api.InvalidBodyFields;
      }
    }
    if (field !== null) {
      if (typeof field !== 'boolean') {
        throw errors.api.InvalidBodyFields;
      }
    }
  },

  parseBodyFieldString: (field, required, requiredInModel, furtherParsing) => {
    if (required) {
      if (field === undefined || field === null || field === '') {
        throw errors.api.MissingRequiredFields;
      }
    }
    if (field === undefined) {
      return;
    }
    if (requiredInModel) {
      if (field === null || field === '') {
        throw errors.api.InvalidBodyFields;
      }
    }
    if (field !== null) {
      if (typeof field !== 'string') {
        throw errors.api.InvalidBodyFields;
      }
      if (typeof furtherParsing === 'function' && !furtherParsing(field)) {
        throw errors.api.InvalidBodyFields;
      }
    }
  },

  parseBodyFieldNumber: (field, required, requiredInModel, furtherParsing, type = 'int') => {
    if (required) {
      if (field === undefined || field === null) {
        throw errors.api.MissingRequiredFields;
      }
    }
    if (field === undefined) {
      return;
    }
    if (requiredInModel) {
      if (field === null) {
        throw errors.api.InvalidBodyFields;
      }
    }
    if (field !== null) {
      const number = type === 'int' ? parseInt(field, 10) : parseFloat(field, 10);
      if (Number.isNaN(number)) {
        throw errors.api.InvalidBodyFields;
      }
      if (typeof furtherParsing === 'function' && !furtherParsing(number)) {
        throw errors.api.InvalidBodyFields;
      }
    }
  },

  parseBodyFieldArray: (field, required, requiredInModel, comparator) => {
    if (required) {
      if (field === undefined || field === null) {
        throw errors.api.MissingRequiredFields;
      }
    }
    if (field === undefined) {
      return;
    }
    if (requiredInModel) {
      if (field === null) {
        throw errors.api.InvalidBodyFields;
      }
    }
    if (field !== null) {
      if (!Array.isArray(field)) {
        throw errors.api.InvalidBodyFields;
      }
      if (typeof comparator === 'function' && field.every(comparator) === false) {
        throw errors.api.InvalidBodyFields;
      }
    }
  },

  parseBodyFieldObject: (field, required, requiredInModel, furtherParsing) => {
    if (required) {
      if (field === undefined || field === null) {
        throw errors.api.MissingRequiredFields;
      }
    }
    if (field === undefined) {
      return;
    }
    if (requiredInModel) {
      if (field === null) {
        throw errors.api.InvalidBodyFields;
      }
    }
    if (field !== null) {
      if (typeof field !== 'object') {
        throw errors.api.InvalidBodyFields;
      }
      if (typeof furtherParsing === 'function' && !furtherParsing(field)) {
        throw errors.api.InvalidBodyFields;
      }
    }
  },

  parseFields: function parseFields(values, fields) {
    if (typeof values !== 'object' || values === null) {
      throw Error('Invalid values object');
    }
    if (!Array.isArray(fields)) {
      throw Error('Invalid fields array');
    }
    try {
      const fieldsValues = {};
      fields.forEach(field => {
        if (typeof field !== 'object' || field === null || typeof field.name !== 'string' || field.name === '') {
          return; // skip invalid field object
        }
        if ((typeof field.type !== 'string' && typeof field.type !== 'function') || field.type === '') {
          return; // skip invalid field object
        }
        const type = typeof field.type === 'string' ? field.type : field.type(values[field.name]);
        const validator = typeof field.validator === 'function' ? field.validator : undefined;
        const subFields = field.fields;
        switch (type) {
          case 'bool':
            this.parseBodyFieldBool(values[field.name], field.required, field.nonNull);
            break;
          case 'string':
            this.parseBodyFieldString(values[field.name], field.required, field.nonNull, field.validator);
            break;
          case 'int':
            this.parseBodyFieldNumber(values[field.name], field.required, field.nonNull, field.validator, 'int');
            break;
          case 'float':
            this.parseBodyFieldNumber(values[field.name], field.required, field.nonNull, field.validator, 'float');
            break;
          case 'array':
            this.parseBodyFieldArray(
              values[field.name],
              field.required,
              field.nonNull,
              validator || subFields
                ? element => {
                    if (subFields) {
                      if (typeof element !== 'object' || element === null) {
                        return false;
                      }
                      try {
                        this.parseFields(element, subFields);
                      } catch (error) {
                        return false;
                      }
                    }
                    if (validator && !validator(element)) {
                      return false;
                    }
                    return true;
                  }
                : undefined,
            );
            break;
          case 'object':
            this.parseBodyFieldObject(
              values[field.name],
              field.required,
              field.nonNull,
              validator || subFields
                ? element => {
                    if (subFields) {
                      try {
                        this.parseFields(element, subFields);
                      } catch (error) {
                        return false;
                      }
                    }
                    if (validator && !validator(element)) {
                      return false;
                    }
                    return true;
                  }
                : undefined,
            );
            break;
          default:
            break; // skip unknown type
        }
        if (values[field.name] !== undefined) {
          fieldsValues[field.name] = values[field.name];
        }
      });
      return fieldsValues;
    } catch (err) {
      throw err;
    }
  },
};

module.exports = controllerTool;

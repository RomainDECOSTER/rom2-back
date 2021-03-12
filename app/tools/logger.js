const winston = require('winston');
const { errors } = require('config/codes/');

const myFormat = winston.format.printf(({ timestamp, level, message, metadata }) => {
  return `${timestamp} - ${level}: ${message} entity=${metadata.entity}, code=${metadata.code}, data=${JSON.stringify(metadata.data)}, details=${JSON.stringify(metadata.details)}`;
});

const loggerWinston = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.metadata({
      meta: ['data'],
      fillExcept: ['timestamp', 'level', 'message'],
    }),
    myFormat,
  ),
  transports: [
    new winston.transports.Console({
      level: 'silly',
      format: winston.format.combine(winston.format.colorize(), myFormat),
    }),
  ],
});

function formatData(entity, code, data, details) {
  const meta = {};
  meta.entity = entity;
  meta.code = code;
  if (data !== undefined && data !== null) {
    meta.data = data;
  }
  if (details !== undefined && details !== null) {
    meta.details = details;
    if (details.err !== undefined && details.err !== null && details.err.message !== undefined) {
      meta.details.err = details.err.message;
    }
  }
  return meta;
}

function info(entity, message, code, details, data) {
  loggerWinston.info(message, formatData(entity, code, data, details));
}

function error(entity, message, code, details, data) {
  const formatedData = formatData(entity, code, data, details);
  if (details && details.err !== undefined) {
    // eslint-disable-next-line no-console
    console.error(details);
  }
  loggerWinston.error(message, formatedData);
}

function verbose(entity, message, code, details, data) {
  loggerWinston.verbose(message, formatData(entity, code, data, details));
}

function warn(entity, message, code, details, data) {
  loggerWinston.warn(message, formatData(entity, code, data, details));
}

function debug(entity, message, code, details, data) {
  loggerWinston.debug(message, formatData(entity, code, data, details));
}

function silly(entity, message, code, details, data) {
  loggerWinston.silly(message, formatData(entity, code, data, details));
}

function logAndRespond(res, err) {
  if (err && err.code && err.response) {
    error('Server', err.response.description, err.code);
    res.status(err.code).json({ ...err.response, ...err.details });
  } else {
    const serverErr = errors.api.ServerError;
    error('Server', serverErr.response.description, serverErr.code, { err: serverErr.response.description });
    res.status(serverErr.code).json(serverErr.response);
  }
}

const logger = {
  info(message, code, details, data) {
    return info('Server', message, code, details, data);
  },
  error(message, code, details) {
    return error('Server', message, code, details);
  },
  verbose(message, code, details) {
    return verbose('Server', message, code, details);
  },
  warn(message, code, details) {
    return warn('Server', message, code, details);
  },
  debug(message, code, details) {
    return debug('Server', message, code, details);
  },
  silly(message, code, details) {
    return silly('Server', message, code, details);
  },
  logAndRespond,
};

module.exports = logger;

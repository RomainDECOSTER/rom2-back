require('dotenv').config();

/**
 * getEnvVar is used to get the environment variable and to apply a formatter on this variables.
 * It returns a default value if the variable is not found.
 * @param {String} name name of the environment variable
 * @param {*} defaultValue default value when the variable is not found
 * @param {Function} formatter function applied on the environment variable
 */
function getEnvVar(name, defaultValue = '', formatter = v => v) {
  return process.env[name] !== undefined && process.env[name].trim().length > 0 ? formatter(process.env[name]) : defaultValue;
}

// dev or prod
const ENV = getEnvVar('NODE_ENV', 'local');
const PORT = getEnvVar('PORT', '3000');

// backoffice
const BACKOFFICE_PROTOCOL = getEnvVar('BACKOFFICE_PROTOCOL', 'http');
const BACKOFFICE_HOST = getEnvVar('BACKOFFICE_HOST', 'localhost');
const BACKOFFICE_PORT = getEnvVar('BACKOFFICE_PORT', 3001);
let BACKOFFICE_URL = `${BACKOFFICE_PROTOCOL}://${BACKOFFICE_HOST}`;
if (BACKOFFICE_PORT !== '80') {
  BACKOFFICE_URL = `${BACKOFFICE_URL}:${BACKOFFICE_PORT}`;
}

// database
const MONGODB_USERNAME = getEnvVar('MONGODB_USERNAME', 'user');
const MONGODB_PASSWORD = getEnvVar('MONGODB_PASSWORD', 'password');
const MONGODB_PROTOCOL = getEnvVar('MONGODB_PROTOCOL', 'mongodb://');
const MONGODB_URI = getEnvVar('MONGODB_URI', 'localhost:27017');
const MONGODB_DATABASE_NAME = getEnvVar('MONGODB_DATABASE_NAME', 'lacle_dev');

const MONGODB_URL = `${MONGODB_PROTOCOL}${MONGODB_USERNAME}:${MONGODB_PASSWORD}@${MONGODB_URI}`;

// elasticsearch
const ELASTICSEARCH_PROTOCOL = getEnvVar('ELASTICSEARCH_PROTOCOL', 'http');
const ELASTICSEARCH_HOST = getEnvVar('ELASTICSEARCH_HOST', 'localhost:9200');
const ELASTICSEARCH_USERNAME = getEnvVar('ELASTICSEARCH_USERNAME', 'elastic');
const ELASTICSEARCH_PASSWORD = getEnvVar('ELASTICSEARCH_PASSWORD', 'thisisatest');
const ELASTICSEARCH_LOGLEVEL = getEnvVar('ELASTICSEARCH_LOGLEVEL', 'error');
const ELASTICSEARCH_INDEX = getEnvVar('ELASTICSEARCH_INDEX', 'api');
const ELASTICSEARCH_CERT_PATH = getEnvVar('ELASTICSEARCH_CERT_PATH', './config/rsa-keys/elastic.crt');
const ELASTICSEARCH_APM_SERVICE = getEnvVar('ELASTICSEARCH_APM_SERVICE', 'api');
const ELASTICSEARCH_ACTIVATE_SSL = getEnvVar('ELASTICSEARCH_SSL_ACTIVATE', false, v => v === 'true');
const ELASTICSEARCH_APM_URL = getEnvVar('ELASTICSEARCH_APM_URL', 'http://localhost:8200');

const ELASTICSEARCH_URL = `${ELASTICSEARCH_PROTOCOL}://${ELASTICSEARCH_USERNAME}:${ELASTICSEARCH_PASSWORD}@${ELASTICSEARCH_HOST}`;

const TOKENS = {
  ACCESS_TOKEN: {
    EXPIRES_IN: 432000,
    PATH_PRIVATE_KEY: 'config/rsa-keys/access_token_private_key.pem',
    PATH_PUBLIC_KEY: 'config/rsa-keys/access_token_public_key.pem',
    ALGORITHM: 'RS256',
  },
  REFRESH_TOKEN: {
    EXPIRES_IN: 604800,
    PATH_PRIVATE_KEY: 'config/rsa-keys/refresh_token_private_key.pem',
    PATH_PUBLIC_KEY: 'config/rsa-keys/refresh_token_public_key.pem',
    ALGORITHM: 'RS256',
  },
  CONFIRM_TOKEN: {
    EXPIRES_IN: 604800,
    PATH_PRIVATE_KEY: 'config/rsa-keys/confirm_token_private_key.pem',
    PATH_PUBLIC_KEY: 'config/rsa-keys/confirm_token_public_key.pem',
    ALGORITHM: 'RS256',
  },
};

const setAccessControlHeaders = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Max-Age', 604800);
  res.header('Access-Control-Allow-Headers', 'accept, content-type, Authorization');

  // If an OPTIONS request is received, answer 200 with the headers
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
};

module.exports = {
  ENV,
  PORT,
  BACKOFFICE_URL,
  TOKENS,
  setAccessControlHeaders,
  MONGO: {
    DATABASE: {
      URL: MONGODB_URL,
      NAME: MONGODB_DATABASE_NAME,
    },
  },
  ELASTICSEARCH: {
    URL: ELASTICSEARCH_URL,
    LOGLEVEL: ELASTICSEARCH_LOGLEVEL,
    INDEX: ELASTICSEARCH_INDEX,
    CERT_PATH: ELASTICSEARCH_CERT_PATH,
    ACTIVATE_SSL: ELASTICSEARCH_ACTIVATE_SSL,
    APM: {
      SERVICE: ELASTICSEARCH_APM_SERVICE,
      URL: ELASTICSEARCH_APM_URL,
    },
  },
};

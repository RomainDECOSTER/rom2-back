const mailTemplates = require('./templates');

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

const MAILGUN_API_KEY = getEnvVar('MAILGUN_API_KEY', '');
const MAILGUN_DOMAIN = getEnvVar('MAILGUN_DOMAIN', 'api.lacle.fr');
const MAILGUN_SENDER = getEnvVar('MAILGUN_SENDER', 'Lacle <cest@lacle.fr>');

const mailgunConfig = {
  mailTemplates,
  MAILGUN_API_KEY,
  MAILGUN_DOMAIN,
  MAILGUN_SENDER,
};

module.exports = mailgunConfig;

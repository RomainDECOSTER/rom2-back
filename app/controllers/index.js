const authentication = require('./authentication');
const healthcheck = require('./healthcheck');
const user = require('./user');
const app = require('./app');
const campaign = require('./campaign');

module.exports = {
  authentication,
  healthcheck,
  user,
  app,
  campaign,
};

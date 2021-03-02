const authentication = require('./authentication');
const healthcheck = require('./healthcheck');
const user = require('./user');
const app = require('./app');

module.exports = {
  authentication,
  healthcheck,
  user,
  app,
};

const authentication = require('./authentication');
const healthcheck = require('./healthcheck');
const user = require('./user');
const app = require('./app');
const campaign = require('./campaign');
const student = require('./student');
const volunteer = require('./volunteer');
const workshop = require('./workshop');

module.exports = {
  authentication,
  healthcheck,
  user,
  app,
  campaign,
  student,
  volunteer,
  workshop,
};

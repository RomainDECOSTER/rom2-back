const authentication = require('./authentication');
const healthcheck = require('./healthcheck');
const user = require('./user');
const campaign = require('./campaign');

module.exports = (router, passport) => {
  authentication(router, passport);
  healthcheck(router, passport);
  user(router, passport);
  campaign(router, passport);
};

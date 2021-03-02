const authentication = require('./authentication');
const healthcheck = require('./healthcheck');
const user = require('./user');

module.exports = (router, passport) => {
  authentication(router, passport);
  healthcheck(router, passport);
  user(router, passport);
};

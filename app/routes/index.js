const authentication = require('./authentication');
const healthcheck = require('./healthcheck');
const user = require('./user');
const campaign = require('./campaign');
const student = require('./student');
const volunteer = require('./volunteer');
const workshop = require('./workshop');
const interview = require('./interview');
const positionedWorkshop = require('./positionedWorkshop');

module.exports = (router, passport) => {
  authentication(router, passport);
  healthcheck(router, passport);
  user(router, passport);
  campaign(router, passport);
  student(router, passport);
  volunteer(router, passport);
  workshop(router, passport);
  interview(router, passport);
  positionedWorkshop(router, passport);
};

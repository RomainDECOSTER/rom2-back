const token = require('./token');
const user = require('./user');
const app = require('./app');
const campaign = require('./campaign');
const student = require('./student/StudentSchema');
const volunteer = require('./volunteer/VolunteerSchema');
const workshop = require('./WorkshopSchema');
const studentHistory = require('./student/StudentHistory');
const volunteerHistory = require('./volunteer/volunteerHistory');
const positionedWorkshop = require('./PositionedWorkshop');

module.exports = {
  token,
  user,
  app,
  campaign,
  student,
  volunteer,
  workshop,
  studentHistory,
  volunteerHistory,
  positionedWorkshop,
};

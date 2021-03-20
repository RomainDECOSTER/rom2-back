const { student: Controller } = require('app/controllers');

module.exports = (router, passport) => {
  router.get('/students', passport.accessTokenStrategy, Controller.list);
  router.get('/student/:id', passport.accessTokenStrategy, Controller.get);
  router.post('/student', passport.accessTokenStrategy, Controller.create);
  router.put('/student/:id', passport.accessTokenStrategy, Controller.update);
  router.delete('/student/:id', passport.accessTokenStrategy, Controller.delete);
};

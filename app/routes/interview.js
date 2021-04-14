const { interview: Controller } = require('app/controllers');

module.exports = (router, passport) => {
  router.get('/interviews', passport.accessTokenStrategy, Controller.list);
  router.get('/interview', passport.accessTokenStrategy, Controller.getInterviewedList);
  router.get('/interview/:id', passport.accessTokenStrategy, Controller.get);
  router.post('/interview', passport.accessTokenStrategy, Controller.create);
  router.put('/interview/:id', passport.accessTokenStrategy, Controller.update);
  router.delete('/interview/:id', passport.accessTokenStrategy, Controller.delete);
};

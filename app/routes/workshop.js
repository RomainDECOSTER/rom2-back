const { workshop: Controller } = require('app/controllers');

module.exports = (router, passport) => {
  router.get('/workshops', passport.accessTokenStrategy, Controller.list);
  router.get('/workshop/:id', passport.accessTokenStrategy, Controller.get);
  router.post('/workshop', passport.accessTokenStrategy, Controller.create);
  router.put('/workshop/:id', passport.accessTokenStrategy, Controller.update);
  router.delete('/workshop/:id', passport.accessTokenStrategy, Controller.delete);
};

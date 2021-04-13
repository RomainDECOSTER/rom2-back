const { positionedWorkshop: Controller } = require('app/controllers');

module.exports = (router, passport) => {
  router.get('/positioned-workshops', passport.accessTokenStrategy, Controller.list);
  router.get('/positioned-workshop/:id', passport.accessTokenStrategy, Controller.get);
  router.post('/positioned-workshop', passport.accessTokenStrategy, Controller.create);
  router.put('/positioned-workshop/:id', passport.accessTokenStrategy, Controller.update);
  router.delete('/positioned-workshop/:id', passport.accessTokenStrategy, Controller.delete);
};

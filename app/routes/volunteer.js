const { volunteer: Controller } = require('app/controllers');

module.exports = (router, passport) => {
  router.get('/volunteers', passport.accessTokenStrategy, Controller.list);
  router.get('/volunteer/:id', passport.accessTokenStrategy, Controller.get);
  router.post('/volunteer', passport.accessTokenStrategy, Controller.create);
  router.put('/volunteer/:id', passport.accessTokenStrategy, Controller.update);
  router.delete('/volunteer/:id', passport.accessTokenStrategy, Controller.delete);
};

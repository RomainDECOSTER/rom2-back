const { campaign } = require('app/controllers');

module.exports = (router, passport) => {
  router.get('/campaigns', passport.accessTokenStrategy, campaign.list);
  router.get('/campaigns/:id', passport.accessTokenStrategy, campaign.get);
  router.post('/campaign', passport.accessTokenStrategy, campaign.create);
  router.put('/campaign/:id', passport.accessTokenStrategy, campaign.update);
  router.delete('/campaign/:id', passport.accessTokenStrategy, campaign.delete);
};

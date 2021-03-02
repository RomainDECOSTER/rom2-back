const { app } = require('../controllers');

module.exports = (router, passport) => {
  /**
   * @api {post} /apps Create new app
   * @apiVersion 1.0.0
   * @apiName AppsCreate
   * @apiGroup Apps
   *
   * @apiHeader {String} Authorization  Access Bearer Token of a User with access to the module.
   *
   * @apiParam (Body parameters) {String}   email       App email
   * @apiParam (Body parameters) {String}   title       App title
   * @apiParam (Body parameters) {String}   app_id      App id
   * @apiParam (Body parameters) {String}   api_key     App key
   *
   * @apiSuccess {String}   title       App title
   * @apiSuccess {String}   app_id      App id
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *        "title": "John app",
   *        "app_id": "ZAEAZDAZ6464554Z6AZ4EA654EAZ",
   *     }
   *
   * @apiError (401) Unauthorized Unauthorized
   * @apiError (422) MissingRequiredFields Missing required fields
   * @apiError (422) InvalidBodyFields Invalid body fields
   * @apiError (422) AppIdAlreadyTaken App id is already taken
   * @apiError (500) ServerInternalError Server error
   */
  router.post('/apps', passport.accessTokenStrategy, app.createNewApp);
};

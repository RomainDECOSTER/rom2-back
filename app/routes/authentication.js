const authenticationController = require('../controllers').authentication;

module.exports = (router, passport) => {
  /**
   * @api {post} /auth/login Login User
   * @apiVersion 1.0.0
   * @apiName AuthenticationLogin
   * @apiGroup Authentication
   * @apiPermission None
   * @apiPrivate
   *
   * @apiParam (Body parameters) {String} username     User email
   * @apiParam (Body parameters) {String} password  User password
   *
   * @apiSuccess {Object} access_token    Access Token Object for the user with its expiration timestamp (in seconds).
   * @apiSuccess {Object} refresh_token   Refresh Token Object for the user with its expiration timestamp (in seconds).
   * @apiSuccess {Object} user            User informations object.
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "refresh_token": {
   *         "token": "AfhfEZusei.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ",
   *         "expires_at" : "1459828990"
   *       },
   *       "access_token": {
   *         "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ",
   *         "expires_at" : "1449828990"
   *       },
   *       "user": {
   *         "email": "john.doe@lacle.fr",
   *         "firstname": "John",
   *         "lastname": "Doe"
   *       }
   *     }
   *
   * @apiError (401) InvalidCredentials Invalid email or password
   * @apiError (422) MissingRequiredFields MissingRequiredFields
   * @apiError (500) ServerInternalError Server error
   */
  router.post('/auth/login', authenticationController.loginUser);

  /**
   * @api {post} /auth/app Login App
   * @apiVersion 1.0.0
   * @apiName AuthenticationApp
   * @apiGroup Authentication
   * @apiPermission None
   *
   * @apiParam (Body parameters) {String} app_id   App id.
   * @apiParam (Body parameters) {String} api_key  API secret key.
   *
   * @apiSuccess {Object} access_token    Access Token Object for the user with its expiration timestamp (in seconds).
   * @apiSuccess {Object} refresh_token   Refresh Token Object for the user with its expiration timestamp (in seconds).
   * @apiSuccess {Object} app            User informations object.
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "refresh_token": {
   *         "token": "AfhfEZusei.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ",
   *         "expires_at" : "1459828990"
   *       },
   *       "access_token": {
   *         "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ",
   *         "expires_at" : "1449828990"
   *       },
   *       "app": {
   *         "app_id": "LZEINFIZENFOIE54EZF4ZE",
   *         "title": "Test app",
   *       }
   *     }
   *
   * @apiError (401) InvalidCredentials Invalid email or password
   * @apiError (422) MissingRequiredFields MissingRequiredFields
   * @apiError (500) ServerInternalError Server error
   */
  router.post('/auth/app', authenticationController.loginApp);

  /**
   * @api {get} /auth/request_access_token Get new access and refresh tokens
   * @apiVersion 1.0.0
   * @apiName AuthenticationRefresh
   * @apiGroup Authentication
   * @apiPermission Header refresh token of user or app
   *
   * @apiHeader {String} Authorization    Refresh Bearer Token.
   *
   * @apiSuccess {Object} access_token    Access Token Object for the user with its expiration timestamp (in seconds).
   * @apiSuccess {Object} refresh_token   Refresh Token Object for the user with its expiration timestamp (in seconds).
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "refresh_token": {
   *         "token": "AfhfEZusei.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ",
   *         "expires_at" : "1459828990"
   *       },
   *       "access_token": {
   *         "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ",
   *         "expires_at" : "1449828990"
   *       }
   *     }
   *
   * @apiError (401) Unauthorized Unauthorized
   * @apiError (500) ServerInternalError Server error
   */
  router.get('/auth/request_access_token', passport.refreshTokenStrategy, authenticationController.refreshTokens);
};

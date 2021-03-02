const PermissionGuard = require('../../config/guard');
const SCOPE_PERMISSION = require('../../config/scopes');
const user = require('../controllers/user');

module.exports = (router, passport) => {
  /**
   * @api {post} /users Create new user
   * @apiVersion 1.0.0
   * @apiName UsersCreate
   * @apiGroup Users
   *
   * @apiHeader {String} Authorization  Access Bearer Token of a User with access to the module.
   *
   * @apiParam (Body parameters) {String}   email       User email
   * @apiParam (Body parameters) {String}   firstname   User first name
   * @apiParam (Body parameters) {String}   lastname    User last name
   *
   * @apiSuccess {String}   email       Email address of the created user.
   * @apiSuccess {String}   firstname   Firstname of the created user.
   * @apiSuccess {String}   lastname    Lastname of the created user.
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *        "email": "john.doe@lacle.fr",
   *        "firstname": "John",
   *        "lastname": "Doe"
   *     }
   *
   * @apiError (401) Unauthorized Unauthorized
   * @apiError (422) MissingRequiredFields Missing required fields
   * @apiError (422) InvalidBodyFields Invalid body fields
   * @apiError (422) EmailAlreadyTaken Email address is already taken
   * @apiError (500) ServerInternalError Server error
   */
  router.post('/users', passport.accessTokenStrategy, PermissionGuard.check(SCOPE_PERMISSION.USERS_WRITE), user.createNewUser);

  /**
   * @api {post} /users/password Set password
   * @apiVersion 1.0.0
   * @apiName UsersSetPassword
   * @apiGroup Users
   *
   * @apiHeader {String} Authorization  Confirm Bearer Token of the User.
   *
   * @apiParam (Body Parameters) {String} password Password defined by the user.
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 204 OK
   *
   * @apiError (401) Unauthorized Unauthorized
   * @apiError (422) MissingRequiredFields Missing required fields
   * @apiError (500) ServerInternalError Server error
   */
  router.post('/users/password', passport.confirmTokenStrategy, user.setPassword);

  /**
   * @api {get} /me Get connected user informations
   * @apiVersion 1.0.0
   * @apiName UsersMe
   * @apiGroup Users
   *
   * @apiHeader {String} Authorization  Access Bearer Token of a User with access to the module.
   *
   * @apiSuccess {String}   email       Email address of the created user.
   * @apiSuccess {String}   firstname   Firstname of the created user.
   * @apiSuccess {String}   lastname    Lastname of the created user.
   * @apiSuccess {String}   _id         User object id
   * @apiSuccess {String}   status      User status
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *        "email": "john.doe@lacle.fr",
   *        "firstname": "John",
   *        "lastname": "Doe",
   *        "_id": "5fac29f8cf4b3e52e7beaac9",
   *        "status": "active"
   *     }
   *
   * @apiError (401) Unauthorized Unauthorized
   * @apiError (500) ServerInternalError Server error
   */
  router.get('/users/me', passport.accessTokenStrategy, user.me);

  router.get('/users', passport.accessTokenStrategy, PermissionGuard.check(SCOPE_PERMISSION.USERS_READ), user.find);
  router.put('/users/:id', passport.accessTokenStrategy, PermissionGuard.check(SCOPE_PERMISSION.USERS_WRITE), user.update);
  router.delete('/users/:id', passport.accessTokenStrategy, PermissionGuard.check(SCOPE_PERMISSION.USERS_DELETE), user.delete);
  router.get('/users/:id', passport.accessTokenStrategy, PermissionGuard.check(SCOPE_PERMISSION.USERS_READ), user.retrieved);
};

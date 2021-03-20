function error(code, name, description) {
  return {
    code,
    response: {
      error: name,
      description,
    },
  };
}

module.exports = {
  ServerError: error(500, 'ServerError', 'Server error.'),
  InvalidCredentials: error(401, 'InvalidCredentials', 'Invalid email or password.'),
  InvalidAppCredentials: error(401, 'InvalidCredentials', 'Invalid app_id or api_key.'),
  Unauthorized: error(401, 'Unauthorized', 'Access denied.'),
  TokenExpired: error(422, 'TokenExpired', 'The given token is expired.'),
  RouteNotFound: error(404, 'RouteNotFound', 'Route not found.'),
  MissingRequiredFields: error(422, 'MissingRequiredFields', 'Missing required fields.'),
  EmailAlreadyTaken: error(422, 'EmailAlreadyTaken', 'Email address is already taken.'),
  AppIdAlreadyTaken: error(422, 'AppIdAlreadyTaken', 'App id address is already taken.'),
  InvalidBodyFields: error(422, 'InvalidBodyFields', 'Invalid body fields.'),
  InvalidQueryFields: error(422, 'InvalidQueryFields', 'Invalid query fields.'),
  UserNotFound: error(422, 'UserNotFound', 'No corresponding user was found in our records.'),
  UserAccountNotActive: error(422, 'UserAccountNotActive', 'User account is not active'),
  NotFound: error(422, 'NotFound', 'No corresponding records was found in our records.'),
};

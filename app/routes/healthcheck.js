const healthcheckController = require('app/controllers').healthcheck;

module.exports = router => {
  /**
   * @api {get} /healthcheck Healthcheck Check service
   * @apiVersion 1.0.0
   * @apiPrivate
   * @apiName Healthcheck
   * @apiGroup Healthcheck
   
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
           "model_version_status": [
             {
               "version": "1.1.0",
               "state": "AVAILABLE",
               "status": {
                 "error_code": "OK",
                 "error_message": ""
               }
             }
           ]
         }
   *
   * @apiError (500) ServerInternalError Server error.
   */
  router.get('/healthcheck', healthcheckController.healthcheck);
};

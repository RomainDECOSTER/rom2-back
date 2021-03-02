const pjson = require('../../package.json');

module.exports = {
  healthcheck: (req, res) => {
    return res.json({
      model_version_status: [
        {
          version: pjson.version,
          state: 'AVAILABLE',
          status: {
            error_code: 'OK',
            error_message: '',
          },
        },
      ],
    });
  },
};

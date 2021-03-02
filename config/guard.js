const PermissionGuard = require('express-jwt-permissions')({
  requestProperty: 'entity',
  permissionsProperty: 'scopes',
});

module.exports = PermissionGuard;

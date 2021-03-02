const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const passport = require('./config/passport');
const initRouter = require('./app/routes');
const logger = require('./app/tools/logger');
const { errors, infos } = require('./config/codes');

// Init Express
const app = express();
app.config = require('./config/application');

/* Body Parser Initialization */
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use(passport.initialize());

/* Set Access control Headers */
app.use(app.config.setAccessControlHeaders);

/* GLOBAL Controller */
app.disable('x-powered-by');

const router = express.Router();
initRouter(router, passport);
app.use('', router);
app.use('/v:version/', router);

app.use((req, res) => {
  logger.logAndRespond(res, errors.api.RouteNotFound);
});

const { PORT } = app.config;
app.listen(PORT, () => {
  logger.info('server started', infos.server.SERVER_STARTED, { port: PORT });
});

const mongoose = require('mongoose');

const config = require('config/application');
const logger = require('app/tools/logger');
const { errors, infos } = require('config/codes');

mongoose.Promise = global.Promise;

/*
  Connection to lacle_database
*/

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
};

const connectionString = `${config.MONGO.DATABASE.URL}/${config.MONGO.DATABASE.NAME}`;
const mongoDatabase = mongoose.createConnection(connectionString, options);

mongoDatabase.on('error', err => {
  logger.error('MongoDB[mongo_database]: Error with Mongodb', errors.server.MONGODB_ERROR, { err });
});

mongoDatabase.on('connected', () => {
  logger.info('MongoDB[mongo_database]: Connection is done.', infos.server.MONGODB_CONNECTION_DONE);
});

mongoDatabase.on('open', () => {
  logger.info('MongoDB[mongo_database]: Connection is open.', infos.server.MONGODB_CONNECTION_OPEN);
});

mongoDatabase.on('disconnected', () => {
  logger.warn('MongoDB[mongo_database]: Connection is disconnected.', infos.server.MONGODB_CONNECTION_DISCONNECTED);
});

mongoDatabase.on('close', () => {
  logger.warn('MongoDB[mongo_database]: Connection is closed.', infos.server.MONGODB_CONNECTION_CLOSE);
});

module.exports = mongoDatabase;

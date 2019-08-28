const { config } = require('./../config');
const mongoose = require('mongoose');

function initDB() {
  // const MONGO_URI = `mongodb://${config.dbUser}:${config.dbPassword}@${config.dbHost}:${config.dbPort}/${config.dbName}?authSource=admin`; // prettier-ignore
  const MONGO_URI = `mongodb://${config.dbHost}:${config.dbPort}/${config.dbName}?authSource=admin`; // prettier-ignore

  mongoose.set('useCreateIndex', true);
  return mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useFindAndModify: false
    // authMechanism: 'SCRAM-SHA-256'
  });
}

module.exports = {
  initDB
};

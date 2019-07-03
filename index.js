const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const path = require('path');
const debug = require('debug')('app:server');
const mongoose = require('mongoose');

const { config } = require('./config');
const { authRouter } = require('./routes');

const boom = require('@hapi/boom');

const {
  logErrors,
  wrapErrors,
  clientErrorHandler
} = require('./utils/middlewares/errorsHandlers');

// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// cors
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'POST, GET, OPTIONS, PUT, DELETE, PATCH'
  );
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-Requested-With'
  );
  next();
});

// app.use(bodyParser.json({ limit: '50mb' }));
// app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// static files
app.use('/public', express.static(path.join(__dirname, 'public')));

// routes
app.use('/api/auth', authRouter);

// error handlers
app.use(logErrors);
app.use(wrapErrors);
app.use(clientErrorHandler);

// not found
app.use(function(req, res, next) {
  const {
    output: { statusCode, payload }
  } = boom.notFound();

  res.status(statusCode).json(payload);
});

(async function() {
  // database connect

  const MONGO_URI = `mongodb://${config.dbHost}/${config.dbName}`;
  mongoose.set('useCreateIndex', true);
  await mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useFindAndModify: false
  });

  // server
  const server = app.listen(8000, function() {
    debug(`Listening http://localhost:${server.address().port}`);
  });
})();

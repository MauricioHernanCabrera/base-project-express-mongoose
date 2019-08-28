const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const path = require('path');
const debug = require('debug')('app:server');

const { initDB } = require('./utils/db');
const { AuthRouter, UserRouter } = require('./routes');

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
app.use('/auth', AuthRouter);
app.use('/users', UserRouter);

// error handlers
app.use(logErrors);
app.use(wrapErrors);
app.use(clientErrorHandler);

// not found
app.use((req, res, next) => {
  const {
    output: { statusCode, payload }
  } = boom.notFound();

  res.status(statusCode).json(payload);
});

(async () => {
  const { host = 'localhost', port = '8000' } = process.env;
  // database connect

  await initDB();

  // server
  const server = app.listen(port, function() {
    debug(`Listening http://${host}:${server.address().port}`);
  });
})();

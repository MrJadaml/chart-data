const express = require('express');
const logger = require('morgan');
const db = require('monk')('localhost/iunu');
const Sensors = db.get('sensors');
const app = express();

app.use(logger('dev'));

app.get('/chartdata', (_req, res, _next) => {
  res.json('hello world');
});

app.use((_req, _res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

if (app.get('env') === 'development') {
  app.use((err, _req, res, _next) => {
    res.status(err.status || 500)
    .send({
      message: err.message,
      error: err
    });
  });
}

app.use((err, _req, res, _next) => {
  res.status(err.status || 500)
  .send({
    message: err.message,
    error: {}
  });
});

module.exports = app;

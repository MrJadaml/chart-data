const express = require('express');
const logger = require('morgan');
const app = express();

app.use(logger('dev'));

app.get('/', (_req, res, _next) => {
  res.send('Hellow');
});

module.exports = app;

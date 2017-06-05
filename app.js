const express = require('express');
const logger = require('morgan');
const db = require('monk')('localhost/iunu');
const Sensors = db.get('sensors');
const app = express();

const Sensor = require('./models/sensor.js');

app.use(logger('dev'));

app.get('/chartdata', (req, res, next) => {
  const { title, room, startDate, length } = req.query;

  if ( !title || !room || !startDate ) {
    const err = new Error();
    err.status = 400;
    err.message = 'Missing room, start_date, or title';
    return next(err);
  }

  Sensor.getChartData(title, room, startDate, length)
  .then(data => {
    let timeBlocks = Sensor.buildDataPulse(data, startDate);
    let chartPoints = timeBlocks.map(Sensor.buildChartPoint);

    res.json(chartPoints);
  });
});

app.use((_req, _res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

if (app.get('env') === 'development') {
  app.use((err, _req, res, _next) => {
    res.status(err.status || 500)
    .json({
      message: err.message,
      error: err
    });
  });
}

app.use((err, _req, res, _next) => {
  res.status(err.status || 500)
  .json({
    message: err.message,
    error: {}
  });
});

module.exports = app;

const express = require('express');
const logger = require('morgan');
const db = require('monk')('localhost/iunu');
const Sensors = db.get('sensors');
const app = express();

app.use(logger('dev'));

app.get('/chartdata', (req, res, next) => {
  const { title, room, startDate, length } = req.query;

  const tenMin = 600000
  const seventyTwoHrs = 259200000;
  const startPlusThreeDays = new Date(new Date(startDate).getTime() + seventyTwoHrs);
  const endDate = length || startPlusThreeDays;

  const tenMinSegments = (new Date(endDate).getTime() - new Date(startDate).getTime()) / tenMin;

  if ( !title || !room || !startDate ) {
    const err = new Error();
    err.status = 400;
    err.message = 'Missing room, start_date, or title';
    return next(err);
  }

  Sensors.find({ title, room, timestamp: { $gte: new Date(startDate), $lt: new Date(endDate) } })
  .then(data => {
    const sortedData = data.sort((a,b) => new Date(a.timestamp, b.timestamp));
    let index = 0;
    let endOfTimeBlock = new Date(startDate).getTime() + tenMin;
    let timeBlocks = [];
    let charPoints = [];

    sortedData.forEach(reading => {
      if (new Date(reading.timestamp).getTime() > endOfTimeBlock) {
        endOfTimeBlock += tenMin;
        index++;
      }

      if (timeBlocks[index] instanceof Array) {
        timeBlocks[index].push({
          timestamp: new Date(endOfTimeBlock - tenMin),
          value: reading.value,
        });
      } else {
        timeBlocks[index] = [{
          timestamp: new Date(endOfTimeBlock - tenMin),
          value: reading.value,
        }];
      }
    });

    timeBlocks.forEach(set => {
      let chartPoint;
      let avg = 0;

      set.forEach(reading => {
        avg = avg + parseInt(reading.value)
      });

      chartPoint = {timestamp: set[0].timestamp, value: avg / set.length}
      charPoints.push(chartPoint);
    });

    res.json(charPoints);
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

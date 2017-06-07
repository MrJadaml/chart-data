const express = require('express');
const router = express.Router();
const Sensor = require('../models/sensor');

router.get('/', (req, res, next) => {
  const { title, room, startDate, length } = req.query;

  if ( !title || !room || !startDate ) {
    const err = new Error();

    err.status = 400;
    err.message = 'Missing room, start_date, or title';
    return next(err);
  }

  Sensor.getChartData(title, room, startDate, length)
  .then(data => {
    let chartData = Sensor.buildDataPulse(data, startDate);
    res.json(chartData);
  });
});

module.exports = router;

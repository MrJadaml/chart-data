const db = require('monk')('localhost/iunu');
const Sensors = db.get('sensors');

const Sensor = {
  getChartData(title, room, startDate, length) {
    const seventyTwoHrs = 259200000;
    const startPlusThreeDays = new Date(this.toMilliSec(startDate) + seventyTwoHrs);
    const endDate = length || startPlusThreeDays;

    return Sensors.find({ title, room, timestamp: { $gte: new Date(startDate), $lt: new Date(endDate) } });
  },

  buildDataPulse(sensorData, startDate, timeblock = 600000) {
    const sortedData = sensorData.sort((a,b) => new Date(a.timestamp, b.timestamp));
    const blah = {
      timeblock,
      timeBlocks: [],
      timeBlockLimit: this.toMilliSec(startDate) + timeblock,
      lastItemIdx: sortedData.length - 1,
      count: 0,
      avg: 0,
    }

    const chartData = sortedData.forEach((reading, idx) => {
      return this.buildChartPoint(reading, blah, idx)
    });

    return chartData;
  },

  buildChartPoint(reading, blah, idx) {
    let readingValue = parseFloat(reading.value);
    let isLastItem = idx === blah.lastItemIdx;
    let pastCurrentTimeBlock = this.toMilliSec(reading.timestamp) > blah.timeBlockLimit;

    if (pastCurrentTimeBlock) {
      let value = blah.avg / blah.count;

      blah.timeBlocks.push({ timestamp: new Date(blah.timeBlockLimit), value });
      blah.timeBlockLimit += blah.timeblock;
      blah.count = 0;
      blah.avg = 0;
    }

    blah.count++;
    blah.avg += readingValue;

    if (isLastItem) {
      let value = blah.avg / blah.count;
      blah.timeBlocks.push({ timestamp: new Date(blah.timeBlockLimit), value });
    }
  },

  toMilliSec(date) {
    return new Date(date).getTime();
  },
}

module.exports = Sensor;

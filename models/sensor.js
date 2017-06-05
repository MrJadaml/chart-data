const db = require('monk')('localhost/iunu');
const Sensors = db.get('sensors');

const Sensor = {
  getChartData(title, room, startDate, length) {
    const seventyTwoHrs = 259200000;
    const startPlusThreeDays = new Date(this.toMilliSec(startDate) + seventyTwoHrs);
    const endDate = length || startPlusThreeDays;

    return Sensors.find({ title, room, timestamp: { $gte: new Date(startDate), $lt: new Date(endDate) } });
  },

  buildChartPoint(timeBlockSet) {
    let avg = 0;
    let chartPoint;
    let value;
    let timestamp = timeBlockSet[0].timestamp;
    let size = timeBlockSet.length;

    timeBlockSet.forEach(reading => {
      let readingValue = parseFloat(reading.value);

      if ( (typeof readingValue !== 'number') || isNaN(readingValue) ) {
        size--;
        return
      }

      avg += readingValue;
    });

    value = avg / size;

    return { timestamp, value }
  },

  buildDataPulse(sensorData, startDate, timeblock = 600000) {
    const sortedData = sensorData.sort((a,b) => new Date(a.timestamp, b.timestamp));
    let timeBlocks = [];
    let endOfTimeBlock = this.toMilliSec(startDate) + timeblock;
    let idx = 0;
    let isArray;

    sortedData.forEach(reading => {
      let newReading;

      if (this.toMilliSec(reading.timestamp) > endOfTimeBlock) {
        endOfTimeBlock += timeblock;
        idx++;
      }

      newReading = { timestamp: new Date(endOfTimeBlock), value: reading.value, }
      isArray = timeBlocks[idx] instanceof Array;

      isArray ? timeBlocks[idx].push(newReading) : timeBlocks[idx] = [newReading];
    });

    return timeBlocks;
  },

  toMilliSec(date) {
    return new Date(date).getTime();
  },
}

module.exports = Sensor;

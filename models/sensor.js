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
    let timeBlocks = [];
    let timeBlockLimit = this.toMilliSec(startDate) + timeblock;
    let count = 0;
    let avg = 0;

    sortedData.forEach((reading, idx) => {
      let readingValue = parseFloat(reading.value);
      let lastItem = idx === sortedData.length - 1;
      let pastCurrentTimeBlock = this.toMilliSec(reading.timestamp) > timeBlockLimit;

      let isReadingValNotNum = typeof readingValue !== 'number';
      let isReadingValNaN = isNaN(readingValue);

      if ( isReadingValNotNum || isReadingValNaN ) {
        return
      }


      if (pastCurrentTimeBlock) {
        let value = avg / count;

        timeBlocks.push({ timestamp: new Date(timeBlockLimit), value });
        timeBlockLimit += timeblock;
        count = 0;
        avg = 0;
      }

      count++;
      avg += readingValue;

      if (lastItem) {
        let value = avg / count;
        timeBlocks.push({ timestamp: new Date(timeBlockLimit), value });
      }
    });

    return timeBlocks;
  },

  toMilliSec(date) {
    return new Date(date).getTime();
  },
}

module.exports = Sensor;

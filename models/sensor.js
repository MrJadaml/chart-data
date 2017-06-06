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
      let lastItem;
      let pastCurrentTimeBlock = this.toMilliSec(reading.timestamp) > timeBlockLimit;
      const readingValue = parseFloat(reading.value);
      const isReadingValNotNum = typeof readingValue !== 'number';
      const isReadingValNaN = isNaN(readingValue);
      const isReadingValZero = readingValue === 0;

      if (isReadingValNotNum || isReadingValNaN || isReadingValZero) return

      if (pastCurrentTimeBlock) {
        const timestamp = new Date(timeBlockLimit);
        const value = avg / count;

        timeBlocks.push({ timestamp, value });
        timeBlockLimit += timeblock;
        count = 0;
        avg = 0;
      }

      count++;
      avg += readingValue;
      isLastItem = idx === sortedData.length - 1;

      if (isLastItem) {
        const timestamp = new Date(timeBlockLimit);
        const value = avg / count;

        timeBlocks.push({ timestamp, value });
      }
    });

    return timeBlocks;
  },

  toMilliSec(date) {
    return new Date(date).getTime();
  },
}

module.exports = Sensor;

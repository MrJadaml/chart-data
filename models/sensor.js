const db = require('monk')('localhost/iunu');
const Sensors = db.get('sensors');

const Sensor = {
  prevTimeBlock: [{ timestamp: 4242424242, value: 0 }], // temp startdate before structure swap

  getChartData(title, room, startDate, length) {
    const seventyTwoHrs = 259200000;
    const startPlusThreeDays = new Date(this.toMilliSec(startDate) + seventyTwoHrs);
    const endDate = length || startPlusThreeDays;

    return Sensors.find({ title, room, timestamp: { $gte: new Date(startDate), $lt: new Date(endDate) } });
  },

  buildChartPoint(timeBlockSet) {
    if (timeBlockSet.length === 0) {
      return this.prevTimeBlock;
    }

    let avg = 0;
    let value;
    let timestamp = timeBlockSet[0].timestamp;
    let size = timeBlockSet.length;

    timeBlockSet.forEach(reading => {
      let readingValue = parseFloat(reading.value);
      let isReadingValNum = typeof readingValue !== 'number';
      let isReadingValNaN = isNaN(readingValue);
      let isReadingValZero = readingValue === 0;

      if ( isReadingValNum || isReadingValNaN || isReadingValZero ) {
        size--;
        return
      }

      avg += readingValue;
    });

    value = avg / size;

    this.prevTimeBlock = { timestamp, value };
    return { timestamp, value }
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

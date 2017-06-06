'use strict';

const chai = require('chai')
const should = chai.should();
const app = require('../app');
const Sensor = require('../models/sensor');

describe('Sensor Model', () => {
  context('#buildDataPulse', () => {
    it.only('should return an array of chartPoint objects', () => {
      const startDate = '2017-01-24T14:10:00.594Z';
      const sensorData = [{
          "title": "vpd",
          "value": "10.0858810644",
          "sensor_num": "METEOMK1-7FADC",
          "room": "Hoop 1",
          "sensor_version": "1.00",
          "timestamp": new Date("2017-01-24T14:10:39.594Z"),
          "hostname": "cam0243",
          "vpd": "10.0858810644",
          "sensor_group": "Production",
          "role": "plant cam",
          "type": "vpd",
        }, {
          "title": "vpd",
          "value": "7.68855202804",
          "sensor_num": "METEOMK1-7FAAB",
          "room": "Hoop 1",
          "sensor_version": "1.00",
          "timestamp": new Date("2017-01-24T14:13:15.156Z"),
          "hostname": "cam0271",
          "vpd": "7.68855202804",
          "sensor_group": "Production",
          "role": "plant cam",
          "type": "vpd",
        }, {
          "title": "vpd",
          "value": "11.1858810644",
          "sensor_num": "METEOMK1-7FADC",
          "room": "Hoop 1",
          "sensor_version": "1.00",
          "timestamp": new Date("2017-01-24T14:23:16.594Z"),
          "hostname": "cam0243",
          "vpd": "11.1858810644",
          "sensor_group": "Production",
          "role": "plant cam",
          "type": "vpd",
        }, {
          "title": "vpd",
          "value": "9.88855202804",
          "sensor_num": "METEOMK1-7FAAB",
          "room": "Hoop 1",
          "sensor_version": "1.00",
          "timestamp": new Date("2017-01-24T14:27:35.156Z"),
          "hostname": "cam0271",
          "vpd": "9.88855202804",
          "sensor_group": "Production",
          "role": "plant cam",
          "type": "vpd",
      }];

      const actual = Sensor.buildDataPulse(sensorData, startDate);
      console.log(actual)

      actual.should.be.an('array')
      .with.lengthOf(2);
      actual[0].should.be.an('object')
      .and.have.ownPropertyDescriptor('timestamp', {
        configurable: true,
        enumerable: true,
        writable: true,
        value: new Date ('2017-01-24T14:20:00.594Z'),
      });
      actual[0].should.be.an('object')
      .and.have.ownPropertyDescriptor('value', {
        configurable: true,
        enumerable: true,
        writable: true,
        value: 8.88721654622,
      });
      actual[1].should.be.an('object')
      .and.have.ownPropertyDescriptor('timestamp', {
        configurable: true,
        enumerable: true,
        writable: true,
        value: new Date ('2017-01-24T14:30:00.594Z'),
      });
      actual[1].should.be.an('object')
      .and.have.ownPropertyDescriptor('value', {
        configurable: true,
        enumerable: true,
        writable: true,
        value: 10.53721654622,
      });
    });
  });

  context.only('#buildChartPoint', () => {
    it('should return an object w/ valid timestamp and value', () => {
      const timeBlockSet = [{
          "title": "vpd",
          "value": "10.0858810644",
          "sensor_num": "METEOMK1-7FADC",
          "room": "Hoop 1",
          "sensor_version": "1.00",
          "timestamp": new Date("2017-01-24T14:10:39.594Z"),
          "hostname": "cam0243",
          "vpd": "10.0858810644",
          "sensor_group": "Production",
          "role": "plant cam",
          "type": "vpd",
        }, {
          "title": "vpd",
          "value": "7.68855202804",
          "sensor_num": "METEOMK1-7FAAB",
          "room": "Hoop 1",
          "sensor_version": "1.00",
          "timestamp": new Date("2017-01-24T14:21:15.156Z"),
          "hostname": "cam0271",
          "vpd": "7.68855202804",
          "sensor_group": "Production",
          "role": "plant cam",
          "type": "vpd",
      }];

      const actual = Sensor.buildChartPoint(timeBlockSet)

      actual.should.be.an('object');
      actual.should.have.ownPropertyDescriptor('timestamp', {
        configurable: true,
        enumerable: true,
        writable: true,
        value: new Date ('2017-01-24T14:10:39.594Z'),
      });
      actual.should.have.ownPropertyDescriptor('value', {
        configurable: true,
        enumerable: true,
        writable: true,
        value: 8.88721654622,
      });
    });

    it('should ignore readings with missing/NaN `value`s', () => {
      const timeBlockSet = [{
          "title": "vpd",
          "value": "",
          "sensor_num": "METEOMK1-7FADC",
          "room": "Hoop 1",
          "sensor_version": "1.00",
          "timestamp": new Date("2017-01-24T14:10:39.594Z"),
          "hostname": "cam0243",
          "vpd": "10.0858810644",
          "sensor_group": "Production",
          "role": "plant cam",
          "type": "vpd",
        }, {
          "title": "vpd",
          "value": "7.68855202804",
          "sensor_num": "METEOMK1-7FAAB",
          "room": "Hoop 1",
          "sensor_version": "1.00",
          "timestamp": new Date("2017-01-24T14:21:15.156Z"),
          "hostname": "cam0271",
          "vpd": "7.68855202804",
          "sensor_group": "Production",
          "role": "plant cam",
          "type": "vpd",
      }];

      const actual = Sensor.buildChartPoint(timeBlockSet)

      actual.should.be.an('object');
      actual.should.have.ownPropertyDescriptor('value', {
        configurable: true,
        enumerable: true,
        writable: true,
        value: 7.68855202804,
      });
    });

    it('should ignore readings with a 0 `value`', () => {
      const timeBlockSet = [{
          "title": "vpd",
          "value": "0",
          "sensor_num": "METEOMK1-7FADC",
          "room": "Hoop 1",
          "sensor_version": "1.00",
          "timestamp": new Date("2017-01-24T14:10:39.594Z"),
          "hostname": "cam0243",
          "vpd": "0",
          "sensor_group": "Production",
          "role": "plant cam",
          "type": "vpd",
        }, {
          "title": "vpd",
          "value": "7.68855202804",
          "sensor_num": "METEOMK1-7FAAB",
          "room": "Hoop 1",
          "sensor_version": "1.00",
          "timestamp": new Date("2017-01-24T14:21:15.156Z"),
          "hostname": "cam0271",
          "vpd": "7.68855202804",
          "sensor_group": "Production",
          "role": "plant cam",
          "type": "vpd",
      }];

      const actual = Sensor.buildChartPoint(timeBlockSet)

      actual.should.be.an('object');
      actual.should.have.ownPropertyDescriptor('value', {
        configurable: true,
        enumerable: true,
        writable: true,
        value: 7.68855202804,
      });
    });

    it('should set chartpoint to previous time block if it is an empty array', () => {
      const timeBlockSet = [{
          "title": "vpd",
          "value": "0",
          "sensor_num": "METEOMK1-7FADC",
          "room": "Hoop 1",
          "sensor_version": "1.00",
          "timestamp": new Date("2017-01-24T14:10:39.594Z"),
          "hostname": "cam0243",
          "vpd": "0",
          "sensor_group": "Production",
          "role": "plant cam",
          "type": "vpd",
        }, {
          "title": "vpd",
          "value": "7.68855202804",
          "sensor_num": "METEOMK1-7FAAB",
          "room": "Hoop 1",
          "sensor_version": "1.00",
          "timestamp": new Date("2017-01-24T14:21:15.156Z"),
          "hostname": "cam0271",
          "vpd": "7.68855202804",
          "sensor_group": "Production",
          "role": "plant cam",
          "type": "vpd",
      }];

      Sensor.buildChartPoint(timeBlockSet)
      const actual = Sensor.buildChartPoint([])

      actual.should.be.an('object');
      actual.should.have.ownPropertyDescriptor('value', {
        configurable: true,
        enumerable: true,
        writable: true,
        value: 7.68855202804,
      });
    });
  });
});

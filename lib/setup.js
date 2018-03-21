var SerialPort = require('serialport');
var Promise = require('bluebird');
var connect = require('./connect.js');

module.exports = function() {

  // first, we list all connected USB devices
  return listUsbDevices()
    .then(function(ports) {
	
		sails.log.info(`List of available connected Arduinos(pick the name of the one with RFLink and put it -as it is- in the Serial_tty variable on Gladys):`);
      // we keep only the arduinos
      return filterArduino(ports);
    })
};

function filterArduino(ports) {
  var arduinos = [];

  // foreach port we test if it is an arduino
  ports.forEach(function(port) {
    if (port.manufacturer && port.manufacturer.toLowerCase().search("arduino") != -1) {
      sails.log.info(`-` + port.comName);
	  arduinos.push(port);
    }
  });

  return Promise.resolve(arduinos);
}

function listUsbDevices() {
  return new Promise(function(resolve, reject) {
    SerialPort.list(function(err, ports) {
      if (err) return reject(new Error(err));

      return resolve(ports);
    });
  });
}
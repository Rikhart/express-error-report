'use strict';
var errorHandler = require('./error-handler.js')
var fs = require('fs-extra')
var file = '/template.html';

module.exports = function(app, config, mailconfig, aditionalConfig) {
  fs.readFile(__dirname + file, 'utf8', function(err, data) {
    if (!mailconfig.html) {
      mailconfig.html = data;
    }
    errorHandler(app, config, mailconfig, aditionalConfig)
  })
};

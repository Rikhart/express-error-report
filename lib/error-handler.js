'use strict';
var nodemailer = require('nodemailer');
var mg = require('nodemailer-mailgun-transport');
var Handlebars = require('handlebars');

var transporterConfig = {};
var transporterType;
var emailconfig;
var errorHandler = function(err, req, res, next) {
  if (!err.code || err.code == 500) {
    switch (transporterType) {
      case 'mailgun':
        var nodemailerMailgun = nodemailer.createTransport(mg(transporterConfig));
        if (emailconfig.html) {
          var template = Handlebars.compile(emailconfig.html);
          var data = {
            "error": String(err),
            "stacktrace": err.stack,
          };
          var result = template(data);
          emailconfig.html = result;
        }
        nodemailerMailgun.sendMail(emailconfig, function(err, info) {
          if (err) {
            console.log('Error: ' + err);
          } else {
            // console.log('Response: ', info);
          }
        });
        break;
      default:
    }
  }
  next();
}

module.exports = function(app, config, mailconfig, isLoopback) {
  if (!config) return console.log("put the transporter information");
  if (!mailconfig) return console.log('mailconfig empty');
  emailconfig = mailconfig
  switch (config.transporter) {
    case 'mailgun':
      transporterConfig.auth = config.auth;
      transporterType = 'mailgun';
      break;
  }
  if (isLoopback) {
    if (isLoopback.isLoopback) {
      app.get('remoting').errorHandler = {
        handler: errorHandler,
        disableStackTrace: true
      }
    } else {
      console.log("error");
    }
  } else {
    app.use(errorHandler);
  }
};

'use strict';
var nodemailer = require('nodemailer');
var mg = require('nodemailer-mailgun-transport');
var Handlebars = require('handlebars');
var transporterConfig = {};
var transporterType;
var emailconfig;
var localconfig = {
  watcherrCodes: []
};
var errorHandler = function(err, req, res, next) {
  var byPass = false;
  if (!localconfig.watcherrCodes.length) {
    byPass = true;
  } else {
    for (var item of localconfig.watcherrCodes) {
      if (item == String(err.code) || item == String(err.statusCode) || !err.code) {
        byPass = true;
      }
    }
  }
  if (byPass) {
    switch (transporterType) {
      case 'mailgun':
        var nodemailerMailgun = nodemailer.createTransport(mg(transporterConfig));
        if (emailconfig.html) {
          var template = Handlebars.compile(emailconfig.html);
          var data = {
            "error": String(err),
            "stacktrace": err.stack,
          };
          if (localconfig.isLoopback) {
            data["isLoopback"] = true;
            if (localconfig.loopbackremoteContext) {
              var rc = localconfig.loopbackremoteContext;
              if (rc.originalUrl) {
                data["originalUrl"] = req.loopbackremoteContext.domain.members[0].originalUrl;
              }
              if (rc.methodString) {
                data["methodString"] = req.loopbackremoteContext.methodString;
              }
              if (rc.args) {
                data["args"] = req.loopbackremoteContext.args;
              }
            }
          }
          var result = template(data);
          emailconfig.html = result;
        }
        nodemailerMailgun.sendMail(emailconfig, function(err, info) {
          if (err) {
            console.log('Error: ' + err);
          }
        });
        break;
      default:
    }
  }
  next();
}

module.exports = function(app, config, mailconfig, aditionalConfig) {
  if (!config) return console.log("put the transporter information");
  if (!mailconfig) return console.log('mailconfig empty');
  emailconfig = mailconfig
  localconfig = aditionalConfig;
  switch (config.transporter) {
    case 'mailgun':
      transporterConfig.auth = config.auth;
      transporterType = 'mailgun';
      break;
  }
  if (aditionalConfig) {
    if (aditionalConfig.isLoopback) {
      app.get('remoting').errorHandler = {
        handler: errorHandler,
        disableStackTrace: aditionalConfig.disableStackTrace
      }
    } else {
      app.use(errorHandler);
    }
  } else {
    app.use(errorHandler);
  }
};

'use strict';

var assert = require('assert');
var expressErrorReport = require('../lib');
var request = require('supertest');
var express = require('express')
var app = express();
// respond with "hello world" when a GET request is made to the homepage
app.get('/user', function(req, res, next) {
  var error = new Error()
  error.code = 401;
  throw error;
});

describe('express-error-report', function() {
  it('Configuracion del modulo en express', function(done) {
    expressErrorReport(app, {
      transporter: 'mailgun',
      auth: {
        api_key: 'key-1c7ba39832f834d3fec3a9c8cfdc5682',
        domain: 'kodevian.com'
      }
    }, {
      from: 'jholarck@gmail',
      to: 'jholarck@gmail.com',
      subject: 'Error Report',
      'h:Reply-To': 'hello@kodevian.com',
    }, {
      watcherrCodes: ["401", "500"],
      remotingContext: {
        originalUrl: true,
        args: true,
        methodString: true
      }
    });
    assert(true, 'Configuras el modulo');
    done();
  });
});

describe('express-error-report', function() {
  this.timeout(4000)
  it('Ocaciona un error', function(done) {
    request(app)
      .get('/user')
      .expect(200)
      .end(function(err, res) {
        if (!err) {
          done();
        } else {
          // done()
        }
      });
  });
})

# express-error-report [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]
> error reporting through mail

## Installation

```sh
$ npm install --save express-error-report
```

## Usage

```js
**Configuracion con mailgun:
Mailgun mapea dos item:

>{{error}}
>{{stacktrace}}

* Puedes utilizar un html personalizado, solo lo tienes que pasar como parametro 

var express = require('express')
var expressErrorReport = require('express-error-report');

var app = express();
expressErrorReport(app, {
  transporter: 'mailgun',
  auth: {
    api_key: 'key-mailgun',
    domain: 'kodevian.com'
  }
}, {
  from: 'jholarck@gmail',
  to: 'jholarck@gmail.com',
  subject: 'Error Report',
  'h:Reply-To': 'hello@kodevian.com',
  html:'en caso de no colocar mapeara el html por defecto, en caso de que desee personalizar utilice {{error}} y {{stacktrace}}'//
});
```
## License

Apache-2.0 © [rikhart]()


[npm-image]: https://badge.fury.io/js/express-error-report.svg
[npm-url]: https://npmjs.org/package/express-error-report
[travis-image]: https://travis-ci.org/Rikhart/express-error-report.svg?branch=master
[travis-url]: https://travis-ci.org/Rikhart/express-error-report
[daviddm-image]: https://david-dm.org/Rikhart/express-error-report.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/Rikhart/express-error-report

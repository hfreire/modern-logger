# A modern logger :page_with_curl: built on top of Winston with native support for emojis and Rollbar

[![Build Status](https://travis-ci.org/hfreire/modern-logger.svg?branch=master)](https://travis-ci.org/hfreire/modern-logger)
[![Coverage Status](https://coveralls.io/repos/github/hfreire/modern-logger/badge.svg?branch=master)](https://coveralls.io/github/hfreire/modern-logger?branch=master)
[![](https://img.shields.io/github/release/hfreire/modern-logger.svg)](https://github.com/hfreire/modern-logger/releases)
[![Version](https://img.shields.io/npm/v/modern-logger.svg)](https://www.npmjs.com/package/modern-logger)
[![Downloads](https://img.shields.io/npm/dt/modern-logger.svg)](https://www.npmjs.com/package/modern-logger) 

> A modern logger :page_with_curl: built on top of Winston with native support for emojis and Rollbar

### Features
* Uses [Winston](https://github.com/winstonjs/winston) logging library under the hood
* Enable [Rollbar](https://rollbar.com) error tracking service as a transport from the environment :white_check_mark: 
* Pick between [1341](https://raw.githubusercontent.com/omnidan/node-emoji/master/lib/emoji.json) emojis from [node-emoji](https://github.com/omnidan/node-emoji/) to give a little bit of more coolness :sunglasses: to your logs :page_with_curl: :white_check_mark:
* Supports [Bluebird](https://github.com/petkaantonov/bluebird) :bird: promises :white_check_mark:

### How to install
```
npm install modern-logger
```

### How to use

#### Use it in your app
```javascript
const Logger = require('modern-logger')

Logger.info('Launching :rocket: app to space :night_with_stars:')
```

#### Available environment variables
Variable | Description | Required | Default value
:---:|:---:|:---:|:---:
LOG_LEVEL | The log level verbosity. | false | `info`
ENVIRONMENT | The environment the app is running on. | false | `undefined`
VERSION | The version of the app. | false | `undefined`
VERSION_COMMIT | The current code commit of the app. | false | `undefined`
ROLLBAR_API_KEY | The server API key used to talk with Rollbar. | false | `undefined`

### How to contribute
You can contribute either with code (e.g., new features, bug fixes and documentation) or by [donating 5 EUR](https://paypal.me/hfreire/5). You can read the [contributing guidelines](CONTRIBUTING.md) for instructions on how to contribute with code. 

All donation proceedings will go to the [Sverige för UNHCR](https://sverigeforunhcr.se), a swedish partner of the [UNHCR - The UN Refugee Agency](http://www.unhcr.org), a global organisation dedicated to saving lives, protecting rights and building a better future for refugees, forcibly displaced communities and stateless people.

### Used by
* [serverful](https://github.com/hfreire/serverful) - A kickass :muscle: web server :scream_cat: with all the bells :bell: and whistles :sparkles:

### License
Read the [license](./LICENSE.md) for permissions and limitations.

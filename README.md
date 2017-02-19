# A modern logger :page_with_curl: built on top of Winston with native support for emojis and Rollbar

[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![Build Status](https://travis-ci.org/hfreire/modern-logger.svg?branch=master)](https://travis-ci.org/hfreire/modern-logger)
[![Coverage Status](https://coveralls.io/repos/github/hfreire/modern-logger/badge.svg?branch=master)](https://coveralls.io/github/hfreire/modern-logger?branch=master)
[![Greenkeeper badge](https://badges.greenkeeper.io/hfreire/modern-logger.svg)](https://greenkeeper.io/)
[![](https://img.shields.io/github/release/hfreire/modern-logger.svg)](https://github.com/hfreire/modern-logger/releases)
[![](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/npm/v/modern-logger.svg)](https://www.npmjs.com/package/modern-logger)
[![Downloads](https://img.shields.io/npm/dt/modern-logger.svg)](https://www.npmjs.com/package/modern-logger) 

### Features
* Uses [Winston](https://github.com/winstonjs/winston) logging library under the hood
* Enable [Rollbar](https://rollbar.com) error tracking service as a transport from the environment :white_check_mark: 
* Pick between [1341](https://raw.githubusercontent.com/omnidan/node-emoji/master/lib/emoji.json) emojis from [node-emoji](https://github.com/omnidan/node-emoji/) to give a little bit of more coolness :sunglasses: to your logs :page_with_curl: :white_check_mark:
* Supports [Bluebird](https://github.com/petkaantonov/bluebird) :bird: promises :white_check_mark:

### How to install
```
node install modern-logger
```

### How to use

#### Available environment variables
Variable | Description | Default value
 --- |:---:|:---:
ENVIRONMENT | The environment the app is running on | `not used`
VERSION | The version of the app | `not used`
VERSION_COMMIT | The current code commit of the app | `not used`
ROLLBAR_API_KEY | The server API key used to talk with Rollbar | `not used`

#### Use it in your app
```javascript
const Logger = require('modern-logger')

Logger.info('Launching :rocket: app to space :night_with_stars:')
```

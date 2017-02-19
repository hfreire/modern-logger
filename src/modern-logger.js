/*
 * Copyright (c) 2017, Hugo Freire <hugo@exec.sh>.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

const LOG_LEVEL = process.env.LOG_LEVEL || 'info'

const ROLLBAR_API_KEY = process.env.ROLLBAR_API_KEY

const Promise = require('bluebird')

const moment = require('moment')

const winston = Promise.promisifyAll(require('winston'))

class ModernLogger {
  constructor () {
    const transports = []

    transports.push(new winston.transports.Console({
      level: LOG_LEVEL,
      json: false,
      colorize: true,
      timestamp: () => moment().format('YYYY-MM-DDTHH:mm:ss,SSSZ'),
      handleExceptions: true,
      humanReadableUnhandledException: true
    }))

    if (ROLLBAR_API_KEY) {
      const RollbarTransport = require('./rollbar-transport')
      transports.push(new RollbarTransport())
    }

    this._logger = new winston.Logger({
      transports: transports,
      exitOnError: false
    })

    this.stream = {
      write: (message) => this._logger.info(message)
    }
  }

  info (message) {
    return this._logger.infoAsync(message)
  }

  warn (message) {
    return this._logger.warnAsync(message)
  }

  error (message) {
    return this._logger.errorAsync(message)
  }
}

module.exports = new ModernLogger()

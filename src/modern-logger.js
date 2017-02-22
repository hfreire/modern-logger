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

const winston = require('winston')

const emoji = require('node-emoji')

const emojify = (message) => {
  if (!message || message instanceof Error) {
    return message
  }

  let _message = message

  const matches = _message.match(/:(.*):/gm) || []

  for (let i = 0; i < matches.length; i++) {
    const match = matches[ i ]
    const _emoji = emoji.get(match.substring(1, match.length - 1))
    _message = _message.replace(`${match}`, `${_emoji} `) // node-emoji 'eats' a whitespace
  }

  return _message
}

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

    this._logger = Promise.promisifyAll(new winston.Logger({
      transports: transports,
      exitOnError: false
    }))

    this.stream = {
      write: (message) => this._logger.info(emojify(message))
    }
  }

  info (message, ...args) {
    const _message = emojify(message)

    if (args.length > 0 && args[ args.length - 1 ] instanceof Function) {
      return this._logger.info(_message, ...args)
    }

    return this._logger.infoAsync(_message, ...args)
  }

  warn (message, ...args) {
    const _message = emojify(message)

    if (args.length > 0 && args[ args.length - 1 ] instanceof Function) {
      return this._logger.warn(_message, ...args)
    }

    return this._logger.warnAsync(_message, ...args)
  }

  error (message, ...args) {
    const _message = emojify(message)

    if (args.length > 0 && args[ args.length - 1 ] instanceof Function) {
      return this._logger.error(_message, ...args)
    }

    return this._logger.errorAsync(_message, ...args)
  }
}

module.exports = new ModernLogger()

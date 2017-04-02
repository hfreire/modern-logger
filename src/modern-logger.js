/*
 * Copyright (c) 2017, Hugo Freire <hugo@exec.sh>.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

const LOG_LEVEL = process.env.LOG_LEVEL || 'info'

const ROLLBAR_API_KEY = process.env.ROLLBAR_API_KEY

const _ = require('lodash')
const Promise = require('bluebird')

const moment = require('moment')

const { transports, Logger } = require('winston')
const { File, Console } = transports

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

const defaultOptions = {
  transports: {
    console: {
      level: LOG_LEVEL,
      json: false,
      colorize: true,
      timestamp: () => moment().format('YYYY-MM-DDTHH:mm:ss,SSSZ'),
      handleExceptions: true,
      humanReadableUnhandledException: true
    }
  },
  exitOnError: false
}

class ModernLogger {
  constructor (options = {}) {
    this.configure(options)
  }

  configure (options = {}) {
    this.options = _.defaults(options, defaultOptions)

    const winstonOptions = _.omit(this.options, 'transports')
    winstonOptions.transports = []

    _.forEach(this.options.transports, (transport, type) => {
      switch (type) {
        case 'console':
          winstonOptions.transports.push(new Console(transport))
          break
        case 'file':
          winstonOptions.transports.push(new File(transport))
          break
        default:
      }
    })

    if (ROLLBAR_API_KEY) {
      const RollbarTransport = require('./rollbar-transport')
      winstonOptions.transports.push(new RollbarTransport())
    }

    this.logger = Promise.promisifyAll(new Logger(winstonOptions))

    this.stream = {
      write: (message) => this.logger.info(emojify(message))
    }
  }

  debug (message, ...args) {
    const _message = emojify(message)

    if (args.length > 0 && args[ args.length - 1 ] instanceof Function) {
      return this.logger.info(_message, ...args)
    }

    return this.logger.debugAsync(_message, ...args)
  }

  info (message, ...args) {
    const _message = emojify(message)

    if (args.length > 0 && args[ args.length - 1 ] instanceof Function) {
      return this.logger.info(_message, ...args)
    }

    return this.logger.infoAsync(_message, ...args)
  }

  warn (message, ...args) {
    const _message = emojify(message)

    if (args.length > 0 && args[ args.length - 1 ] instanceof Function) {
      return this.logger.warn(_message, ...args)
    }

    return this.logger.warnAsync(_message, ...args)
  }

  error (message, ...args) {
    const _message = emojify(message)

    if (args.length > 0 && args[ args.length - 1 ] instanceof Function) {
      return this.logger.error(_message, ...args)
    }

    return this.logger.errorAsync(_message, ...args)
  }
}

module.exports = new ModernLogger()

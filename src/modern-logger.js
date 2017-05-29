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

const log = function (level, message, ...args) {
  const _message = this._options.enableEmoji ? emojify(message) : message

  if (args.length > 0 && args[ args.length - 1 ] instanceof Function) {
    return this._logger[ level ](_message, ...args)
  }

  return this._logger[ `${level}Async` ](_message, ...args)
}

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
  winston: {
    transports: [],
    exitOnError: false
  },
  transports: {
    console: [ {} ]
  },
  enableEmoji: true
}

const defaultTransportOptions = {
  level: LOG_LEVEL,
  json: false,
  colorize: true,
  timestamp: () => moment().format('YYYY-MM-DDTHH:mm:ss,SSSZ'),
  handleExceptions: true,
  humanReadableUnhandledException: true
}

class ModernLogger {
  constructor (options = {}) {
    this.configure(options)
  }

  get logger () {
    return this._logger
  }

  configure (options = {}) {
    this._options = _.defaults(options, defaultOptions)

    _.forEach(this._options.transports, (transports, type) => {
      _.forEach(transports, (transport) => {
        switch (type) {
          case 'console':
            this._options.winston.transports.push(new Console(_.defaults(transport, defaultTransportOptions)))
            break
          case 'file':
            this._options.winston.transports.push(new File(_.defaults(transport, defaultTransportOptions)))
            break
          default:
        }
      })
    })

    if (ROLLBAR_API_KEY) {
      const RollbarTransport = require('./rollbar-transport')
      this._options.winston.transports.push(new RollbarTransport())
    }

    this._logger = Promise.promisifyAll(new Logger(this._options.winston))

    this.stream = {
      write: (message) => this._logger.info(emojify(message))
    }
  }

  debug (message, ...args) {
    return log.bind(this)('debug', message, ...args)
  }

  info (message, ...args) {
    return log.bind(this)('info', message, ...args)
  }

  warn (message, ...args) {
    return log.bind(this)('warn', message, ...args)
  }

  error (message, ...args) {
    return log.bind(this)('error', message, ...args)
  }
}

module.exports = new ModernLogger()

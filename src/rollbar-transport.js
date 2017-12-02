/*
 * Copyright (c) 2017, Hugo Freire <hugo@exec.sh>.
 *
 * This source code is licensed under the license found in the
 * LICENSE.md file in the root directory of this source tree.
 */

const ENVIRONMENT = process.env.ENVIRONMENT
const VERSION = process.env.VERSION
const VERSION_COMMIT = process.env.VERSION_COMMIT
const ROLLBAR_API_KEY = process.env.ROLLBAR_API_KEY

const _ = require('lodash')

const Transport = require('winston').Transport

const Rollbar = require('rollbar')

const defaultOptions = {
  winston: {
    name: 'rollbar',
    level: 'warn',
    handleExceptions: false,
    humanReadableUnhandledException: false
  },
  rollbar: {
    accessToken: ROLLBAR_API_KEY,
    verbose: false,
    environment: ENVIRONMENT,
    branch: VERSION,
    codeVersion: VERSION_COMMIT,
    handleUncaughtExceptions: false,
    handleUnhandledRejections: false
  }
}

class RollbarTransport extends Transport {
  constructor (options = {}) {
    super(_.get(_.defaultsDeep({}, options, defaultOptions), 'winston'))

    this._options = _.defaultsDeep({}, options, defaultOptions)

    this._rollbar = new Rollbar(_.get(this._options, 'rollbar'))
  }

  get rollbar () {
    return this._rollbar
  }

  log (level, stack, meta, callback) {
    if (level !== 'error' && level !== 'warn') {
      return callback()
    }

    let error
    let payload = { level }
    if (stack !== '' && meta) {
      error = new Error()
      error.stack = stack

      if (stack.indexOf('\n') > -1) {
        error.message = stack.substring(stack.indexOf(': ') + 2, stack.indexOf('\n'))
      }

      payload.session = meta
    } else {
      error = meta
    }

    return this._rollbar.error(error, null, payload, () => callback(null, true))
  }
}

module.exports = RollbarTransport

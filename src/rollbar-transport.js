/*
 * Copyright (c) 2017, Hugo Freire <hugo@exec.sh>.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

const ENVIRONMENT = process.env.ENVIRONMENT
const VERSION = process.env.VERSION
const VERSION_COMMIT = process.env.VERSION_COMMIT
const ROLLBAR_API_KEY = process.env.ROLLBAR_API_KEY

const Transport = require('winston').Transport

const Rollbar = require('rollbar')

class RollbarTransport extends Transport {
  constructor (options = {}) {
    super()

    this.name = 'rollbar'
    this.level = options.level || 'warn'
    this.handleExceptions = false // catch and log uncaughtException
    this.humanReadableUnhandledException = false

    this._rollbar = new Rollbar({
      accessToken: ROLLBAR_API_KEY,
      environment: ENVIRONMENT,
      branch: VERSION,
      codeVersion: VERSION_COMMIT,
      handleUncaughtExceptions: false,
      handleUnhandledRejections: false
    })
  }

  get rollbar () {
    return this._rollbar
  }

  log (level, stack, meta, callback) {
    if (level === 'error' || level === 'warn') {
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

      this._rollbar.error(error, null, payload, function (error) {
        if (error) {
          return callback(error)
        } else {
          return callback(null, true)
        }
      })
    }
  }
}

module.exports = RollbarTransport

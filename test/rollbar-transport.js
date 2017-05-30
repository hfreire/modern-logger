/*
 * Copyright (c) 2017, Hugo Freire <hugo@exec.sh>.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

describe('Rollbar Transport', () => {
  let subject
  let Rollbar

  before(() => {
    Rollbar = td.constructor([ 'error' ])
  })

  afterEach(() => td.reset())

  describe('when constructing', () => {
    beforeEach(() => {
      const RollbarTransport = require('../src/rollbar-transport')
      subject = new RollbarTransport()
    })

    it('should create a rollbar instance with properties', () => {
      subject.rollbar.should.have.nested.property('.error')
    })
  })

  describe('when logging an error message', () => {
    const level = 'error'
    const stack = 'my-stack-error'
    const meta = new Error(stack)
    let callback

    beforeEach(() => {
      callback = td.function()

      td.replace('rollbar', Rollbar)
      td.when(Rollbar.prototype.error(td.matchers.anything(), td.matchers.anything(), td.matchers.anything()), { ignoreExtraArgs: true }).thenCallback()

      const RollbarTransport = require('../src/rollbar-transport')
      subject = new RollbarTransport()

      subject.log(level, stack, meta, callback)
    })

    it('should call rollbar error with error instance', () => {
      const captor = td.matchers.captor()

      td.verify(Rollbar.prototype.error(captor.capture()), { ignoreExtraArgs: true })

      const error = captor.value
      error.should.be.instanceOf(Error)
    })

    it('should callback without an error', () => {
      td.verify(callback(null, true))
    })
  })

  describe('when logging an error instance', () => {
    const level = 'error'
    const stack = ''
    const meta = new Error('my-error-message')
    let callback

    beforeEach(() => {
      callback = td.function()

      td.replace('rollbar', Rollbar)
      td.when(Rollbar.prototype.error(td.matchers.anything(), td.matchers.anything(), td.matchers.anything()), { ignoreExtraArgs: true }).thenCallback()

      const RollbarTransport = require('../src/rollbar-transport')
      subject = new RollbarTransport()

      subject.log(level, stack, meta, callback)
    })

    it('should call rollbar error with error instance', () => {
      td.verify(Rollbar.prototype.error(meta), { ignoreExtraArgs: true })
    })

    it('should callback without an error', () => {
      td.verify(callback(null, true))
    })
  })
})

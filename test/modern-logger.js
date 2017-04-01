/*
 * Copyright (c) 2017, Hugo Freire <hugo@exec.sh>.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

describe('Modern Logger', () => {
  let subject
  let winston
  let RollbarTransport
  let emoji

  before(() => {
    winston = td.object([ 'transports' ])
    winston.transports.Console = td.constructor()
    winston.Logger = td.constructor([ 'debug', 'info', 'warn', 'error' ])

    RollbarTransport = td.constructor()

    emoji = td.object([ 'get' ])
  })

  afterEach(() => td.reset())

  describe('when logging an debug message', () => {
    const message = 'my-message'

    beforeEach(() => {
      td.replace('winston', winston)

      subject = require('../src/modern-logger')
    })

    it('should invoke winstons debug logger', () => {
      subject.debug(message)

      td.verify(winston.Logger.prototype.debug(message), { ignoreExtraArgs: true, times: 1 })
    })
  })

  describe('when logging an info message', () => {
    const message = 'my-message'

    beforeEach(() => {
      td.replace('winston', winston)

      subject = require('../src/modern-logger')
    })

    it('should invoke winstons info logger', () => {
      subject.info(message)

      td.verify(winston.Logger.prototype.info(message), { ignoreExtraArgs: true, times: 1 })
    })
  })

  describe('when logging a warning message', () => {
    const message = 'my-message'

    beforeEach(() => {
      td.replace('winston', winston)

      subject = require('../src/modern-logger')
    })

    it('should invoke winstons warning logger', () => {
      subject.warn(message)

      td.verify(winston.Logger.prototype.warn(message), { ignoreExtraArgs: true, times: 1 })
    })
  })

  describe('when logging an error message', () => {
    const message = 'my-message'

    beforeEach(() => {
      td.replace('winston', winston)

      subject = require('../src/modern-logger')
    })

    it('should invoke winstons error logger', () => {
      subject.error(message)

      td.verify(winston.Logger.prototype.error(message), { ignoreExtraArgs: true, times: 1 })
    })
  })

  describe('when Rollbar API key available', () => {
    let winston

    beforeEach(() => {
      process.env.ROLLBAR_API_KEY = 'my-rollbar-api-key'

      winston = td.replace('winston', {
        Logger: td.function(),
        transports: { Console: td.function() }
      }) // can't seem to test constructor

      td.replace('../src/rollbar-transport', RollbarTransport)

      subject = require('../src/modern-logger')
    })

    after(() => delete process.env.ROLLBAR_API_KEY)

    it('should create logger with Rollbar transport', () => {
      const captor = td.matchers.captor()

      td.verify(winston.Logger(captor.capture()), { times: 1 }) // can't seem to test constructor

      const options = captor.value

      options.transports.should.have.length(2)
    })
  })

  describe('when logging an info message with an emoji', () => {
    let emojiId = 'my-emoji-id'
    let emojiCode = `:${emojiId}:`
    const message = `my-${emojiCode}-message`

    beforeEach(() => {
      td.replace('winston', winston)

      td.replace('node-emoji', emoji)

      subject = require('../src/modern-logger')
    })

    it('should invoke emoji with emoji id', () => {
      subject.info(message)

      const captor = td.matchers.captor()

      td.verify(emoji.get(captor.capture()), { times: 1 })

      const _emojiId = captor.value

      _emojiId.should.be.equal(emojiId)
    })
  })
})

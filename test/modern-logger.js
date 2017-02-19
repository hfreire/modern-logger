/*
 * Copyright (c) 2017, Hugo Freire <hugo@exec.sh>.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

describe('Modern Logger', () => {
  let subject
  let Logger
  let winston
  let emoji

  afterEach(() => {
    td.reset()
  })

  describe('when logging an info message', () => {
    const message = 'my-message'

    before(() => {
      Logger = td.object([ 'infoAsync', 'warnAsync', 'errorAsync' ])

      td.replace(require('winston'), 'Logger', Logger)

      subject = require('../src/modern-logger')
    })

    after(() => {
      delete require.cache[ require.resolve('../src/modern-logger') ]
    })

    it('should invoke winstons info logger', () => {
      subject.info(message)

      td.verify(Logger.infoAsync(message), { times: 1 })
    })
  })

  describe('when logging a warning message', () => {
    const message = 'my-message'

    before(() => {
      Logger = td.object([ 'infoAsync', 'warnAsync', 'errorAsync' ])

      td.replace(require('winston'), 'Logger', Logger)

      subject = require('../src/modern-logger')
    })

    after(() => {
      delete require.cache[ require.resolve('../src/modern-logger') ]
    })

    it('should invoke winstons warning logger', () => {
      subject.warn(message)

      td.verify(Logger.warnAsync(message), { times: 1 })
    })
  })

  describe('when logging an error message', () => {
    const message = 'my-message'

    before(() => {
      Logger = td.object([ 'infoAsync', 'warnAsync', 'errorAsync' ])

      td.replace(require('winston'), 'Logger', Logger)

      subject = require('../src/modern-logger')
    })

    after(() => {
      delete require.cache[ require.resolve('../src/modern-logger') ]
    })

    it('should invoke winstons error logger', () => {
      subject.error(message)

      td.verify(Logger.errorAsync(message), { times: 1 })
    })
  })

  describe('when Rollbar API key available', () => {
    let Console
    let Transport

    before(() => {
      process.env.ROLLBAR_API_KEY = 'my-rollbar-api-key'

      Console = td.function()
      Logger = td.function()
      Transport = td.function()
      winston = td.replace('winston', { Logger, Transport, transports: { Console } })

      subject = require('../src/modern-logger')
    })

    after(() => {
      delete require.cache[ require.resolve('../src/modern-logger') ]

      delete process.env.ROLLBAR_API_KEY
    })

    it('should create logger with Rollbar transport', () => {
      const captor = td.matchers.captor()

      td.verify(winston.Logger(captor.capture()), { times: 1 })

      const options = captor.value

      options.should.have.deep.property('transports[1].name', 'rollbar')
    })
  })

  describe('when logging an info message with an emoji', () => {
    let emojiId = 'my-emoji-id'
    let emojiCode = `:${emojiId}:`
    const message = `my-${emojiCode}-message`

    before(() => {
      Logger = td.object([ 'infoAsync', 'warnAsync', 'errorAsync' ])

      td.replace(require('winston'), 'Logger', Logger)

      emoji = td.replace('node-emoji', td.object([ 'get' ]))

      subject = require('../src/modern-logger')
    })

    after(() => {
      delete require.cache[ require.resolve('../src/modern-logger') ]
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

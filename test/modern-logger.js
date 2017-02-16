/*
 * Copyright (c) 2017, Hugo Freire <hugo@exec.sh>.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

describe('Modern Logger', () => {
  let subject
  let Logger

  before(() => {
    Logger = td.replace(require('winston'), 'Logger', td.object([ 'info' ]))
  })

  afterEach(() => {
    td.reset()
  })

  describe('when logging an info message', () => {
    const message = 'my-message'

    before(() => {
      subject = require('../src/modern-logger')
    })

    after(() => {
      delete require.cache[ require.resolve('../src/modern-logger') ]
    })

    it('should invoke winstons info logger', () => {
      subject.info(message)

      td.verify(Logger.info(message), { times: 1 })
    })
  })
})

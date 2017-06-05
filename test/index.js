/*
 * Copyright (c) 2017, Hugo Freire <hugo@exec.sh>.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

const Logger = require('../src/modern-logger')

describe('Module', () => {
  let subject

  describe('when loading', () => {
    beforeEach(() => {
      subject = require('../src/index')
    })

    it('should export modern logger', () => {
      subject.should.be.equal(Logger)
    })
  })
})

import { elementToTarget } from '../../src/internal/target'
import * as  assert from 'assert'

const jsdom = require('mocha-jsdom')

describe('target', () => {
  jsdom()

  describe('elementToTarget', () => {
    it('should translate a <target> to a Target', () => {
      const $stateInitial = document.createElement('s-state')
      $stateInitial.setAttribute('name', 'initial')
      $stateInitial.setAttribute('transform', 'none')

      const $stateLeft = document.createElement('s-state')
      $stateLeft.setAttribute('name', 'left')
      $stateLeft.setAttribute('transform', 'translate(-200px)')

      const $target = document.createElement('s-target')
      $target.setAttribute('select', '#box')

      $target.appendChild($stateInitial)
      $target.appendChild($stateLeft)

      const target = elementToTarget($target)
      assert.deepEqual(target, {
        select: '#box',
        states: {
          initial: {
            name: 'initial',
            transform: 'none'
          },
          left: {
            name: 'left',
            transform: 'translate(-200px)'
          }
        }
      })
    })
  })
})

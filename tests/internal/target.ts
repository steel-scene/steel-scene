import { elementToTarget, target } from '../../src/internal/target'
import * as  assert from 'assert'

const jsdom = require('mocha-jsdom')

describe('target', () => {
  jsdom()

  describe('on()', () => {
    it('adds to the state', () => {
      const myTarget = target({ x: 0, y: 0 })
        .on('state1', { x: '100px', y: '100px' })
        .on('next', { x: '200px', y: '200px' })

      // tslint:disable-next-line:no-string-literal
      assert.deepEqual(myTarget.states['state1'], {
        x: '100px', y: '100px'
      })
    })

    it('ignores the name property', () => {
      const myTarget = target({ x: 0, y: 0 })
        .on('state1', { x: '100px', name: 'something' })

      // tslint:disable-next-line:no-string-literal
      assert.deepEqual(myTarget.states['state1'], {
        x: '100px'
      })
    })
  })

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

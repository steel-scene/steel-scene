import { elementToScene } from '../../src/internal/scene'

import * as  assert from 'assert'
const jsdom = require('mocha-jsdom')

describe('dom', () => {
  jsdom()

  describe('elementToScene', () => {
    it('should translate a <scene> to a Scene', () => {

      const $stateInitial = document.createElement('s-state')
      $stateInitial.setAttribute('name', 'initial')
      $stateInitial.setAttribute('x', '0')

      const $stateLeft = document.createElement('s-state')
      $stateLeft.setAttribute('name', 'left')
      $stateLeft.setAttribute('x', '-200')

      const $target = document.createElement('s-target')
      $target.setAttribute('select', '#box')

      $target.appendChild($stateInitial)
      $target.appendChild($stateLeft)


      const $transition = document.createElement('s-transition')
      $transition.setAttribute('default', '')
      $transition.setAttribute('duration', '1000')
      $transition.setAttribute('easing', 'ease-in-out')

      const $scene = document.createElement('s-scene')
      $scene.appendChild($target)
      $scene.appendChild($transition)

      const scene = elementToScene($scene)
      assert.deepEqual(scene, {
        targets: [
          {
            select: '#box',
            states: {
              initial: { name: 'initial', x: '0' },
              left: { name: 'left', x: '-200' }
            }
          }
        ],
        transitions: [
          {
            default: true,
            duration: 1000,
            easing: 'ease-in-out'
          }
        ]
      })
    })
  })
})

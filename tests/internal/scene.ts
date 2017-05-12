import { elementToScene } from '../../src/internal/importer'
import * as  assert from 'assert'
const jsdom = require('jsdom')

describe('dom', () => {
  const document = new jsdom.JSDOM().window.document

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

      const $scene = document.createElement('s-scene')
      $scene.appendChild($target)

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
        ]
      })
    })
  })
})

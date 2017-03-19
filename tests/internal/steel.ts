import {  elementToScenes } from '../../src/internal/steel'
import * as  assert from 'assert'
const jsdom = require('mocha-jsdom')

describe('dom', () => {
  jsdom()

  describe('elementToScenes', () => {
    it('should detect multiple scenes in html', () => {
      const $element = document.createElement('div')
      $element.innerHTML = `
      <s-scene name="boxes">
          <s-transition duration="1500" easing="Power2.easeOut" default />
          <s-transition name="fast" duration="500" easing="Power3.easeInOut" />
          <s-target select="#box1">
            <s-state name="C" x="0" y="0" rotation="0deg" />
            <s-state name="NE" x="100px" y="-100px" rotation="45deg" />
          </s-target>
          <s-target select="#box2">
            <s-state name="C" x="0" y="0" rotation="0deg" />
            <s-state name="NE" x="100px" y="-100px" rotation="45deg" />
          </s-target>
      </s-scene>`

      const scenes = elementToScenes($element)
      assert.deepEqual(scenes, [
        {
          name: 'boxes',
          targets: [
            {
              select: '#box1',
              states: {
                C: { name: 'C', x: '0', y: '0', rotation: '0deg' },
                NE: { name: 'NE', x: '100px', y: '-100px', rotation: '45deg' }
              }
            },
            {
              select: '#box2',
              states: {
                C: { name: 'C', x: '0', y: '0', rotation: '0deg' },
                NE: { name: 'NE', x: '100px', y: '-100px', rotation: '45deg' }
              }
            }
          ],
          transitions: [
            {
              default: true,
              duration: 1500,
              easing: 'Power2.easeOut'
            },
            {
              duration: 500,
              easing: 'Power3.easeInOut',
              name: 'fast'
            }
          ]
        }
      ])
    })
  })





})

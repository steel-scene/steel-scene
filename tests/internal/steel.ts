import {  elementToScenes } from '../../src/internal/steel';
import * as  assert from 'assert';
const jsdom = require('mocha-jsdom');

describe('dom', () => {
  jsdom();

  describe('elementToScenes', () => {
    it('should detect multiple scenes in html', () => {
      const $element = document.createElement('div');
      $element.innerHTML = `
      <s-scene name="boxes">
          <s-transition duration="1500" easing="Power2.easeOut" default />
          <s-transition name="fast" duration="500" easing="Power3.easeInOut" />

          <s-state name="C" transition="fast" default>
              <s-target ref="#box1" x="0" y="0" rotation="0deg" />
              <s-target ref="#box2" x="0" y="0" rotation="0deg" />
          </s-state>
          <s-state name="NE" duration="1000" easing="Cubic.easeInOut">
              <s-target ref="#box1" x="100px" y="-100px" rotation="45deg" />
              <s-target ref="#box2" x="100px" y="-100px" rotation="45deg" />
          </s-state>
      </s-scene>`;

      const scenes = elementToScenes($element);
      assert.deepEqual(scenes, {
        boxes: {
          states: {
            C: {
              default: true,
              targets: [
                { ref: '#box1', x: '0', y: '0', rotation: '0deg' },
                { ref: '#box2', x: '0', y: '0', rotation: '0deg' }
              ],
              transition: 'fast'
            },
            NE: {
              duration: 1000,
              easing: 'Cubic.easeInOut',
              targets: [
                { ref: '#box1', x: '100px', y: '-100px', rotation: '45deg' },
                { ref: '#box2', x: '100px', y: '-100px', rotation: '45deg' }
              ]
            }
          },
          transitions: {
            _: {
              default: true,
              duration: 1500,
              easing: 'Power2.easeOut'
            },
            fast: {
              default: false,
              duration: 500,
              easing: 'Power3.easeInOut'
            }
          }
        }
      });
    });
  });





});

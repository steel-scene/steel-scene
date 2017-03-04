import {
  elementToTransition,
  elementToScene,
  elementToScenes,
  elementToState,
  elementToTarget
} from '../../src/internal';

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

  describe('elementToScene', () => {
    it('should translate a <scene> to a Scene', () => {

      const $target1a = document.createElement('s-target');
      $target1a.setAttribute('ref', '#box1');
      $target1a.setAttribute('x', '0');

      const $target2a = document.createElement('s-target');
      $target2a.setAttribute('ref', '#box2');
      $target2a.setAttribute('y', '0');

      const $statea = document.createElement('s-state');
      $statea.setAttribute('name', 'first');
      $statea.setAttribute('default', '');

      $statea.appendChild($target1a);
      $statea.appendChild($target2a);

      const $target1b = document.createElement('s-target');
      $target1b.setAttribute('ref', '#box1');
      $target1b.setAttribute('x', '90px');

      const $target2b = document.createElement('s-target');
      $target2b.setAttribute('ref', '#box2');
      $target2b.setAttribute('y', '90px');

      const $stateb = document.createElement('s-state');
      $stateb.setAttribute('name', 'second');
      $stateb.appendChild($target1b);
      $stateb.appendChild($target2b);

      const $transition = document.createElement('s-transition');
      $transition.setAttribute('default', '');
      $transition.setAttribute('duration', '1000');
      $transition.setAttribute('easing', 'ease-in-out');

      const $scene = document.createElement('s-scene');
      $scene.appendChild($statea);
      $scene.appendChild($stateb);
      $scene.appendChild($transition);

      const scene = elementToScene($scene);
      assert.deepEqual(scene, {
        states: {
          first: {
            default: true,
            targets: [
              { ref: '#box1', x: '0' },
              { ref: '#box2', y: '0' }
            ]
          },
          second: {
            targets: [
              { ref: '#box1', x: '90px' },
              { ref: '#box2', y: '90px' }
            ]
          }
        },
        transitions: {
          _: {
            default: true,
            duration: 1000,
            easing: 'ease-in-out'
          }
        }
      });
    });
  });

  describe('elementToState', () => {
    it('should translate a <state> to a State', () => {

      const $target1 = document.createElement('s-target');
      $target1.setAttribute('ref', '#box1');
      $target1.setAttribute('x', '0');

      const $target2 = document.createElement('s-target');
      $target2.setAttribute('ref', '#box2');
      $target2.setAttribute('y', '0');

      const $state = document.createElement('s-state');
      $state.setAttribute('name', 'first');
      $state.setAttribute('x', '20px');
      $state.setAttribute('rotate', '10deg');
      $state.appendChild($target1);
      $state.appendChild($target2);

      const state = elementToState($state);
      assert.deepEqual(state, {
        targets: [
          {
            ref: '#box1',
            x: '0'
          },
          {
            ref: '#box2',
            y: '0'
          }
        ],
        x: '20px',
        rotate: '10deg'
      });
    });
  });

  describe('elementToTarget', () => {
    it('should translate a <target> to a Target', () => {
      const $target = document.createElement('s-target');
      $target.setAttribute('ref', '#box');
      $target.setAttribute('x', '0');
      $target.setAttribute('y', '90px');

      const target = elementToTarget($target);
      assert.deepEqual(target, {
        ref: '#box',
        x: '0',
        y: '90px'
      });
    });
  });

  describe('elementToTransition', () => {
    it('should translate a <transition> to a Transition', () => {
      const $transition = document.createElement('s-transition');
      $transition.setAttribute('duration', '1000');
      $transition.setAttribute('easing', 'ease-in-out');

      const transition = elementToTransition($transition);
      assert.deepEqual(transition, {
        default: false,
        duration: 1000,
        easing: 'ease-in-out'
      });
    });
  });
});

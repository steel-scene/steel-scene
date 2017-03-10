import { elementToScene } from '../../src/internal';

import * as  assert from 'assert';
const jsdom = require('mocha-jsdom');

describe('dom', () => {
  jsdom();

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
});

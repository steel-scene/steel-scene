import { elementToState } from '../../src/internal';

import * as  assert from 'assert';
const jsdom = require('mocha-jsdom');

describe('dom', () => {
  jsdom();

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

  });

import { elementToTransition } from '../../src/internal';
import * as  assert from 'assert';
const jsdom = require('mocha-jsdom');

describe('dom', () => {
  jsdom();

  describe('', () => {

  });

  describe('elementToTransition', () => {
    it('should translate a <transition> to a Transition', () => {
      const $transition = document.createElement('s-transition');
      $transition.setAttribute('duration', '1000');
      $transition.setAttribute('easing', 'ease-in-out');

      const transition = elementToTransition($transition);
      assert.deepEqual(transition, {
        duration: 1000,
        easing: 'ease-in-out'
      });
    });
  });
});

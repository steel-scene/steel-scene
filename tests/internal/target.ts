import { elementToTarget } from '../../src/internal';
import * as  assert from 'assert';

const jsdom = require('mocha-jsdom');

describe('dom', () => {
  jsdom();

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
});

import { fromState } from '../../src/internal';

import * as assert from 'assert';
const jsdom = require('mocha-jsdom');

describe('dom', () => {
  jsdom();

  describe('fromState', () => {
    it('translates from state to stateJSON', () => {
      const actual = fromState(
        {
          duration: 1000,
          easing: 'ease',
          name: 'animation',
          props: { x: 100 },
          transition: undefined,
          targets: [
            {
              ref: '#target',
              x: '120'
            }
          ]
        },
        false
      );
      assert.deepEqual(actual, {
        default: false,
        duration: 1000,
        easing: 'ease',
        name: 'animation',
        x: 100,
        targets: [
          {
            ref: '#target',
            x: '120'
          }
        ],
        transition: undefined
      });
    });
  });
});

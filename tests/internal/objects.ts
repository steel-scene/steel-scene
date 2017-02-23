import { assign } from '../../src/internal';
import * as  assert from 'assert';

describe('objects', () => {
  describe('assign', () => {
    it('should copy properties from one object to the next', () => {
      const target = { color: 'red' };
      const source = { color: 'blue' };
      assert.deepEqual(assign(target, source), { color: 'blue' });
    });

    it('should return the same reference as the first argument passed to it', () => {
      const target = { color: 'red' };
      const source = { color: 'blue' };
      assert.equal(assign(target, source), target);
    });
  });
});

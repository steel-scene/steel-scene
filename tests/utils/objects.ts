import { assign } from '../../src/utils/objects'
import * as  assert from 'assert'

describe('objects', () => {
  describe('assign', () => {
    it('should copy properties from one object to the next', () => {
      const target = { color: 'red' }
      const source = { color: 'blue' }
      assert.deepEqual(assign(target, undefined, source), { color: 'blue' })
    })

    it('should ignore undefined/null properties', () => {
      const target = { color: 'red' }
      // tslint:disable-next-line:no-null-keyword
      const source = { color: 'blue', meaningless1: undefined, meaningless2: null }
      assert.deepEqual(assign(target, undefined, source), target)
    })

    it('should return the same reference as the first argument passed to it', () => {
      const target = { color: 'red' }
      const source = { color: 'blue' }
      assert.equal(assign(target, undefined, source), target)
    })
  })
})

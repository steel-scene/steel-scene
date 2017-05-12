import { parseUnit, Unit } from '../../src/utils/units'
import * as assert from 'assert'

describe('parseUnit', () => {
  describe('parseUnit()', () => {
    it('returns undefined when passed undefined', () => {
      const result = parseUnit(undefined)
      assert.equal(undefined, result)
    })

    it('returns undefined when passed ""', () => {
      const result = parseUnit('')
      assert.equal(undefined, result)
    })

    it('returns 2.2px when passed 2.2', () => {
      const result = parseUnit(2.2)
      assert.equal(2.2, result)
    })

    it('returns -2.2px when passed -2.2', () => {
      const result = parseUnit(-2.2)
      assert.equal(-2.2, result)
    })

    it('returns 2.2em when passed "2.2em"', () => {
      const result = parseUnit('2.2em') as Unit
      assert.equal(2.2, result.value)
      assert.equal('em', result.unit)
    })

    it('returns -2.2em when passed "-2.2em"', () => {
      const result = parseUnit('-2.2em') as Unit
      assert.equal(-2.2, result.value)
      assert.equal('em', result.unit)
    })

    it('returns 2.2ex when passed "2.2ex"', () => {
      const result = parseUnit('2.2ex') as Unit
      assert.equal(2.2, result.value)
      assert.equal('ex', result.unit)
    })

    it('returns -2.2ex when passed "-2.2ex"', () => {
      const result = parseUnit('-2.2ex') as Unit
      assert.equal(-2.2, result.value)
      assert.equal('ex', result.unit)
    })

    it('returns 2.2ch when passed "2.2ch"', () => {
      const result = parseUnit('2.2ch') as Unit
      assert.equal(2.2, result.value)
      assert.equal('ch', result.unit)
    })

    it('returns -2.2ch when passed "-2.2ch"', () => {
      const result = parseUnit('-2.2ch') as Unit
      assert.equal(-2.2, result.value)
      assert.equal('ch', result.unit)
    })

    it('returns 2.2rem when passed "2.2rem"', () => {
      const result = parseUnit('2.2rem') as Unit
      assert.equal(2.2, result.value)
      assert.equal('rem', result.unit)
    })

    it('returns -2.2rem when passed "-2.2rem"', () => {
      const result = parseUnit('-2.2rem') as Unit
      assert.equal(-2.2, result.value)
      assert.equal('rem', result.unit)
    })

    it('returns 2.2vh when passed "2.2vh"', () => {
      const result = parseUnit('2.2vh') as Unit
      assert.equal(2.2, result.value)
      assert.equal('vh', result.unit)
    })

    it('returns -2.2vh when passed "-2.2vh"', () => {
      const result = parseUnit('-2.2vh') as Unit
      assert.equal(-2.2, result.value)
      assert.equal('vh', result.unit)
    })

    it('returns 2.2vw when passed "2.2vw"', () => {
      const result = parseUnit('2.2vw') as Unit
      assert.equal(2.2, result.value)
      assert.equal('vw', result.unit)
    })

    it('returns -2.2vw when passed "-2.2vw"', () => {
      const result = parseUnit('-2.2vw') as Unit
      assert.equal(-2.2, result.value)
      assert.equal('vw', result.unit)
    })

    it('returns 2.2px when passed "2.2px"', () => {
      const result = parseUnit('2.2px') as Unit
      assert.equal(2.2, result.value)
      assert.equal('px', result.unit)
    })

    it('returns -2.2px when passed "-2.2px"', () => {
      const result = parseUnit('-2.2px') as Unit
      assert.equal(-2.2, result.value)
      assert.equal('px', result.unit)
    })

    it('returns 2.2mm when passed "2.2mm"', () => {
      const result = parseUnit('2.2mm') as Unit
      assert.equal(2.2, result.value)
      assert.equal('mm', result.unit)
    })

    it('returns -2.2mm when passed "-2.2mm"', () => {
      const result = parseUnit('-2.2mm') as Unit
      assert.equal(-2.2, result.value)
      assert.equal('mm', result.unit)
    })

    it('returns 2.2q when passed "2.2q"', () => {
      const result = parseUnit('2.2q') as Unit
      assert.equal(2.2, result.value)
      assert.equal('q', result.unit)
    })

    it('returns -2.2q when passed "-2.2q"', () => {
      const result = parseUnit('-2.2q') as Unit
      assert.equal(-2.2, result.value)
      assert.equal('q', result.unit)
    })

    it('returns 2.2cm when passed "2.2cm"', () => {
      const result = parseUnit('2.2cm') as Unit
      assert.equal(2.2, result.value)
      assert.equal('cm', result.unit)
    })

    it('returns -2.2cm when passed "-2.2cm"', () => {
      const result = parseUnit('-2.2cm') as Unit
      assert.equal(-2.2, result.value)
      assert.equal('cm', result.unit)
    })

    it('returns 2.2in when passed "2.2in"', () => {
      const result = parseUnit('2.2in') as Unit
      assert.equal(2.2, result.value)
      assert.equal('in', result.unit)
    })

    it('returns -2.2in when passed "-2.2in"', () => {
      const result = parseUnit('-2.2in') as Unit
      assert.equal(-2.2, result.value)
      assert.equal('in', result.unit)
    })

    it('returns 2.2pt when passed "2.2pt"', () => {
      const result = parseUnit('2.2pt') as Unit
      assert.equal(2.2, result.value)
      assert.equal('pt', result.unit)
    })

    it('returns -2.2pt when passed "-2.2pt"', () => {
      const result = parseUnit('-2.2pt') as Unit
      assert.equal(-2.2, result.value)
      assert.equal('pt', result.unit)
    })

    it('returns 2.2pc when passed "2.2pc"', () => {
      const result = parseUnit('2.2pc') as Unit
      assert.equal(2.2, result.value)
      assert.equal('pc', result.unit)
    })

    it('returns -2.2pc when passed "-2.2pc"', () => {
      const result = parseUnit('-2.2pc') as Unit
      assert.equal(-2.2, result.value)
      assert.equal('pc', result.unit)
    })

    it('returns 2.2% when passed "2.2%"', () => {
      const result = parseUnit('2.2%') as Unit
      assert.equal(2.2, result.value)
      assert.equal('%', result.unit)
    })

    it('returns -2.2% when passed "-2.2%"', () => {
      const result = parseUnit('-2.2%') as Unit
      assert.equal(-2.2, result.value)
      assert.equal('%', result.unit)
    })

    it('returns 100 when passed "100%"', () => {
      const result = parseUnit('100%') as Unit
      assert.equal(100, result.value)
      assert.equal('%', result.unit)
    })

    it('returns -100 when passed -100', () => {
      const result = parseUnit(-100) as Unit
      assert.equal(-100, result)
    })

    it('returns -100 when passed "-100"', () => {
      const result = parseUnit('-100') as Unit
      assert.equal(-100, result)
    })

    it('returns -100% when passed "-100%"', () => {
      const result = parseUnit('-100%') as Unit
      assert.equal(-100, result.value)
      assert.equal('%', result.unit)
    })
  })
})

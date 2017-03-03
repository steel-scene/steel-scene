import { parseUnit, createUnitResolver } from '../../src/internal/units';

import * as assert from 'assert';
import { almostEqual } from '../assertions';


describe('parseUnit', () => {
  describe('parseUnit()', () => {
    it('returns undefined when passed undefined', () => {
      const result = parseUnit(undefined);
      assert.equal(undefined, result.unit);
      assert.equal(undefined, result.value);
    });

    it('returns undefined when passed ""', () => {
      const result = parseUnit('');
      assert.equal(undefined, result.unit);
      assert.equal(undefined, result.value);
    });

    it('returns 2.2px when passed 2.2', () => {
      const result = parseUnit(2.2);
      assert.equal(2.2, result.value);
      assert.equal(undefined, result.unit);
    });

    it('returns -2.2px when passed -2.2', () => {
      const result = parseUnit(-2.2);
      assert.equal(-2.2, result.value);
      assert.equal(undefined, result.unit);
    });

    it('returns 2.2em when passed "2.2em"', () => {
      const result = parseUnit('2.2em');
      assert.equal(2.2, result.value);
      assert.equal('em', result.unit);
    });

    it('returns -2.2em when passed "-2.2em"', () => {
      const result = parseUnit('-2.2em');
      assert.equal(-2.2, result.value);
      assert.equal('em', result.unit);
    });

    it('returns 2.2ex when passed "2.2ex"', () => {
      const result = parseUnit('2.2ex');
      assert.equal(2.2, result.value);
      assert.equal('ex', result.unit);
    });

    it('returns -2.2ex when passed "-2.2ex"', () => {
      const result = parseUnit('-2.2ex');
      assert.equal(-2.2, result.value);
      assert.equal('ex', result.unit);
    });

    it('returns 2.2ch when passed "2.2ch"', () => {
      const result = parseUnit('2.2ch');
      assert.equal(2.2, result.value);
      assert.equal('ch', result.unit);
    });

    it('returns -2.2ch when passed "-2.2ch"', () => {
      const result = parseUnit('-2.2ch');
      assert.equal(-2.2, result.value);
      assert.equal('ch', result.unit);
    });

    it('returns 2.2rem when passed "2.2rem"', () => {
      const result = parseUnit('2.2rem');
      assert.equal(2.2, result.value);
      assert.equal('rem', result.unit);
    });

    it('returns -2.2rem when passed "-2.2rem"', () => {
      const result = parseUnit('-2.2rem');
      assert.equal(-2.2, result.value);
      assert.equal('rem', result.unit);
    });

    it('returns 2.2vh when passed "2.2vh"', () => {
      const result = parseUnit('2.2vh');
      assert.equal(2.2, result.value);
      assert.equal('vh', result.unit);
    });

    it('returns -2.2vh when passed "-2.2vh"', () => {
      const result = parseUnit('-2.2vh');
      assert.equal(-2.2, result.value);
      assert.equal('vh', result.unit);
    });

    it('returns 2.2vw when passed "2.2vw"', () => {
      const result = parseUnit('2.2vw');
      assert.equal(2.2, result.value);
      assert.equal('vw', result.unit);
    });

    it('returns -2.2vw when passed "-2.2vw"', () => {
      const result = parseUnit('-2.2vw');
      assert.equal(-2.2, result.value);
      assert.equal('vw', result.unit);
    });

    it('returns 2.2px when passed "2.2px"', () => {
      const result = parseUnit('2.2px');
      assert.equal(2.2, result.value);
      assert.equal('px', result.unit);
    });

    it('returns -2.2px when passed "-2.2px"', () => {
      const result = parseUnit('-2.2px');
      assert.equal(-2.2, result.value);
      assert.equal('px', result.unit);
    });

    it('returns 2.2mm when passed "2.2mm"', () => {
      const result = parseUnit('2.2mm');
      assert.equal(2.2, result.value);
      assert.equal('mm', result.unit);
    });

    it('returns -2.2mm when passed "-2.2mm"', () => {
      const result = parseUnit('-2.2mm');
      assert.equal(-2.2, result.value);
      assert.equal('mm', result.unit);
    });

    it('returns 2.2q when passed "2.2q"', () => {
      const result = parseUnit('2.2q');
      assert.equal(2.2, result.value);
      assert.equal('q', result.unit);
    });

    it('returns -2.2q when passed "-2.2q"', () => {
      const result = parseUnit('-2.2q');
      assert.equal(-2.2, result.value);
      assert.equal('q', result.unit);
    });

    it('returns 2.2cm when passed "2.2cm"', () => {
      const result = parseUnit('2.2cm');
      assert.equal(2.2, result.value);
      assert.equal('cm', result.unit);
    });

    it('returns -2.2cm when passed "-2.2cm"', () => {
      const result = parseUnit('-2.2cm');
      assert.equal(-2.2, result.value);
      assert.equal('cm', result.unit);
    });

    it('returns 2.2in when passed "2.2in"', () => {
      const result = parseUnit('2.2in');
      assert.equal(2.2, result.value);
      assert.equal('in', result.unit);
    });

    it('returns -2.2in when passed "-2.2in"', () => {
      const result = parseUnit('-2.2in');
      assert.equal(-2.2, result.value);
      assert.equal('in', result.unit);
    });

    it('returns 2.2pt when passed "2.2pt"', () => {
      const result = parseUnit('2.2pt');
      assert.equal(2.2, result.value);
      assert.equal('pt', result.unit);
    });

    it('returns -2.2pt when passed "-2.2pt"', () => {
      const result = parseUnit('-2.2pt');
      assert.equal(-2.2, result.value);
      assert.equal('pt', result.unit);
    });

    it('returns 2.2pc when passed "2.2pc"', () => {
      const result = parseUnit('2.2pc');
      assert.equal(2.2, result.value);
      assert.equal('pc', result.unit);
    });

    it('returns -2.2pc when passed "-2.2pc"', () => {
      const result = parseUnit('-2.2pc');
      assert.equal(-2.2, result.value);
      assert.equal('pc', result.unit);
    });

    it('returns 2.2% when passed "2.2%"', () => {
      const result = parseUnit('2.2%');
      assert.equal(2.2, result.value);
      assert.equal('%', result.unit);
    });

    it('returns -2.2% when passed "-2.2%"', () => {
      const result = parseUnit('-2.2%');
      assert.equal(-2.2, result.value);
      assert.equal('%', result.unit);
    });

    it('returns 100% when passed "100%"', () => {
      const result = parseUnit('100%');
      assert.equal(100, result.value);
      assert.equal('%', result.unit);
    });

    it('returns -100% when passed -100', () => {
      const result = parseUnit(-100);
      assert.equal(-100, result.value);
      assert.equal(undefined, result.unit);
    });

    it('returns -100% when passed "-100"', () => {
      const result = parseUnit('-100');
      assert.equal(-100, result.value);
      assert.equal(undefined, result.unit);
    });

    it('returns -100% when passed "-100%"', () => {
      const result = parseUnit('-100%');
      assert.equal(-100, result.value);
      assert.equal('%', result.unit);
    });
  });

  describe('createUnitResolver()', () => {
    it('returns 1s when passed 1s', () => {
      const resolver = createUnitResolver('1s');
      assert.deepEqual(resolver(0), { unit: 's', value: 1 });
      assert.deepEqual(resolver(1), { unit: 's', value: 1 });
      assert.deepEqual(resolver(2), { unit: 's', value: 1 });
    });

    it('returns x += 1.1 when passed += 1.1', () => {
      const resolver = createUnitResolver('+=1.1');
      almostEqual(resolver(0).value as number, 1.1, 0.0001);
      almostEqual(resolver(1).value as number, 2.2, 0.0001);
      almostEqual(resolver(2).value as number, 3.3, 0.0001);
    });

    it('returns x -= 1.1 when passed -= 1.1', () => {
      const resolver = createUnitResolver('-=1.1');
      almostEqual(resolver(0).value as number, -1.1, 0.0001);
      almostEqual(resolver(1).value as number, -2.2, 0.0001);
      almostEqual(resolver(2).value as number, -3.3, 0.0001);
    });

    it('returns x += 1 when passed +=1s', () => {
      const resolver = createUnitResolver('+=1s');
      assert.deepEqual(resolver(0), { unit: 's', value: 1 });
      assert.deepEqual(resolver(1), { unit: 's', value: 2 });
      assert.deepEqual(resolver(2), { unit: 's', value: 3 });
    });

    it('returns x -= 1s when passed -=1s', () => {
      const resolver = createUnitResolver('-=1s');
      assert.deepEqual(resolver(0), { unit: 's', value: -1 });
      assert.deepEqual(resolver(1), { unit: 's', value: -2 });
      assert.deepEqual(resolver(2), { unit: 's', value: -3 });
    });


    it('returns 100 when passed 0to1', () => {
      const resolver = createUnitResolver('0 to 1');
      const random1 = resolver(0).value as number;
      assert.equal(random1 > -0.00001, true);
      assert.equal(random1 < 1, true);
    });

    it('returns 100 to 200 when passed 100to200', () => {
      const resolver = createUnitResolver('+= 100 to 200');
      const random1 = resolver(0).value as number;
      assert.equal(random1 > 99, true);
      assert.equal(random1 < 200, true);

      const random2 = resolver(1).value as number;
      assert.equal(random2 > 199, true);
      assert.equal(random2 < 300, true);
    });

  })
});

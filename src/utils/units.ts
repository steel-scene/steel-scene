import { _ } from './resources';
import { isNumber } from './objects';

const unitExpression = /^([+-][=]){0,1}[ ]*([\-]{0,1}[0-9]*[\.]{0,1}[0-9]*){0,1}[ ]*(to){0,1}[ ]*([\-]{0,1}[0-9]*[\.]{0,1}[0-9]*)[ ]*([a-z%]+){0,1}[ ]*$/i;
const measureExpression = /^[ ]*([\-]{0,1}[0-9]*[\.]{0,1}[0-9]*){1}[ ]*([a-z%]+){0,1}$/i;

// export const stepNone: string = '=';
export const stepForward: string = '+=';
export const stepBackward: string = '-=';

export const random = (first: number, last: number, unit?: string, wholeNumbersOnly?: boolean): number | string => {
  let val = first + (Math.random() * (last - first));
  if (wholeNumbersOnly === true) {
    val = Math.floor(val);
  }
  return !unit ? val : val + unit;
}

/**
 * Returns a unit resolver.  The unit resolver returns what the unit should be
 * at a given index.  for instance +=200 should be 200 at 0, 400 at 1, and 600 at 2
 */
export const createUnitResolver = (val: string | number): UnitResolver => {
  if (!val && val !== 0) {
    return () => ({ unit: _, value: 0 });
  }
  if (isNumber(val)) {
    return () => ({ unit: _, value: val as number });
  }

  const match = unitExpression.exec(val as string) as RegExpExecArray;
  const stepTypeString = match[1];
  const startString = match[2];
  const toOperator = match[3];
  const endValueString = match[4];
  const unitTypeString = match[5];

  const startCo = startString ? parseFloat(startString) : _;
  const endCo = endValueString ? parseFloat(endValueString) : _;
  const sign = stepTypeString === stepBackward ? -1 : 1;
  const isIndexed = !!stepTypeString;
  const isRange = toOperator === 'to';

  const resolver = (index?: number) => {
    const index2 = isIndexed && (index || index === 0) ? index + 1 : 1;
    const value = isRange
      ? random(startCo! * (index2) * sign, (endCo! - startCo!) * index2 * sign) as number
      : startCo! * index2 * sign;

    return {
      unit: unitTypeString || _,
      value: value
    };
  };

  return resolver;
}

/**
 * Parses a string or number and returns the unit and numeric value
 */
export const parseUnit = (val: string | number | undefined, output?: Unit): Unit => {
  output = output || {} as Unit;

  if (!val && val !== 0) {
    output.unit = _;
    output.value = _;
  } else if (isNumber(val)) {
    output.unit = _;
    output.value = val as number;
  } else {
    const match = measureExpression.exec(val as string) as RegExpExecArray;
    const startString = match[1];
    const unitTypeString = match[2];

    output.unit = unitTypeString || _;
    output.value = startString ? parseFloat(startString) : _;
  }

  return output;
}

/**
 * returns the unit as a number (resolves seconds to milliseconds)
 */
export const convertToSeconds = (unit: Unit): number | undefined => {
  return unit.unit === 's' ? unit.value! * 1000 : unit.value;
}




export type Unit = {
  value: number | undefined;
  unit: string | undefined;
};

export type UnitResolver = {
  (index: number): Unit;
};

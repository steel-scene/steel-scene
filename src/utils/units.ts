import { _ } from './resources';
import { convertToFloat, isNumber } from './objects';

const measureExpression = /^[ ]*([\-]{0,1}[0-9]*[\.]{0,1}[0-9]*){1}[ ]*([a-z%]+){0,1}$/i;

export const random = (first: number, last: number, unit?: string, wholeNumbersOnly?: boolean): number | string => {
  let val = first + (Math.random() * (last - first));
  if (wholeNumbersOnly === true) {
    val = Math.floor(val);
  }
  return !unit ? val : val + unit;
}

/**
 * Parses a string or number and returns the unit and numeric value
 */
export const parseUnit = (val: string | number | undefined): Unit | number | undefined => {
  if (!val && val !== 0) {
    return _;
  }

  if (isNumber(val)) {
    return val as number;
  }

  const match = measureExpression.exec(val as string) as RegExpExecArray;
  const value = convertToFloat(match[1]);
  const unit = match[2];

  return unit === _ ? value : { value, unit };
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

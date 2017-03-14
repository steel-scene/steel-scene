import { Dictionary } from '../types';
import { _ } from './resources';

export const mapProperties = <TInput, TOutput>(input: Dictionary<TInput>, mapper: (key: string, val: TInput) => TOutput): Dictionary<TOutput> => {
  const output: Dictionary<TOutput> = {};
  for (const key in input) {
    if (!input.hasOwnProperty(key)) {
      continue;
    }
    output[key] = mapper(key, input[key]);
  }
  return output;
}

export const assignSignature = <T1 extends T2, T2>(target: T1, exclusions: string[] | undefined, ...sources: (T1 | T2)[]): T1 => { throw 'nope'; };

export const assign: typeof assignSignature = function (target: {}, exclusions: string[] | undefined): {} {
  const args = arguments;
  const hasExclusions = !!(exclusions && exclusions.length);

  for (let i = 2, len = args.length; i < len; i++) {
    const nextSource = args[i];
    if (!nextSource) {
      continue;
    }
    for (const nextKey in nextSource) {
      if (!nextSource.hasOwnProperty(nextKey) || (hasExclusions && exclusions!.indexOf(nextKey) !== -1)) {
        continue;
      }

      const val = nextSource[nextKey];
      // tslint:disable-next-line:no-null-keyword
      if (val === null || val === _) {
        continue;
      }
      target[nextKey] = val;
    }
  }

  return target;
};

export const convertToFloat = (numericString: string | undefined): number | undefined => {
  return !numericString ? _ : parseFloat(numericString);
};

export const isNumber = (obj: any) => typeof obj === 'number';
export const isString = (obj: any) => typeof obj === 'string';

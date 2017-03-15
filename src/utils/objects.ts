import { Dictionary } from '../types';
import { _ } from './constants';

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

export const assignSignature = <T1 extends T2, T2>(target: T1, blacklist: string[], ...sources: (T1 | T2)[]): T1 => { throw 'nope'; };

export const assign: typeof assignSignature = function (target: {}, blacklist: string[]): {} {
  const args = arguments;
  const hasExclusions = !!(blacklist && blacklist.length);

  for (let i = 2, len = args.length; i < len; i++) {
    const nextSource = args[i];
    if (!nextSource) {
      continue;
    }
    for (const nextKey in nextSource) {
      if (!nextSource.hasOwnProperty(nextKey) || (hasExclusions && blacklist!.indexOf(nextKey) !== -1)) {
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

export const toFloat = (numericString: string) => !numericString ? _ : parseFloat(numericString);
export const isNumber = (obj: any) => typeof obj === 'number';
export const isString = (obj: any) => typeof obj === 'string';

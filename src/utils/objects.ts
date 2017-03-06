import { Dictionary } from '../types';
import { _ } from './resources';

const assignInner = (target: {}, args: IArguments, exclusions?: string[]): {} => {
  const hasExclusions = !!(exclusions && exclusions.length);

  for (let i = 1, len = args.length; i < len; i++) {
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

export const assignSignature = <T1 extends T2, T2>(target: T1, ...sources: (T1 | T2)[]): T1 => {
  throw 'nope';
};

export const assign: typeof assignSignature = function (target: {}): {} {
  return assignInner(target, arguments);
};

export const assignExcept = function (target: {}, source: {}, exclusions: string[]): {} {
  return assignInner(target, arguments, exclusions);
};

export function propertyHead<T>(dictionary: Dictionary<T>, predicate: { (t: T): boolean; }): T | undefined {
  if (!dictionary) {
    return _;
  }

  for (let key in dictionary)  {
    const item = dictionary[key];
    if (predicate(item)) {
      return item;
    }
  }
  return _;
}

export const convertToFloat = (numericString: string | undefined): number | undefined => {
  return !numericString ? _ : parseFloat(numericString);
};

import { IDictionary } from '../types';
import { nil } from '../internal';

export const assignSignature = <T1 extends T2, T2>(target: T1, ...sources: (T1 | T2)[]): T1 => {
  throw 'nope';
};

export const assign: typeof assignSignature = function (target: {}): {} {
  const args = arguments;

  for (let i = 1, len = args.length; i < len; i++) {
    const nextSource = args[i];
    if (!nextSource) {
      continue;
    }
    for (const nextKey in nextSource) {
      if (!nextSource.hasOwnProperty(nextKey)) {
        continue;
      }
      const val = nextSource[nextKey];
      // tslint:disable-next-line:no-null-keyword
      if (val === null || val === undefined) {
        continue;
      }
      target[nextKey] = val;
    }
  }

  return target;
};

export function propertyHead<T>(dictionary: IDictionary<T>, predicate: { (t: T): boolean; }): T | undefined {
  if (!dictionary) {
    return nil;
  }

  for (let key in dictionary)  {
    const item = dictionary[key];
    if (predicate(item)) {
      return item;
    }
  }
  return nil;
}

export const convertToFloat = (numericString: string | undefined): number | undefined => {
  return !numericString ? nil : parseFloat(numericString);
};

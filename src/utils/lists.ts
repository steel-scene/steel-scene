import { List, Predicate } from '../types';
import { _ } from './resources';

export const head = <T>(indexed: List<T>, predicate: Predicate<T>): T | undefined => {
  if (!indexed) {
    return _;
  }

  for (let i = 0, len = indexed.length; i < len; i++) {
    const item = indexed[i];
    if (predicate(item)) {
      return item;
    }
  }
  return _;
};

export const copyArray = <T>(items: List<T>): T[] => {
  return Array.prototype.slice.call(items);
};

/**
 * Map function that skips undefined results
 */
export const mapf = <TInput, TOutput>(items: List<TInput>, mapper: { (input: TInput, index?: number): TOutput | undefined }): TOutput[] => {
  let output: TOutput[] | undefined = _;
  for (let i = 0, len = items.length; i < len; i++) {
    const result = mapper(items[i], i);
    if (result === _) {
      continue;
    }
    if (output === _) {
      output = [];
    }
    output.push(result);
  }
  return output || [];
};

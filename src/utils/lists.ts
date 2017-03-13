import { List } from '../types';

export const copyArray = <T>(items: List<T>): T[] => {
  return Array.prototype.slice.call(items);
};

export const each = <TInput>(items: List<TInput>, action: { (input: TInput, index?: number): void }): void  => {
  for (let i = 0, len = items.length; i < len; i++) {
    action(items[i], i);
  }
};

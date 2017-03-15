import { List } from '../types';

export const each = <TInput>(items: List<TInput>, action: { (input: TInput, index?: number): void }): void  => {
  for (let i = 0, len = items.length; i < len; i++) {
    action(items[i], i);
  }
};

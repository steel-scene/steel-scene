import { IList } from '../types';
import { nil } from '../internal';

export function head<T>(indexed: IList<T>, predicate: { (t: T): boolean; }): T | undefined {
  if (!indexed) {
    return nil;
  }

  for (let i = 0, len = indexed.length; i < len; i++) {
    const item = indexed[i];
    if (predicate(item)) {
      return item;
    }
  }
  return nil;
}
import { IList } from '../types';
import { _ } from './resources';

export function head<T>(indexed: IList<T>, predicate: { (t: T): boolean; }): T | undefined {
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
}

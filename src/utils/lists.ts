import { List } from '../types'

export const map = <TInput, TOutput>(items: List<TInput>, func: { (input: TInput): TOutput }) => {
  return Array.prototype.map.call(items, func) as TOutput[]
}

/** converts a single item to a list or returns an existing list  */
export const listify = <TInput>(items: TInput[] | TInput): TInput[] => {
  return !items
    ? []
    : !(items as TInput[]).length
      ? [items as TInput]
      : items as TInput[]
}

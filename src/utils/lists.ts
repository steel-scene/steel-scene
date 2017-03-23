import { List } from '../types'
import { _ } from './constants'

export const head = <TInput>(items: List<TInput>, func: { (input: TInput): boolean }): TInput  => {
  for (let i = 0, len = items.length; i < len; i++) {
    if (func(items[i])) {
      return items[i]
    }
  }
  return _
}

export const removeFromList = <TInput>(items: TInput[], item: TInput) => {
  const index = items.indexOf(item)
  if (index !== -1) {
    items.splice(index, 1)
  }
}

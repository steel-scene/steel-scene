import { Dictionary } from '../types'
import { _ } from './constants'

const { hasOwnProperty } = Object.prototype
export const findKey = <TInput>(items: Dictionary<TInput>, func: { (value: TInput, key?: string): boolean }): string  => {
  for (let key in items) {
    const val = items[key]
    if (func(val, key)) {
      return key
    }
  }
  return _
}

export function assign<T1 extends T2, T2>(target: T1, blacklist: string[], ...sources: (T1 | T2)[]): T1
export function assign(target: {} = {}, blacklist: string[]): {} {
  const args = arguments
  const hasExclusions = !!(blacklist && blacklist.length)

  for (let i = 2, len = args.length; i < len; i++) {
    const nextSource = args[i]
    if (!nextSource) {
      continue
    }
    for (const nextKey in nextSource) {
      if (!nextSource.hasOwnProperty(nextKey) || (hasExclusions && blacklist!.indexOf(nextKey) !== -1)) {
        continue
      }

      const val = nextSource[nextKey]
      // tslint:disable-next-line:no-null-keyword
      if (val === null || val === _) {
        continue
      }
      target[nextKey] = val
    }
  }

  return target
}

export const hasOwn = (owner: {}, key: string) => hasOwnProperty.call(owner, key)
export const toFloat = (numericString: string) => !numericString ? _ : parseFloat(numericString)
export const isDefined = (a: any) => !!a || a === 0 || a === false
export const isFunction = (a: any) => typeof a === 'function'
export const isNumber = (a: any) => typeof a === 'number'
export const isObject = (a: any) => typeof a === 'object' && !!a
export const isString = (a: any) => typeof a === 'string'
export const isArray = (a: any) => isDefined(a) && !isString(a) && !isFunction(a) && isNumber(a.length)

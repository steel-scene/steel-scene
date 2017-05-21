import { IObserver } from '../types'
import { _ } from '../utils'

const OBSERVER_KEY = '__ss_ob__'

const initProperty = <T1>(obj: T1, key: keyof (T1), observer: IObserver, emitChanged: () => void) => {
  // get property descriptors (getter, setters, etc.)
  const descriptor = Object.getOwnPropertyDescriptor(obj, key)

  // skip non-configurable properties
  if (descriptor && descriptor.configurable === false) {
    return
  }

  // capture getter/setters to proxy them
  const getter = descriptor && descriptor.get
  const setter = descriptor && descriptor.set

  // save current value and create an observable proxy
  let val = obj[key]

  // callback for when a child changes
  const onChildChanged = () => observer.notify(obj, key, val, val)

  // wrapped value object
  let valueObj = observe(val, observer, onChildChanged)

  // override descriptors with our own injected functions
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: () => getter ? getter.call(obj) : val,
    set: (newVal) => {
      const oldVal = getter ? getter.call(obj) : val
      // return if value is not different or if both sides are NaN
      if (newVal === oldVal || (newVal !== newVal && oldVal !== oldVal)) {
        return
      }

      // call setter or set value
      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }

      // create new observer for child object
      valueObj = observe(newVal, observer, onChildChanged)

      // emit change event for this property
      observer.notify(obj, key, newVal, oldVal)

      // notify the parent that this object changed
      emitChanged()
    }
  })
}

export const observe = <T1>(input: T1, observer: IObserver, emitChanged: () => void): T1 => {
  // if already marked as observable, return early
  if ((input as any).hasOwnProperty(OBSERVER_KEY)) {
    return input
  }

  // initialize all properties
  for (const key in input) {
    initProperty(input, key, observer, emitChanged)
  }

  // mark the object as an observable by adding a special key
  Object.defineProperty(input, OBSERVER_KEY, {
    configurable: false,
    enumerable: false,
    value: _
  })

  // return the same object for convenience
  return input
}

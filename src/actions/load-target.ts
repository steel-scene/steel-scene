import { ITargetOptions, ISteelState, IStoreNotifier } from '../types'
import { elementToTarget } from '../internal/importer'
import { assign, isElement, isString, resolveElement, INITIAL, SELECT, STATES, getTargets } from '../utils'

const targetAttributeBlackList = [STATES, SELECT]

export const loadTarget = (id: string, options: ITargetOptions | string | Element) => {
  return (store: ISteelState, notifier: IStoreNotifier) => {
    if (isString(options) || isElement(options)) {
      const element = resolveElement(options as (string | Element), true)
      options = elementToTarget(element)
    }

    const targetOptions = (options || {}) as ITargetOptions

    store.targets[id] = {
      currentState: INITIAL,
      props: assign({}, targetAttributeBlackList, targetOptions),
      states: targetOptions.states || {},
      targets: targetOptions.select ? getTargets(targetOptions.select) : []
    }
    notifier.dirty(id)
    return store
  }
}

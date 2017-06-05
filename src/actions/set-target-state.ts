import { ITargetOptions, ISteelState, IStoreNotifier } from '../types'
import { getStateHash } from '../utils'

export const transitionTargetState = (id: string, stateNames: string[], targetOptions?: ITargetOptions) => {
  return (store: ISteelState, notifier: IStoreNotifier) => {
    const target = store.targets[id]
    if (!target) {
      return store
    }

    // change if the property changed
    let isChanged = false
    if (getStateHash(target.currentState) !== getStateHash(stateNames)) {
      isChanged = true
      target.currentState = stateNames
    }

    // change if the options changed
    if (target.options !== targetOptions) {
      target.options = targetOptions
      isChanged = true
    }

    // notify change if any of the properties changed
    if (isChanged) {
      notifier.dirty(id)
    }
    return store
  }
}

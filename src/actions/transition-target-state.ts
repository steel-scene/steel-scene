import { ITargetOptions, ISteelState, IStoreNotifier } from '../types'
import { isString } from '../utils'

export const transitionTargetState = (id: string, stateNames: string | string[], targetOptions?: ITargetOptions) => {
  return (store: ISteelState, notifier: IStoreNotifier) => {
    const target = store.targets[id]
    if (!target) {
      return store
    }
    target.currentState = isString(stateNames) ? [ stateNames as string ] : stateNames as string[]
    target.options = targetOptions
    notifier.dirty(id)
    return store
  }
}

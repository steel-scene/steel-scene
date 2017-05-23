import { Dictionary, ISteelState, IStoreNotifier } from '../types'
import { assign, NAME, SELECT, STATES } from '../utils'

const targetBlackList = [STATES, SELECT, NAME]

export const updateTargetState = (id: string, stateName: string, props: Dictionary<any>) => {
  return (store: ISteelState, notifier: IStoreNotifier) => {
    const target = store.targets[id]
    if (!target) {
      return store
    }

    target.states[stateName] = assign(target.states[stateName], targetBlackList, props)
    notifier.dirty(id)
    return store
  }
}

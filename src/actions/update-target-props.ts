import { Dictionary, ISteelState, IStoreNotifier } from '../types'
import { assign, SELECT, STATES } from '../utils'

const targetBlackList = [STATES, SELECT]

export const updateTargetProps = (id: string, targets: Dictionary<any>) => {
  return (store: ISteelState, notifier: IStoreNotifier) => {
    const target = store.targets[id]
    if (target) {
      target.props = assign({}, targetBlackList, target.props, targets)
      notifier.dirty(id)
    }
    return store
  }
}

import { AnimationTarget, ISteelState, IStoreNotifier } from '../types'
import { STEEL_TARGET } from '../utils'

export const updateTargetTargets = (id: string, targets: AnimationTarget) => {
  return (store: ISteelState, notifier: IStoreNotifier) => {
    const target = store.targets[id]

    if (!target) {
      return store
    }

    // reassign target id
    for (let i = 0, ilen = targets.length; i < ilen; i++) {
      const newTarget = targets[i]
      if (target.targets.indexOf(newTarget) === -1) {
        targets[i][STEEL_TARGET] = id
        target.targets.push(newTarget)
      }
    }

    notifier.dirty(id)
    return store
  }
}

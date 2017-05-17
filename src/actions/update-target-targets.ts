import { AnimationTarget, ISteelState } from '../types'
import { STEEL_TARGET } from '../utils'

export const updateTargetTargets = (id: string, targets: AnimationTarget) => {
  return (store: ISteelState) => {
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

    return store
  }
}

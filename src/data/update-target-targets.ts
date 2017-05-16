import { UPDATE_TARGET_TARGETS } from './actions'
import { AnimationTarget, ISteelAction, ISteelState } from '../types'
import { STEEL_TARGET } from '../utils'

export interface IUpdateStateDefinitionAction extends ISteelAction {
  id: string
  targets: AnimationTarget
}

export const onUpdateTargetTargets = (store: ISteelState, action: IUpdateStateDefinitionAction) => {
  const { id, targets } = action
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

export const updateTargetTargets = (id: string, targets: AnimationTarget): IUpdateStateDefinitionAction => {
  return { targets, id, type:  UPDATE_TARGET_TARGETS }
}

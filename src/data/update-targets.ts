import { AnimationTarget, ISteelAction, ISteelState } from '../types'
import { STEEL_TARGET } from '../utils'

export const TARGET_TARGET_MERGE = 'TARGET_TARGET_MERGE'

export interface IUpdateStateDefinitionAction extends ISteelAction<'TARGET_TARGET_MERGE'> {
  id: string
  targets: AnimationTarget
}

export const onUpdateTargets = (store: ISteelState, action: IUpdateStateDefinitionAction) => {
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

export const mergeTargets = (id: string, targets: AnimationTarget): IUpdateStateDefinitionAction => {
  return { targets, id, type: TARGET_TARGET_MERGE }
}

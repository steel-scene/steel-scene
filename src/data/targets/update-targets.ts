import { AnimationTarget, ISteelAction, ITargetState } from '../../types'
import { STEEL_TARGET } from '../../utils/constants'

export const TARGET_TARGET_MERGE = 'TARGET_TARGET_MERGE'

export interface IUpdateStateDefinitionAction extends ISteelAction<'TARGET_TARGET_MERGE'> {
  id: string
  targets: AnimationTarget
}

export const onUpdateTargets = (target: ITargetState, action: IUpdateStateDefinitionAction) => {
  if (action.type !== TARGET_TARGET_MERGE) {
    return target
  }

  const newTargets = action.targets
  const id = action.id

  // reassign targets
  for (let i = 0, ilen = newTargets.length; i < ilen; i++) {
    const newTarget = newTargets[i]
    if (target.targets.indexOf(newTarget) === -1) {
      newTargets[i][STEEL_TARGET] = id
      target.targets.push(newTarget)
    }
  }
  return target
}

export const mergeTargets = (id: string, targets: AnimationTarget): IUpdateStateDefinitionAction => {
  return { targets, id, type: TARGET_TARGET_MERGE }
}

import { REMOVE_SCENE_TARGET } from './actions'
import { ISteelAction, ISteelState } from '../types'

export interface IRemoveSceneTargetAction extends ISteelAction {
  id: string
  targets: string | string[]
}

export const onRemoveSceneTargets = (store: ISteelState, action: IRemoveSceneTargetAction) => {
  const { id, targets } = action
  const scene = store.scenes[id]
  if (!scene) {
    return store
  }
  for (let i = scene.targets.length - 1; i > -1; --i) {
    const target = targets[i]
    if (targets.indexOf(target) !== -1) {
      scene.targets.splice(i, 1)
    }
  }
  return store
}

export const removeSceneTargets = (id: string, targets: string[]): IRemoveSceneTargetAction => {
  return { id, targets, type: REMOVE_SCENE_TARGET }
}

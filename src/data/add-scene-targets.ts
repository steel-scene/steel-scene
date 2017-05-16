import { ADD_SCENE_TARGET } from './actions'
import { ISteelAction, ISteelState } from '../types'

export interface IAddSceneTargetAction extends ISteelAction {
  id: string
  targets: string | string[]
}

export const onAddSceneTargets = (store: ISteelState, action: IAddSceneTargetAction) => {
  const { id, targets } = action
  const scene = store.scenes[id]
  if (!scene) {
    return store
  }
  for (let i = 0, len = targets.length; i < len; i++) {
    const newTarget = targets[i]
    if (scene.targets.indexOf(newTarget) === -1) {
      scene.targets.push(newTarget)
    }
  }
  return store
}

export const addSceneTargets = (id: string, targets: string | string[]): IAddSceneTargetAction => {
  return { id, targets, type: ADD_SCENE_TARGET }
}

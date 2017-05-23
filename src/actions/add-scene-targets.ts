import {  IStoreNotifier, ISteelState } from '../types'

export const addSceneTargets = (id: string, targets: string | string[]) => {
  return (store: ISteelState, notifer: IStoreNotifier) => {
    const scene = store.scenes[id]
    if (!scene) {
      return store
    }
    for (let i = 0, len = targets.length; i < len; i++) {
      const targetId = targets[i]
      if (scene.targets.indexOf(targetId) === -1) {
        scene.targets.push(targetId)
        notifer.dirty(targetId)
      }
    }
    return store
  }
}

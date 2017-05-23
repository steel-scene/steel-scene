import { IStoreNotifier, ISteelState } from '../types'

export const removeSceneTargets = (id: string, targets: string[]) => {
  return (store: ISteelState, notifer: IStoreNotifier) => {
    const scene = store.scenes[id]
    if (!scene) {
      return store
    }
    for (let i = scene.targets.length - 1; i > -1; --i) {
      const targetId = scene.targets[i]
      if (targets.indexOf(targetId) !== -1) {
        scene.targets.splice(i, 1)
        notifer.dirty(targetId)
      }
    }
    return store
  }
}

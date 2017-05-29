import { IStoreNotifier, ISteelState } from '../types'
import { _ } from '../utils'

export const removeSceneTargets = (id: string, targets: string[]) => {
  return (store: ISteelState, notifer: IStoreNotifier) => {
    const scene = store.scenes[id]
    if (!scene) {
      return store
    }
    for (let i = scene.targets.length - 1; i > -1; --i) {
      // remove target from scene
      const targetId = scene.targets[i]
      if (targets.indexOf(targetId) !== -1) {
        scene.targets.splice(i, 1)
        notifer.dirty(targetId)
      }

      // remove scene from target
      const target = store.targets[targetId]
      if (target !== _) {
        const index = target.scenes.indexOf(id)
        if (index !== -1) {
          target.scenes.splice(index, 1)
          notifer.dirty(targetId)
        }
      }
    }

    return store
  }
}

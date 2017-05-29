import { IStoreNotifier, ISteelState } from '../types'
import { _ } from '../utils'

export const addSceneTargets = (id: string, targets: string[]) => {
  return (store: ISteelState, notifer: IStoreNotifier) => {
    const scene = store.scenes[id]
    if (!scene) {
      return store
    }
    for (let i = 0, len = targets.length; i < len; i++) {
      const targetId = targets[i]
      const target = store.targets[targetId]
      if (target === _) {
        continue
      }

      // add target to scene
      if (scene.targets.indexOf(targetId) === -1) {
        scene.targets.push(targetId)
        notifer.dirty(targetId)
      }

      // add scene to target
      if (target.scenes.indexOf(id) === -1) {
        target.scenes.push(id)
        notifer.dirty(targetId)
      }
    }
    return store
  }
}

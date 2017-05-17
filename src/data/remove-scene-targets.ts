import { ISteelState } from '../types'

export const removeSceneTargets = (id: string, targets: string[]) => {
  return (store: ISteelState) => {
    const scene = store.scenes[id]
    if (!scene) {
      return store
    }
    for (let i = scene.targets.length - 1; i > -1; --i) {
      const target = scene.targets[i]
      if (targets.indexOf(target) !== -1) {
        scene.targets.splice(i, 1)
      }
    }
    return store
  }
}

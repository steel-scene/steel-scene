import {  ISteelState } from '../types'

export const addSceneTargets = (id: string, targets: string | string[]) => {
  return (store: ISteelState) => {
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
}

import { ISteelState, IStoreNotifier } from '../types'
import { setSceneState } from './set-target-state'

export const setTargetState = (id: string, stateName: string) => {
  return (store: ISteelState, notifer: IStoreNotifier) => {
    const scene = store.scenes[id]
    if (!scene) {
      return store
    }

    const { targets } = scene
    for (let i = 0, len = targets.length; i < len; i++) {
      store = setSceneState(targets[i], stateName)(store, notifer)
    }

    return store
  }
}

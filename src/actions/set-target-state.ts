import { ISteelState, IStoreNotifier } from '../types'
import { assign } from '../utils'
import { queueSet } from '../internal/engine'

export const setTargetState = (id: string, stateName: string) => {
  return (store: ISteelState, notifer: IStoreNotifier) => {
    const scene = store.scenes[id]
    if (!scene) {
      return store
    }

    const targets = scene.targets
    for (let i = 0, len = targets.length; i < len; i++) {
      const targetId = targets[i]
      const target = store.targets[targetId]
      if (!target) {
        continue
      }

      const state = target.states[stateName]
      // skip update operation target doesn't have state
      if (!state) {
        continue
      }

      // tell animation engine to set the state directly
      queueSet({
        props: assign({}, [], target.props, state),
        targetId: id,
        targets: target.targets
      })

      target.currentState = stateName
      notifer.dirty(id)
    }

    return store
  }
}

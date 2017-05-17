import { ISteelState } from '../types'
import { assign } from '../utils'
import { queueSet } from '../internal/engine'

export const setSceneState = (id: string, stateName: string) => {
  return (store: ISteelState) => {
    const target = store.targets[id]
    if (!target) {
      return store
    }

    const state = target.states[stateName]
    // skip update operation target doesn't have state
    if (state) {
      // tell animation engine to set the state directly
      queueSet({
        props: assign({}, [], target.props, state),
        targetId: id,
        targets: target.targets
      })

      target.currentState = stateName
    }

    return store
  }
}

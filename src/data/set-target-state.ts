import { SET_TARGET_STATE } from './actions'
import { ISteelAction, ISteelState } from '../types'
import { assign } from '../utils'
import { queueSet } from '../internal/engine'

export interface ISetStateAction extends ISteelAction {
  id: string
  stateName: string
}

export const onSetTargetState = (store: ISteelState, action: ISetStateAction) => {
  const { stateName, id } = action
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
      targetId: action.id,
      targets: target.targets
    })

    target.currentState = stateName
  }

  return store
}

export const setTargetState = (id: string, stateName: string): ISetStateAction => {
  return { id, stateName, type: SET_TARGET_STATE }
}

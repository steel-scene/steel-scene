import { ActionType } from './actions'
import { ISteelAction, ISteelState } from '../types'
import { assign } from '../utils'
import { queueSet } from '../internal/engine'

export const SET_TARGET_STATE = 'TARGET_SET'

export interface ISetStateAction extends ISteelAction<ActionType.SET_TARGET_STATE> {
  id: string
  stateName: string
}

export const onSetTargetState = (store: ISteelState, action: ISetStateAction) => {
  const { stateName, id } = action
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
      targetId: action.id,
      targets: target.targets
    })

    target.currentState = stateName
  }

  return store
}

export const setTargetState = (id: string, stateName: string): ISetStateAction => {
  return { id, stateName, type: ActionType.SET_TARGET_STATE }
}

import { SET_SCENE_STATE } from './actions'
import { ISteelAction, ISteelState } from '../types'
import { assign } from '../utils'
import { queueSet } from '../internal/engine'

export interface ISetSceneStateAction extends ISteelAction {
  id: string
  stateName: string
}

export const onSetSceneState = (store: ISteelState, action: ISetSceneStateAction) => {
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

export const setSceneState = (id: string, stateName: string): ISetSceneStateAction => {
  return { id, stateName, type: SET_SCENE_STATE }
}

import { ISteelAction, ISteelState } from '../types'
import { assign } from '../utils'
import { queueSet } from '../internal/engine'

export const TARGET_SET = 'TARGET_SET'

export interface ISetStateAction extends ISteelAction<'TARGET_SET'> {
  id: string
  stateName: string
}

export const onSetState = (store: ISteelState, action: ISetStateAction) => {
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

export const setState = (id: string, stateName: string): ISetStateAction => {
  return { id, type: TARGET_SET, stateName }
}

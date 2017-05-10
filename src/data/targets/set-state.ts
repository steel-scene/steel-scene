import { ISteelAction, ITargetState } from '../../types'
import { assign } from '../../utils'
import { queueSet } from '../../internal/engine'

export const TARGET_SET = 'TARGET_SET'

export interface ISetStateAction extends ISteelAction<'TARGET_SET'> {
  id: string
  stateName: string
}

export const onSetState = (target: ITargetState, action: ISetStateAction) => {
  if (action.type !== TARGET_SET) {
    return target
  }
  const toStateName = action.stateName
  const state = target.states[toStateName]

  // skip update operation target doesn't have state
  if (state) {
    // tell animation engine to set the state directly
    queueSet({
      props: assign({}, [], target.props, state),
      targetId: action.id,
      targets: target.targets
    })

    target.currentState = toStateName
  }

  return target
}

export const setState = (id: string, stateName: string): ISetStateAction => {
  return { id, type: TARGET_SET, stateName }
}

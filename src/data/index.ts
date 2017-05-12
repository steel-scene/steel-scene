import { ISteelAction, ISteelState } from '../types'
import { ActionType } from './actions'
import { onLoadTarget } from './load-target'
import { onSetTargetState } from './set-target-state'
import { onUpdateTargetProps } from './update-target-props'
import { onUpdateTargetStates } from './update-target-states'
import { onUpdateTargetTargets } from './update-target-targets'
import { onTransitionTargetState } from './transition-target-state'

let store: ISteelState = {
  targets: {}
}

const reducers: { [type: string]: (s: ISteelState, a: ISteelAction) => ISteelState } = {
  [ActionType.LOAD_TARGET]: onLoadTarget,
  [ActionType.SET_TARGET_STATE]: onSetTargetState,
  [ActionType.UPDATE_TARGET_PROPS]: onUpdateTargetProps,
  [ActionType.UPDATE_TARGET_STATES]: onUpdateTargetStates,
  [ActionType.UPDATE_TARGET_TARGETS]: onUpdateTargetTargets,
  [ActionType.TRANSITION_TARGET_STATE]: onTransitionTargetState
}

const onUpdateAllTargets = (store2: ISteelState, action: ISteelAction) => {
  const reducer = reducers[action.type]
  return reducer ? reducer(store2, action) : store2
}

export const getState = () => {
  return store
}

export const dispatch = (action: ISteelAction) => store = onUpdateAllTargets(store, action)

export { loadTarget } from './load-target'
export { setTargetState } from './set-target-state'
export { transitionTargetState } from './transition-target-state'
export { updateTargetProps } from './update-target-props'
export { updateTargetState } from './update-target-states'
export { updateTargetTargets } from './update-target-targets'

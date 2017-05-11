import { ISteelAction, ISteelState } from '../types'
import { LOAD_TARGET, onLoadTarget } from './load-target'
import { TARGET_SET, onSetState } from './set-state'
import { TARGET_PROPS_MERGE, onUpdateProps } from './update-props'
import { TARGET_STATE_MERGE, onUpdateStates } from './update-states'
import { TARGET_TARGET_MERGE, onUpdateTargets } from './update-targets'
import { TARGET_TRANSITION, onTransitionState } from './transition-state'

let store: ISteelState = {
  targets: {}
}

const reducers: { [type: string]: (s: ISteelState, a: ISteelAction<string>) => ISteelState } = {
  [LOAD_TARGET]: onLoadTarget,
  [TARGET_SET]: onSetState,
  [TARGET_PROPS_MERGE]: onUpdateProps,
  [TARGET_STATE_MERGE]: onUpdateStates,
  [TARGET_TARGET_MERGE]: onUpdateTargets,
  [TARGET_TRANSITION]: onTransitionState
}

const onUpdateAllTargets = (store2: ISteelState, action: ISteelAction<string>) => {
  const reducer = reducers[action.type]
  return reducer ? reducer(store2, action) : store2
}

export function getState(): ISteelState {
  return store
}

export function dispatch(action: ISteelAction<string>): ISteelState {
  return store = onUpdateAllTargets(store, action)
}

export { loadTarget } from './load-target'
export { setState } from './set-state'
export { transitionState } from './transition-state'
export { updateProps } from './update-props'
export { updateStateDefinitions } from './update-states'
export { mergeTargets } from './update-targets'

import { Dictionary, ISteelAction, ITargetState } from '../../types'
import { LOAD_TARGET, onLoadTarget } from './load-target'
import { onSetState } from './set-state'
import { onUpdateProps } from './update-props'
import { onUpdateStates } from './update-states'
import { onUpdateTargets } from './update-targets'
import { onTransitionState } from './transition-state'

export const onUpdateAllTargets = (stateTargets: Dictionary<ITargetState> = {}, action: ISteelAction<string>) => {
  const id = action.id
  const target = stateTargets[id]

  if (target !== undefined) {
    target.props = onUpdateProps(target.props, action as any)
    target.states = onUpdateStates(target.states, action as any)

    onUpdateTargets(target, action as any)
    onSetState(target, action as any)
    onTransitionState(target, action as any)
  }

  if (action.type === LOAD_TARGET) {
    onLoadTarget(stateTargets, action as any)
  }

  return stateTargets
}

export { loadTarget } from './load-target'
export { setState } from './set-state'
export { transitionState } from './transition-state'
export { updateProps } from './update-props'
export { updateStateDefinitions } from './update-states'
export { mergeTargets } from './update-targets'

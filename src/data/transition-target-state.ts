import { ActionType } from './actions'
import { ISteelAction, ITargetOptions, ISteelState } from '../types'
import { queueTransition } from '../internal/engine'
import { _, assign, DURATION, INHERITED, isString, missingArg } from '../utils'

export const TRANSITION_TARGET_STATE = 'TARGET_TRANSITION'

export interface ITransitionStateAction extends ISteelAction<ActionType.TRANSITION_TARGET_STATE> {
  id: string
  stateNames: string | string[]
  targetOptions?: ITargetOptions
}

export const onTransitionTargetState = (store: ISteelState, action: ITransitionStateAction) => {
  const { id, stateNames, targetOptions } = action

  const target = store.targets[id]
  if (!target) {
    return store
  }

  const { props, states, targets } = target
  const inherited = targetOptions && targetOptions.inherited

  let fromStateName: string
  const createAnimation = (toStateName: string) => {

    // lookup definition for the next state
    const toState = states[toStateName]

    // lookup last know state of this target
    const fromState = states[fromStateName]

    const options: ITargetOptions = assign(
      {},
      [INHERITED],
      inherited ? targetOptions : _,
      props,
      toState,
      !inherited ? targetOptions : _
    )

    // get duration from cascade of durations
    const { duration, easing } = options

    // the engine won't know what to do without a duration, will have to relax
    // this if  we add physics based durations
    if (!duration) {
      throw missingArg(DURATION)
    }

    // record the last known state of this target
    fromStateName = toStateName

    if (!toState) {
      // push undefined if nothing to do (this is necessary to keep multiple targets in sync)
      return {
        duration,
        easing,
        keyframes: [],
        stateName: toStateName
      }
    }

    // create a new tween with "from" as 0 and "to" as 1
    return {
      duration,
      easing,
      keyframes: [
        assign({}, _, fromState),
        assign({}, _, toState)
      ],
      stateName: toStateName
    }
  }

  const animations = isString(stateNames)
    ? [createAnimation(stateNames as string)]
    : (stateNames as string[]).map(createAnimation)

  // queue up this timeline
  queueTransition({
    animations,
    onStateChange(stateName: string) {
      target.currentState = stateName
    },
    targetId: id,
    targets
  })

  return store
}

export const transitionTargetState = (id: string, stateNames: string | string[], targetOptions?: ITargetOptions): ITransitionStateAction => {
  return { id, stateNames, targetOptions, type: ActionType.TRANSITION_TARGET_STATE }
}

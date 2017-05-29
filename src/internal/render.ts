import { subscribe } from './store'
import { ISteelState, ITargetOptions, ITargetState } from '../types'
import { queueTransition } from '../internal/engine'
import { _, assign, DURATION, INHERITED, missingArg } from '../utils'

const updateTarget = (store: ISteelState, targetId: string, target: ITargetState) => {
  const { currentState, props, states, targets, options, scenes } = target
  const inherited = options && options.inherited

  // apply option inherited options
  const toState = assign({}, [INHERITED], inherited ? options : _) as ITargetOptions

  // overlay all scene inherited values
  for (let i = 0, len = scenes.length; i < len; i++) {
    const scene = store.scenes[scenes[i]]
    assign(toState, [INHERITED], scene.props)
  }

  // add target props
  assign(toState, [INHERITED], props)

  // overlay all state values
  for (let i = 0, len = currentState.length; i < len; i++) {
     assign(toState, [INHERITED], states[currentState[i]])
  }

  // overlay overrides
  assign(toState, [INHERITED], inherited ? _ : options)

  // get duration from cascade of durations
  const { duration, easing } = toState

  // the engine won't know what to do without a duration, will have to relax
  // this if  we add physics based durations
  if (!duration) {
    throw missingArg(DURATION)
  }

  const animations = [{
    duration,
    easing,
    keyframes: [toState]
  }]

  // queue up this timeline
  queueTransition({
    animations,
    targetId,
    targets
  })
}

const render = (store: ISteelState, updates: string[]) => {
  for (let i = 0, len = updates.length; i < len; i++) {
    const id = updates[i]
    const target = store.targets[id]
    if (target) {
      updateTarget(store, id, target)
    }
  }
}

export const startRendering = () => subscribe(render)

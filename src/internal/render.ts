import { subscribe } from './store'
import { ISteelState, ITargetOptions, ITargetTimeline } from '../types'
import { getEngine } from '../internal/engine'
import { _, hasOwn, DURATION, INHERITED, missingArg } from '../utils'

const combineTargetProperty = (current: any, next: any): any => {
  return next
}

const combineTargetOptions = (targetOptions: ITargetOptions[]) => {
  const current = {} as ITargetOptions
  for (let i = 0, len = targetOptions.length; i < len; i++) {
    const next = targetOptions[i]
    // skip empty/undefined/falsy
    if (!next) {
      continue
    }

    for (const key in next) {
      // skip prototype functions/etc.
      if (key === INHERITED || !hasOwn(next, key)) {
        continue
      }
      // combine property values
      current[key] = combineTargetProperty(current[key], next[key])
    }
  }
  return current
}

const getTween = (store: ISteelState, targetId: string) => {
  const target = store.targets[targetId]
  if (!target) {
    return _
  }

  const { currentState, props, states, targets, options, scenes } = target
  const inherited = options && options.inherited

  // apply option inherited options
  const targetOptions: ITargetOptions[] = []
  if (inherited) {
    targetOptions.push(options)
  }

  // overlay all scene inherited values
  for (let i = 0, len = scenes.length; i < len; i++) {
    targetOptions.push(store.scenes[scenes[i]].props)
  }

  // add target props
  targetOptions.push(props)

  // overlay all state values
  for (let i = 0, len = currentState.length; i < len; i++) {
    targetOptions.push(states[currentState[i]])
  }

  // overlay overrides
  if (!inherited) {
    targetOptions.push(options)
  }

  // get duration from cascade of durations
  const toState = combineTargetOptions(targetOptions)
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
  return {
    animations,
    targetId,
    targets
  }
}

const render = (store: ISteelState, updates: string[]) => {
  const tweens: ITargetTimeline[] = []
  for (let i = 0, len = updates.length; i < len; i++) {
    const tween = getTween(store, updates[i])
    if (tween) {
      tweens.push(tween)
    }
  }
  if (tweens.length) {
    getEngine().transition(tweens)
  }
}

export const startRendering = () => subscribe(render)

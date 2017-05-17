import { _, STEEL_TARGET, getTargets, guid } from '../utils'
import { AnimationTargetOptions, ITargetOptions } from '../types'
import {
  loadTarget,
  setTargetState,
  transitionTargetState,
  updateTargetState,
  updateTargetTargets
} from '../actions'

import { dispatch } from './store'

export class Target {
  constructor(public readonly id: string = guid()) {  }

  on(stateName: string, props: {}): this {
    const self = this
    dispatch(updateTargetState(this.id, stateName, props))
    return self
  }
  /** loads from a selector, element, htmlString, or json options, returns this */
  load(options?: ITargetOptions | string | Element): this {
    const self = this
    dispatch(loadTarget(self.id, options))
    return self
  }
  select(...animationTargets: AnimationTargetOptions[]): this
  select(): this {
    const self = this
    dispatch(updateTargetTargets(self.id, getTargets(arguments)))
    return self
  }
  set(toStateName: string) {
    const self = this
    dispatch(setTargetState(self.id, toStateName))
    return self
  }
  transition(stateNames: string | string[], targetOptions?: ITargetOptions) {
    const self = this
    dispatch(transitionTargetState(self.id, stateNames, targetOptions))
    return self
  }
}

export function target(animationTargets?: AnimationTargetOptions, options?: ITargetOptions): Target {
  // if transition has a name and is not auto-named, try to locate an existing scene
  const targets = getTargets(animationTargets)

  // if any targets could be resolved
  let id: string = _
  if (targets.length) {
    const targetInstance: string = targets[0][STEEL_TARGET]

    // only treat this as a new target if targets haven't changed
    const allSameTarget = targetInstance !== _ && targets.every(t2 => t2[STEEL_TARGET] === targetInstance)
    if (allSameTarget) {
      id = targetInstance
    }
  }

  return new Target(id)
    .load(options)
    .select(targets)
}

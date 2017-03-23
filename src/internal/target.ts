import { findElements, getAttributes, getTargets, isElement, resolveElement } from '../utils/elements'
import { missingArg } from '../utils/errors'
import { guid } from '../utils/guid'
import { assign, isString } from '../utils/objects'
import { _, DURATION, INHERITED, NAME, S_STATE, SELECT, STATES, STEEL_TARGET } from '../utils/constants'
import { AnimationTargetOptions, AnimationTarget, Dictionary } from '../types'
import { queueSet, queueTransition } from './engine'

const targetAttributeBlackList = [STATES, SELECT]
const stateAttributeBlackList = [NAME]

export const elementToTarget = ($target: Element): ITargetOptions => {
  const states: Dictionary<any> = {}
  const elements = findElements(S_STATE, $target)
  for (let i = 0, ilen = elements.length; i < ilen; i++) {
    const attributes = getAttributes(elements[i], _)
    // tslint:disable-next-line:no-string-literal
    states[attributes[NAME]] = attributes
  }

  // read all "state" elements
  // assemble state elements and properties and to the list
  const props = getAttributes($target, _) as ITargetOptions
  props.states = states
  return props
}


export class Target {
  readonly id: string = guid()
  currentState: string
  targets: AnimationTarget = []
  props: Dictionary<any> = {}
  states: Dictionary<{}> = {}

  on(stateName: string, props: {}): this {
    const self = this
    self.states[stateName] = assign({}, stateAttributeBlackList, props)
    return self
  }

  /** loads from a selector, element, htmlString, or json options, returns this */
  load(options?: ITargetOptions | string | Element): this {
    const self = this
    // skip if nothing was passed in
    if (!options) {
      return self
    }

    if (isString(options) || isElement(options)) {
      const element = resolveElement(options as (string | Element), true)
      options = elementToTarget(element)
    }

    self.states = options[STATES]
    self.props = assign({}, targetAttributeBlackList, options)
    return self
  }

  select(...animationTargets: AnimationTargetOptions[]): this;
  select(): this {
    const self = this
    // unassign self from all current targets
    for (let i = 0, ilen = self.targets.length; i < ilen; i++) {
      const t = self.targets
      if (t[STEEL_TARGET]) {
        t[STEEL_TARGET] = _
      }
    }

    // detect targets
    const targets = getTargets(arguments)

    // reassign targets
    for (let i = 0, ilen = targets.length; i < ilen; i++) {
      targets[i][STEEL_TARGET] = self
    }

    // add new targets
    self.targets.push.apply(self.targets, targets)
    return self
  }

  set(toStateName: string) {
    const self = this
    const state = self.states[toStateName]

    // skip update operation target doesn't have state
    if (state) {
      // tell animation engine to set the state directly
      queueSet({
        props: assign({}, [], self.props, state),
        targetId: self.id,
        targets: self.targets
      })
      self.currentState = toStateName
    }

    return self
  }

  transition(stateNames: string | string[], targetOptions?: ITargetOptions) {
    const self = this
    const { states, targets } = self
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
        self.props,
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
        self.currentState = stateName
      },
      targetId: self.id,
      targets
    })

    return self
  }
}

export interface ITargetOptions {
  /** true if used as defaults. false if used as overrides. defaults to false  */
  inherited?: boolean
  /** number of milliseconds to animate the target  */
  duration?: number
  /** easing timing function to use  */
  easing?: string
  /** states to configure */
  states?: Dictionary<Dictionary<any>>
  /** element to select */
  select?: string
  [name: string]: boolean | number | string | Dictionary<any>
}

export function target(animationTargets?: AnimationTargetOptions, options?: ITargetOptions): Target {
  // if transition has a name and is not auto-named, try to locate an existing scene
  const targets = getTargets(animationTargets)

  // if any targets could be resolved
  let t: Target = _
  if (targets.length) {
    const targetInstance = targets[0][STEEL_TARGET]

    // only treat this as a new target if targets haven't changed
    const allSameTarget = targetInstance !== _ && targets.every(t2 => t2[STEEL_TARGET] === targetInstance)
    if (allSameTarget) {
      t = targetInstance
    }
  }
  if (!t) {
    t = new Target().select(targets)
  }
  if (options) {
    t.load(options)
  }
  return t
}

import { findElements, getAttributes, getTargets, isElement, resolveElement } from '../utils/elements'
import { guid } from '../utils/guid'
import { assign, isString } from '../utils/objects'
import { _, NAME, S_STATE, STATES, SELECT, STEEL_TARGET } from '../utils/constants'
import { AnimationTargetOptions, AnimationTarget, Dictionary } from '../types'
import { getEngine } from './engine'

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
      getEngine().set([
        {
          props: assign({}, _, self.props, state),
          targets: self.targets
        }
      ])
      self.currentState = toStateName
    }

    return self
  }
}


export interface ITargetOptions {
  default?: boolean
  duration?: number
  easing?: string
  transition?: string
  states: Dictionary<Dictionary<any>>
  select: string;
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

// import from utils
import { _, DEFAULT, DURATION, EASING, INITIAL, NAME, S_TARGET, S_TRANSITION, TRANSITION } from '../utils/constants'
import { findElements, getAttributes, isElement, resolveElement } from '../utils/elements'
import { missingArg } from '../utils/errors'
import { guid } from '../utils/guid'
import { contains, each, head, removeFromList } from '../utils/lists'
import { assign, isString } from '../utils/objects'

// import from internal
import { getEngine } from './engine'
import { elementToTarget, ITargetOptions, target, Target } from './target'
import { elementToTransition, ITransitionOptions, transition, Transition } from './transition'
import { Dictionary, ISetOperation, IStateTween, ITargetTween, ITimelineTween } from '../types'

const sceneAttributeWhitelist = [NAME]

let _scenes: Scene[] = []

export const sceneElementToTargets = ($scene: Element): ITargetOptions[] => {
  return findElements(S_TARGET, $scene).map(elementToTarget)
}

export const sceneElementToTransitions = ($scene: Element): ITransitionOptions[] => {
  return findElements(S_TRANSITION, $scene).map(elementToTransition)
}

export const elementToScene = ($scene: Element): ISceneOptions => {
  const sceneOptions = getAttributes($scene, sceneAttributeWhitelist) as ISceneOptions
  sceneOptions.targets = sceneElementToTargets($scene)
  sceneOptions.transitions = sceneElementToTransitions($scene)
  return sceneOptions
}

export class Scene {
  readonly id: string = guid()

  _targets: Target[] = []
  _transitions: Transition[] = []

  defaultTransition: string
  defaultState: string
  currentState: string
  name: string

  constructor(name: string) {
    this.name = name || this.id
  }

  add(...objects: (Target | Transition)[]): this;
  add(): this {
    const self = this
    const args = arguments
    for (let i = 0, len = args.length; i < len; i++) {
      const arg = args[i]
      if (arg instanceof Target && !contains(self._targets, arg)) {
        self._targets.push(arg)
      }
      if (arg instanceof Transition && !contains(self._transitions, arg)) {
        self._transitions.push(arg)
      }
    }
    return self
  }

  remove(...objects: (Target | Transition)[]): this;
  remove(): this {
    const self = this
    const args = arguments
    for (let i = 0, len = args.length; i < len; i++) {
      const arg = args[i]
      if (arg instanceof Target) {
        removeFromList(self._targets, arg)
      }
      if (arg instanceof Transition) {
        removeFromList(self._transitions, arg)
      }
    }
    return self
  }

  load(options: ISceneOptions | Element | string) {
    const self = this
    if (!options) {
      return self
    }

    const json = isString(options) || isElement(options)
      ? elementToScene(
        resolveElement(options as (string | Element), true)
      )
      : options as ISceneOptions

    // set a name for the default transition if it doesn't have one
    let defaultTransition: string
    json.transitions.filter(t => t.default).forEach(t => {
      if (!t.name) {
        t.name = DEFAULT
      }
      defaultTransition = t.name
    })

    self._transitions = json.transitions.map(s => transition(s.name, s))
    self._targets = json.targets.map(s => target(s.select, s))

    if (json.name) {
      self.name = json.name
    }

    self.defaultTransition = defaultTransition
    self.defaultState = INITIAL
    self.currentState = INITIAL
    return self
  }

  reset() {
    return this.set(this.defaultState)
  }

  set(toStateName: string) {
    const self = this

    const setOperations: ISetOperation[] = []
    for (const targetName in self._targets) {
      const target = self._targets[targetName]
      const state = target.states[toStateName]

      // skip update operation target doesn't have state
      if (state) {
        setOperations.push({
          props: assign({}, _, target.props, state),
          targets: target.targets
        })
      }
    }

    // tell animation engine to set the state directly
    getEngine().set(setOperations)

    self.currentState = toStateName
    return self
  }

  transition(...states: string[]) {
    const self = this
    const transitions = self._transitions.reduce(
      (c, n) => {
        c[n.name] = n
        return c
      },
      {} as Dictionary<Transition>)
    const defaultTransition = self.defaultTransition && transitions[self.defaultTransition]

    // find a suitable transition between the states
    const fromStates = self._targets.map(s => s.currentState)
    const stateTweens: IStateTween[] = []

    each(states, toStateName => {
      // capture a tween for each target in this state
      const targetTweens: ITargetTween[] = []

      each(self._targets, (target, index) => {
        const targetTransition = target.props[TRANSITION] && transitions[target.props[TRANSITION]]

        // lookup definition for the next state
        const toState = target.states[toStateName]
        if (!toState) {
          // skip state transition if the target has no definition
          return
        }

        // get duration from cascade of durations
        const duration = target.props[DURATION]
          || (targetTransition && targetTransition.duration)
          || (defaultTransition && defaultTransition.duration)
          || _

        // get easing from cascade of easings
        const easing = target.props[EASING]
          || (targetTransition && targetTransition.easing)
          || (defaultTransition && defaultTransition.easing)
          || _

        // note: might be able to pass without an easing, not sure if good or bad
        if (!easing) {
          throw missingArg(EASING)
        }

        // the engine won't know what to do without a duration, will have to relax
        // this if  we add physics based durations
        if (!duration) {
          throw missingArg(DURATION)
        }

        // lookup last know state of this target
        const fromStateName = fromStates[index]
        const fromState = target.states[fromStateName]

        // record the last known state of this target
        fromStates[index] = toStateName

        // create a new tween with "from"" as 0 and "to"" as 1
        targetTweens.push({
          duration,
          easing,
          keyframes: [
            assign({}, _, fromState),
            assign({}, _, toState)
          ],
          targets: target.targets
        })
      })

      // add completed list of tweens to state tween
      stateTweens.push({
        stateName: toStateName,
        tweens: targetTweens
      })
    })

    const timelineTween: ITimelineTween = {
      id: self.id,
      states: stateTweens
    }

    // tell animation engine to transition
    // need some work on this, possible that this would be called repeatedly
    getEngine().transition(
      timelineTween,
      (stateName: string) => self.currentState = stateName
    )

    return self
  }
}

export interface ISceneOptions {
  name?: string
  targets: ITargetOptions[]
  transitions: ITransitionOptions[]
}

export const scene = (name?: string, options?: ISceneOptions) => {
  // if scene has a name try to locate an existing scene
  let s: Scene = name ? head(_scenes, s2 => s2.name === name) : _

  if (!s) {
    s = new Scene(name)
    _scenes.push(s)
  }
  return s.load(options)
}

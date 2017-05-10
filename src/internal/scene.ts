// import from utils
import { _, INITIAL, NAME, S_TARGET, SELECT, TARGETS } from '../utils/constants'
import { findElements, getAttributes, isElement, resolveElement } from '../utils/elements'
import { guid } from '../utils/guid'
import { head, removeFromList } from '../utils/lists'
import { assign, isString } from '../utils/objects'
import { Dictionary, ITargetOptions } from '../types'
import { elementToTarget } from '../data/targets/load-target'

// import from internal
import { target, Target } from './target'

let _scenes: Scene[] = []

export const sceneElementToTargets = ($scene: Element): ITargetOptions[] => {
  return findElements(S_TARGET, $scene).map(elementToTarget)
}

export const elementToScene = ($scene: Element): ISceneOptions => {
  const sceneOptions = getAttributes($scene, _) as ISceneOptions
  sceneOptions.targets = sceneElementToTargets($scene)
  return sceneOptions
}

export class Scene {
  readonly id: string = guid()
  _targets: Target[] = []

  props: Dictionary<any> = {}
  defaultState: string
  currentState: string
  name: string

  constructor(name: string) {
    this.name = name || this.id
  }

  add(...objects: Target[]): this;
  add(): this {
    const self = this
    const args = arguments
    for (let i = 0, len = args.length; i < len; i++) {
      self._targets.push(args[i])
    }
    return self
  }

  remove(...objects: Target[]): this;
  remove(): this {
    const self = this
    const args = arguments
    for (let i = 0, len = args.length; i < len; i++) {
      removeFromList(self._targets, args[i])
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

    if (json.targets && json.targets.length) {
      self._targets = json.targets.map(s => target(s.select, s))
    }

    if (json.name) {
      self.name = json.name
    }

    self.props = assign({}, [NAME, SELECT, TARGETS], json)
    self.defaultState = INITIAL
    self.currentState = INITIAL
    return self
  }

  set(toStateName: string) {
    const self = this

    for (let i = 0, ilen = self._targets.length; i < ilen; i++) {
      self._targets[i].set(toStateName)
    }

    self.currentState = toStateName
    return self
  }

  transition(states: string): this;
  transition(states: string[]): this;
  transition(states: string | string[]) {
    const self = this
    const targetOptions: ITargetOptions = assign({ inherited: true }, _, self.props)

    for (let i = 0, ilen = self._targets.length; i < ilen; i++) {
      const target = self._targets[i]
      target.transition(states, targetOptions)
    }

    return self
  }
}

export interface ISceneOptions {
  name?: string
  targets: ITargetOptions[]

  [propName: string]: string | ITargetOptions[]
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

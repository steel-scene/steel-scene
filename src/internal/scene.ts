import { _, findKey, map, guid } from '../utils'
import { ISceneOptions } from '../types'
import { addSceneTargets, loadScene, dispatch, getState, transitionSceneState, removeSceneTargets, setSceneState } from '../data'
import { Target } from './target'

export class Scene {
  constructor(public readonly id: string = guid()) { }

  add(...objects: Target[]): this
  add(): this {
    const self = this
    dispatch(addSceneTargets(self.id, map(arguments, a => a.id)))
    return self
  }

  remove(...objects: Target[]): this
  remove(): this {
    const self = this
    dispatch(removeSceneTargets(self.id, map(arguments, a => a.id)))
    return self
  }
  load(options: ISceneOptions | Element | string) {
    const self = this
    dispatch(loadScene(self.id, options))
    return self
  }
  set(toStateName: string) {
    const self = this
    dispatch(setSceneState(self.id, toStateName))
    return self
  }
  transition(states: string): this
  transition(states: string[]): this
  transition(states: string | string[]) {
    const self = this
    dispatch(transitionSceneState(self.id, states))
    return self
  }
}

export const scene = (name?: string, options: ISceneOptions = {}) => {
  // if scene has a name try to locate an existing scene
  let id = _
  if (name) {
    id = findKey(getState().scenes, s2 => s2.name === name)
    options.name = name
  }
  return new Scene(id).load(options)
}

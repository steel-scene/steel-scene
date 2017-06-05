import { _, findKey, guid, listify, map } from '../utils'
import { ISceneOptions } from '../types'
import { addSceneTargets, loadScene, removeSceneTargets, transitionSceneState } from '../actions'
import { dispatch, getState } from './store'
import { Target } from './target'

export class Scene {
  constructor(public readonly id: string = guid()) { }

  addTarget(...objects: Target[]): this
  addTarget(): this {
    const self = this
    dispatch(addSceneTargets(self.id, map(arguments, a => a.id)))
    return self
  }

  removeTarget(...objects: Target[]): this
  removeTarget(): this {
    const self = this
    dispatch(removeSceneTargets(self.id, map(arguments, a => a.id)))
    return self
  }
  load(options: ISceneOptions | Element | string) {
    const self = this
    dispatch(loadScene(self.id, options))
    return self
  }
  set(stateNames: string | string[]) {
    const self = this
    dispatch(transitionSceneState(self.id, listify(stateNames)))
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

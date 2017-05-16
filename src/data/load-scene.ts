import { LOAD_SCENE, LOAD_TARGET } from './actions'
import { ISceneState, ISteelAction, ISceneOptions, ISteelState } from '../types'
import { elementToScene } from '../internal/importer'
import {  assign, guid, isElement, isString, INITIAL, resolveElement, SELECT, NAME, TARGETS } from '../utils'
import { onLoadTarget } from './load-target'

const sceneBlacklist = [NAME, SELECT, TARGETS]

export interface ILoadSceneAction extends ISteelAction {
  id: string
  options: ISceneOptions | string | Element
}

export const onLoadScene = (store: ISteelState, action: ILoadSceneAction) => {
  const options = action.options
  let id = action.id
  if (!options) {
    return store
  }

  const json = isString(options) || isElement(options)
    ? elementToScene(
      resolveElement(options as (string | Element), true)
    )
    : options as ISceneOptions

  const scene: ISceneState = store.scenes[id] || {
    currentState: INITIAL,
    defaultState: INITIAL,
    props: {},
    targets: [],
    name: json.name || id
  }

  if (json.targets && json.targets.length) {
    for (let i = 0, len = json.targets.length; i < len; i++) {
      const targetId = guid()
      const targetOptions = json.targets[i]
      onLoadTarget(store, { id: targetId, type: LOAD_TARGET, options: targetOptions })
      scene.targets.push(targetId)
    }
  }

  if (json.name) {
    self.name = json.name
  }

  scene.props = assign(scene.props, sceneBlacklist, json)
  store.scenes[id] = scene
  return store
}

export const loadScene = (id: string, options: ISceneOptions | string | Element): ILoadSceneAction => {
  return { options, id, type: LOAD_SCENE }
}

import { ISceneState, ISceneOptions, ISteelState, IStoreNotifier } from '../types'
import { elementToScene } from '../internal/importer'
import {  assign, guid, isElement, isString, INITIAL, resolveElement, SELECT, NAME, TARGETS } from '../utils'
import { loadTarget } from './load-target'

const sceneBlacklist = [NAME, SELECT, TARGETS]

export const loadScene = (id: string, options: ISceneOptions | string | Element) => {
  return (store: ISteelState, notifier: IStoreNotifier) => {
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
        store = loadTarget(targetId, targetOptions)(store, notifier)
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
}

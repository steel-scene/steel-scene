import { findElements, resolveElement } from '../utils/elements'
import { _, S_SCENE } from '../utils/constants'
import { elementToScene, ISceneOptions, scene } from './scene'

export const elementToScenes = (el: Element) => findElements(S_SCENE, el).map(elementToScene)

/**
 * Import scenes from JSON
 */
export const importJSON = (scenesOptions: ISceneOptions[]) => {
  scenesOptions.forEach((sceneOptions, i) => scene(_, sceneOptions))
}

/**
 * Import scenes from an existing DOM element
 */
export const importHTML = (options: Element | string) => {
  const el = resolveElement(options, true)
  importJSON(elementToScenes(el))
}

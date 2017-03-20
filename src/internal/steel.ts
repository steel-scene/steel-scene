import { findElements, resolveElement } from '../utils/elements'
import { _, S_SCENE } from '../utils/constants'
import { elementToScene, ISceneOptions, scene } from './scene'

export const elementToScenes = (el: Element) => findElements(S_SCENE, el).map(elementToScene)

/**
 * Import scenes from JSON
 */
export const importJSON = (scenesOptions: ISceneOptions[]) => {
  for (let i = 0, ilen = scenesOptions.length; i < ilen; i++) {
    scene(_, scenesOptions[i])
  }
}

/**
 * Import scenes from an existing DOM element
 */
export const importHTML = (options: Element | string) => {
  importJSON(
    elementToScenes(
      resolveElement(options, true)
    )
  )
}

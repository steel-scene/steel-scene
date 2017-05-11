import { isString } from '../utils/objects'
import { findElements, isElement, resolveElement } from '../utils/elements'
import { _, S_SCENE } from '../utils/constants'
import { scene } from './scene'
import { ISceneOptions } from '../types'
import { elementToScene } from './importer'

export const elementToScenes = (el: Element) => findElements(S_SCENE, el).map(elementToScene)

/**
 * Import scenes from an existing DOM element or JSON
 */
export const load = (options: ISceneOptions[] | Element | string) => {
  const json = isString(options) || isElement(options)
      ? elementToScenes(resolveElement(options as (string | Element), true))
      : options as ISceneOptions[]

  for (let i = 0, ilen = json.length; i < ilen; i++) {
    scene(_, json[i])
  }
}

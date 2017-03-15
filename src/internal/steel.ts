import { findElements, resolveElement } from '../utils/elements';
import { S_SCENE } from '../utils/constants';
import { Dictionary } from '../types';
import { elementToScene, ISceneOptions, Scene, scene } from './scene';

let _scenes: Dictionary<Scene> = {};

export const elementToScenes = (el: Element) => findElements(S_SCENE, el).map(elementToScene);

/**
 * Import scenes from JSON
 */
export const importJSON = (scenesOptions: ISceneOptions[], shouldReset = true) => {

  scenesOptions.forEach((sceneOptions, i) => {
    const sceneInstance = scene(`__scene__${i}`, sceneOptions);
    _scenes[sceneInstance.name()] = sceneInstance;
  });

  if (shouldReset) {
    for (const key in _scenes) {
      _scenes[key].reset();
    }
  }
}

/**
 * Import scenes from an existing DOM element
 */
export const importHTML = (options: Element | string, shouldReset = true) => {
  const el = resolveElement(options, true);
  importJSON(elementToScenes(el), shouldReset);
}

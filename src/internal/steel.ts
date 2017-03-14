import { scene } from './scene';
import { Dictionary } from '../types';

import { findElements, getAttribute, mapProperties, missingArg, nameAttr, resolveElement, sceneSelector } from '../utils';

import { ISceneOptions, Scene, elementToScene } from './index';

let _scenes: Dictionary<Scene> = {};
export const elementToScenes = (el: Element): Dictionary<ISceneOptions> => {
  // find all layer elemenets
  const scenes: Dictionary<ISceneOptions> = {};
  findElements(sceneSelector, el).forEach($scene => {
    // get the bane if the layer
    const sceneName = getAttribute($scene, nameAttr);
    if (!sceneName) {
      throw missingArg(nameAttr);
    }
    // read element to pull in the layer definition
    scenes[sceneName] = elementToScene($scene);
  });
  return scenes;
};

export const exportJSON = (): Dictionary<ISceneOptions> => {
  return mapProperties(_scenes, (key, value) => value.toJSON())
}

/**
 * Import scenes from JSON
 */
export const importJSON = (scenes: Dictionary<ISceneOptions>, shouldReset: boolean = true): void => {
  _scenes = mapProperties(scenes, scene);

  if (shouldReset) {
    for (const key in _scenes) {
      _scenes[key].reset();
    }
  }
}

/**
 * Import scenes from an existing DOM element
 */
export const importHTML = (options: Element | string, shouldReset: boolean = true): void => {
  const el = resolveElement(options, true);
  if (!el) {
    throw 'Could not load from ' + options;
  }

  _scenes = mapProperties(elementToScenes(el), scene);

  if (shouldReset) {
    for (const key in _scenes) {
      _scenes[key].reset();
    }
  }
}

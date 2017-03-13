import { Dictionary } from '../types';

import {
  appendElement, createElement, findElements, getAttribute, mapProperties,
  missingArg, nameAttr, resolveElement, sceneSelector, setAttribute
} from '../utils';

import { ISceneJSON, Scene, elementToScene, sceneToElement } from './index';

let _scenes: Dictionary<Scene> = {};


export const elementToScenes = (el: Element): Dictionary<ISceneJSON> => {
  // find all layer elemenets
  const scenes: Dictionary<ISceneJSON> = {};
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

export const scenesToElement = (scenes: Dictionary<ISceneJSON>): Element => {
  const $container = createElement('div');
  for (const layerName in scenes) {
    const $scene = sceneToElement(scenes[layerName]);
    setAttribute($scene, nameAttr, layerName);
    appendElement($container, $scene);
  }
  return $container;
};

export const exportJSON = (): Dictionary<ISceneJSON> => {
  return mapProperties(_scenes, (key, value) => value.toJSON())
}

export const exportHTML = (): Element => {
  return scenesToElement(exportJSON());
}

/**
 * Sets all scenes to their initial state
 */
export const reset = (): void => {
  const scenes = _scenes;
  for (let sceneName in scenes) {
    scenes[sceneName].reset();
  }
}

/**
 * Import scenes from JSON
 */
export const importJSON = (scenes: Dictionary<ISceneJSON>, shouldReset: boolean = true): void => {
  _scenes = mapProperties(
    scenes,
    (key, value) => new Scene(value)
  );

  if (shouldReset) {
    reset();
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
  importJSON(elementToScenes(el), shouldReset);
}

/**
 * Move directly to a state.  Do not pass GO.  Do not collect $200
 */
export const set = (sceneName: string, toStateName: string): void => {
  _scenes[sceneName].set(toStateName);
}

/**
 * Transition from the current state to new state
 */
export const transition = (sceneName: string, ...states: string[]): void => {
  _scenes[sceneName].transition(states);
}



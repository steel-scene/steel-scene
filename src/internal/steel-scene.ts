import {
  IAnimationEngine,
  ISteelScene,
  IDictionary,
  ISceneJSON
} from '../types';

import {
  elementToScenes,
  scenesToElement,
  Scene
} from '../internal';

import {
  mapProperties,
  resolveElement
} from '../utils';

export class SteelScene implements ISteelScene {
  private _engine: IAnimationEngine;
  private _scenes: IDictionary<Scene> = {};

  public exportHTML = (): Element => {
    const self = this;
    const json = self.exportJSON();
    return scenesToElement(json);
  }

  public exportJSON = (): IDictionary<ISceneJSON> => {
    return mapProperties(this._scenes, (key, value) => value.toJSON())
  }

  /**
   * Import scenes from an existing DOM element
   */
  public importHTML = (options: Element | string, reset: boolean = true): this => {
    const self = this;

    const el = resolveElement(options, true);
    if (!el) {
      throw 'Could not load from ' + options;
    }

    self.importJSON(elementToScenes(el), reset);
    return self;
  }

  /**
   * Import scenes from JSON
   */
  public importJSON = (scenes: IDictionary<ISceneJSON>, reset: boolean = true): this => {
    const self = this;
    for (let sceneName in scenes) {
      self._scenes[sceneName] =  new Scene(self._engine).fromJSON(scenes[sceneName]);
    }
    if (reset) {
      self.reset();
    }
    return self;
  }

  /**
   * Sets all scenes to their initial state
   */
  public reset = (): this => {
    const self = this;
    const scenes = self._scenes;
    for (let sceneName in scenes) {
      scenes[sceneName].reset();
    }
    return self;
  }

  /**
   * Move directly to a state.  Do not pass GO.  Do not collect $200
   */
  public set = (sceneName: string, toStateName: string): this => {
    const self = this;
    // lookup scene and state
    const scene = self._scenes[sceneName];
    scene.set(toStateName);
    return self;
  }

  /**
   * Transition from the current state to this new state
   */
  public transition = (sceneName: string, ...states: string[]): this => {
    const self = this;
    const scene = self._scenes[sceneName];
    scene.transition(...states);
    return self;
  }

  /**
   * Register your favorite animation engine with this command
   */
  public use = (animationEngine: IAnimationEngine): this => {
    const self = this;
    // set new animation engine
    self._engine = animationEngine;
    return self;
  }
}

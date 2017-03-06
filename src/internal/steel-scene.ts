import {
  IAnimationEngine,
  ISteelScene,
  Dictionary,
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
  private _scenes: Dictionary<Scene> = {};

  public exportHTML = (): Element => {
    return scenesToElement(this.exportJSON());
  }

  public exportJSON = (): Dictionary<ISceneJSON> => {
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
  public importJSON = (scenes: Dictionary<ISceneJSON>, reset: boolean = true): this => {
    const self = this;

    self._scenes = mapProperties(
      scenes,
      (key, value) => new Scene(self._engine).fromJSON(value)
    );

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
    self._scenes[sceneName].set(toStateName);
    return self;
  }

  /**
   * Transition from the current state to this new state
   */
  public transition = (sceneName: string, ...states: string[]): this => {
    const self = this;
    self._scenes[sceneName].transition(states);
    return self;
  }

  /**
   * Register your favorite animation engine with this command
   */
  public use = (animationEngine: IAnimationEngine): this => {
    const self = this;
    self._engine = animationEngine;
    return self;
  }
}

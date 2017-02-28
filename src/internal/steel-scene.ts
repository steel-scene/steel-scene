import {
  IAnimationEngine,
  ISteelScene,
  IDictionary,
  IEngineTransition,
  IScene,
  ISceneJSON
} from '../types';

import {
  assign,
  elementToScenes,
  fromScene,
  missingArg,
  resolveElement,
  scenesToElement,
  toScene
} from '../internal';

export class SteelScene implements ISteelScene {
  private _engine: IAnimationEngine;
  private _scenes: IDictionary<IScene> = {};

  public exportHTML = (): Element => {
    const self = this;
    const json = self.exportJSON();
    return scenesToElement(json);
  }

  public exportJSON = (): IDictionary<ISceneJSON> => {
    const self = this;
    const scenes = {};
    for (let sceneName in self._scenes) {
      scenes[sceneName] = fromScene(self._scenes[sceneName]);
    }
    return scenes;
  }

  /**
   * Import scenes from an existing DOM element
   */
  public importHTML = (options: Element, reset: boolean = true): this => {
    const self = this;

    const el = resolveElement(options);
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
      const newScene = toScene(scenes[sceneName]);
      self._scenes[sceneName] = assign(self._scenes[sceneName] || {}, newScene);
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
      self._engine.set(scenes[sceneName].defaultState);
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
    const toState = scene.states[toStateName];

    // tell animation engine to set the state directly
    self._engine.set(toState);
    scene.currentState = toStateName;
    return self;
  }

  /**
   * Transition from the current state to this new state
   */
  public transition = (sceneName: string, ...states: string[]): this => {
    const self = this;
    const scene = self._scenes[sceneName];

    // find a suitable transition between the states
    let fromStateName = scene.currentState;
    const transitions: IEngineTransition[] = [];
    for (let x = 0, xlen = states.length; x < xlen; x++) {
      const toStateName = states[x];
      const fromState = scene.states[fromStateName];
      const toState = scene.states[toStateName];

      // get duration from cascade of durations
      const duration: number | undefined = toState.duration
        || (toState.transition && toState.transition.duration)
        || (scene.defaultTransition && scene.defaultTransition.duration);

      // the engine won't know what to do without a duration
      if (!duration) {
        throw missingArg('duration');
      }

      // get easing from cascade of easings
      const easing: string | undefined = toState.easing
        || (toState.transition && toState.transition.easing)
        || (scene.defaultTransition && scene.defaultTransition.easing);

      // note: might be able to pass without an easing, not sure if good or bad
      if (!easing) {
        throw missingArg('easing');
      }

      // add to the list of transitions
      transitions.push({
        duration,
        easing,
        toState,
        fromState
      });

      fromStateName = toStateName;
    }

    // tell animation engine to transition
    // need some work on this, possible that this would be called repeatedly
    self._engine.transition(transitions, (stateName: string) => {
      scene.currentState = stateName;
    });

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

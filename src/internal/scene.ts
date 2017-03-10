import { Dictionary, ISetOperation, ITimelineTween, IStateTween, ITargetTween } from '../types';

import {
  _, appendElement, assign, createElement, defaultAttr, defaultName,
  mapProperties, missingArg, nameAttr, resolveElement, setAttribute, sceneSelector
} from '../utils';

import {
  IStateJSON, ITargetJSON, ITransitionJSON, getEngine, sceneElementToTransitions, sceneElementToStates,
  State, stateToElement, Transition, transitionToElement
} from './index';

let globalId = 0;
export class Scene {
  private states: Dictionary<State>;
  private transitions: Dictionary<Transition>;

  private defaultTransition: string | undefined;
  private defaultState: string;
  private currentState: string;
  private id: number = ++globalId;

  constructor(json?: ISceneJSON) {
    if (json) {
      this.fromJSON(json);
    }
  }

  public fromJSON(json: ISceneJSON): this {
    const self = this;

    // load transitions into scene
    let defaultTransition: string | undefined;
    const transitions = {};
    for (const transitionName in json.transitions) {
      const transitionJSON = json.transitions[transitionName];
      if (transitionJSON.default) {
        defaultTransition = transitionName;
      }
      transitions[transitionName] = new Transition().fromJSON(transitionJSON);
    }

    // load states into scene
    let defaultState: string | undefined;
    const states = {};
    for (const stateName in json.states) {
      const stateJSON = json.states[stateName];
      if (stateJSON.default) {
        defaultState = stateName;
      }
      states[stateName] = new State().fromJSON(stateJSON);
    }

    // a starting point is required
    if (!defaultState) {
      throw missingArg('default state');
    }

    self.defaultTransition = defaultTransition;
    self.transitions = transitions;
    self.defaultState = defaultState;
    self.currentState = defaultState;
    self.states = states;
    return self;
  }

  public fromHTML(html: Element | string): this {
    return this.fromJSON(
      elementToScene(
        resolveElement(html, true)
      )
    );
  }

  public reset(): this {
    return this.set(this.defaultState);
  }

  public set(toStateName: string): this {
    const self = this;
    const toState = self.states[toStateName];

    // tell animation engine to set the state directly
    getEngine().set(
      toState.targets
        .map((t: ITargetJSON): ISetOperation => ({
          targets: t.ref,
          set: assign({}, ['ref'], toState.props, t)
        }))
    );

    self.currentState = toStateName;
    return self;
  }

  public transition(states: string[]): this {
    const self = this;

    // find a suitable transition between the states
    let fromStateName = self.currentState;
    const stateTransfomer = (toStateName: string): IStateTween => {
      const fromState = self.states[fromStateName];
      const toState = self.states[toStateName];
      const transitions = self.transitions;

      // get duration from cascade of durations
      const duration = toState.duration
        || (!!toState.transition && transitions[toState.transition].duration)
        || (!!self.defaultTransition && transitions[self.defaultTransition].duration)
        || _;

      // the engine won't know what to do without a duration
      if (!duration) {
        throw missingArg('duration');
      }

      // get easing from cascade of easings
      const easing: string | undefined = toState.easing
        || (!!toState.transition && transitions[toState.transition].easing)
        || (!!self.defaultTransition && transitions[self.defaultTransition].easing)
        || _;

      // note: might be able to pass without an easing, not sure if good or bad
      if (!easing) {
        throw missingArg('easing');
      }

      const targets = {};

      // group from props by target
      fromState.targets.forEach(target => {
        let tween = targets[target.ref];
        if (!tween) {
          targets[target.ref] = tween = [];
        }
        tween.push(assign({}, ['ref'], fromState.props, target));
      });

      // group to props by target
      toState.targets.forEach(target => {
        let tween = targets[target.ref];
        if (!tween) {
          targets[target.ref] = tween = [];
        }
        tween.push(assign({}, ['ref'], toState.props, target));
      });

      // convert grouping to array of tween operations
      const tweenOptions: ITargetTween[] = [];

      for (const ref in targets) {
        tweenOptions.push({
          targets: ref,
          keyframes: targets[ref]
        });
      }

      fromStateName = toStateName;
      return {
        tweens: tweenOptions,
        stateName: toStateName,
        duration,
        easing
      };
    };

    const timelineTween: ITimelineTween = {
      id: this.id,
      states: states.map(stateTransfomer)
    };

    // tell animation engine to transition
    // need some work on this, possible that this would be called repeatedly
    getEngine().transition(
      timelineTween,
      (stateName: string) => self.currentState = stateName
    );

    return self;
  }

  public toJSON(): ISceneJSON {
    const self = this;
    return {
      states: mapProperties(self.states, (key, val) => val.toJSON()),
      transitions: mapProperties(self.transitions, (key, val) => val.toJSON())
    }
  }
}

export const sceneToElement = (scene: ISceneJSON): Element => {
  const $scene = createElement(sceneSelector);

  const states = scene.states;
  for (const stateName in states) {
    const $state = stateToElement(states[stateName]);
    setAttribute($state, nameAttr, stateName);
    appendElement($scene, $state);
  }

  const transitions = scene.transitions;
  for (const transitionName in transitions) {
    const transition = transitions[transitionName];
    const $transition = transitionToElement(transition);
    if (transitionName && transitionName !== defaultName) {
      setAttribute($transition, nameAttr, transitionName);
    }
    if (transition.default) {
      setAttribute($transition, defaultAttr, '');
    }
    appendElement($scene, $transition);
  }

  return $scene;
}

export const elementToScene = ($scene: Element): ISceneJSON => {
  return {
    states: sceneElementToStates($scene),
    transitions: sceneElementToTransitions($scene)
  };
}

export interface ISceneJSON {
  states: Dictionary<IStateJSON>;
  transitions: Dictionary<ITransitionJSON>;
}

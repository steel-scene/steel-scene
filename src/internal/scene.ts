import { durationAttr, easingAttr } from '../utils/resources';
import { Dictionary, ITargetTween, ITimelineTween, IStateTween } from '../types';

import {
  _,
  appendElement,
  assign,
  createElement,
  defaultAttr,
  defaultName,
  each,
  isElement,
  isString,
  mapProperties,
  missingArg,
  nameAttr,
  resolveElement,
  sceneSelector,
  setAttribute
} from '../utils';

import {
  ITargetOptions, ITransitionJSON, getEngine, sceneElementToTransitions, sceneElementToTargets,
  Target, targetToElement, Transition, transitionToElement
} from './index';


export const elementToScene = ($scene: Element): ISceneJSON => {
  return {
    targets: sceneElementToTargets($scene),
    transitions: sceneElementToTransitions($scene)
  };
}


let globalId = 0;
export class Scene {
  private targets: Dictionary<Target>;
  private transitions: Dictionary<Transition>;

  private defaultTransition: string | undefined;
  private defaultState: string;
  private currentState: string;
  private id: number = ++globalId;

  constructor(json?: ISceneJSON) {
    if (json) {
      this.load(json);
    }
  }

  public load(options: ISceneJSON | Element | string): this {
    const self = this;

    if (!options) {
      throw missingArg('options');
    }

    const json = isString(options) || isElement(options)
      ? elementToScene(
        resolveElement(options as (string | Element), true)
      )
      : options as ISceneJSON;


    // load transitions into scene
    let defaultTransition: string | undefined;
    const transitions = {};
    for (const transitionName in json.transitions) {
      const transitionJSON = json.transitions[transitionName];
      if (transitionJSON.default) {
        defaultTransition = transitionName;
      }
      transitions[transitionName] = new Transition().load(transitionJSON);
    }

    // load targets into scene
    let defaultState: string | undefined;
    const targets = {};
    for (const name in json.targets) {
      const stateJSON = json.targets[name];
      if (stateJSON.default) {
        defaultState = name;
      }
      targets[name] = new Target().load(stateJSON);
    }

    // a starting point is required
    if (!defaultState) {
      throw missingArg('default state');
    }

    self.defaultTransition = defaultTransition;
    self.transitions = transitions;
    self.defaultState = defaultState;
    self.currentState = defaultState;
    self.targets = targets;
    return self;
  }

  public reset(): this {
    return this.set(this.defaultState);
  }

  public set(toStateName: string): this {
    const self = this;

    const setOperations = [];
    for (const targetName in self.targets) {
      const target = self.targets[targetName];
      const state = target.states[toStateName];

      // skip update operation target doesn't have state
      if (!state) {
        continue;
      }

      const targets = target.targets;
      const props = assign({}, _, target.props, state);

      setOperations.push({ targets, props });
    }

    // tell animation engine to set the state directly
    getEngine().set(setOperations)

    self.currentState = toStateName;
    return self;
  }

  public transition(states: string[]): this {
    const self = this;
    const transitions = self.transitions;

    // find a suitable transition between the states
    const fromStates = mapProperties(self.targets, (key, val) => val.currentState);

    const stateTweens: IStateTween[] = [];

    each(states, toStateName => {
      // capture a tween for each target in this state
      const targetTweens: ITargetTween[] = [];

      for (const targetName in self.targets) {
        const target = self.targets[targetName];

        // lookup definition for the next state
        const toState = target.states[toStateName];
        if (!toState) {
          // skip state transition if the target has no definition
          continue;
        }

        // get duration from cascade of durations
        const duration = target.duration
          || (target.transition && transitions[target.transition].duration)
          || (self.defaultTransition && transitions[self.defaultTransition].duration)
          || _;

        // get easing from cascade of easings
        const easing = target.easing
          || (target.transition && transitions[target.transition].easing)
          || (self.defaultTransition && transitions[self.defaultTransition].easing)
          || _;

        // note: might be able to pass without an easing, not sure if good or bad
        if (!easing) {
          throw missingArg(easingAttr);
        }

        // the engine won't know what to do without a duration, will have to relax
        // this if  we add physics based durations
        if (!duration) {
          throw missingArg(durationAttr);
        }

        // lookup last know state of this target
        const fromStateName = fromStates[targetName];
        const fromState = target.states[fromStateName];

        // record the last known state of this target
        fromStates[targetName] = toStateName;

        // create a new tween with "from"" as 0 and "to"" as 1
        targetTweens.push({
          duration,
          easing,
          targets: target.targets,
          keyframes: [
            assign({}, _, fromState),
            assign({}, _, toState)
          ]
        });
      }

      // add completed list of tweens to state tween
      stateTweens.push({
        stateName: toStateName,
        tweens: targetTweens
      });
    });

    const timelineTween: ITimelineTween = {
      id: self.id,
      states: stateTweens
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
      targets: mapProperties(self.targets, (key, val) => val.toJSON()),
      transitions: mapProperties(self.transitions, (key, val) => val.toJSON())
    }
  }
}

export const sceneToElement = (scene: ISceneJSON): Element => {
  const $scene = createElement(sceneSelector);

  const targets = scene.targets;
  for (const targetName in targets) {
    const $target = targetToElement(targets[targetName]);
    setAttribute($target, nameAttr, targetName);
    appendElement($scene, $target);
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

export interface ISceneJSON {
  targets: Dictionary<ITargetOptions>;
  transitions: Dictionary<ITransitionJSON>;
}

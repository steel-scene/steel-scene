import { guid } from '../utils/guid';
import { durationAttr, easingAttr } from '../utils/resources';
import { Dictionary, ITargetTween, ITimelineTween, IStateTween } from '../types';

import {
  _,
  assign,
  each,
  isElement,
  isString,
  mapProperties,
  missingArg,
  resolveElement
} from '../utils';

import {
  ITargetOptions, ITransitionJSON, getEngine, sceneElementToTransitions, sceneElementToTargets, Target, target, Transition
} from './index';


export const elementToScene = ($scene: Element): ISceneOptions => {
  return {
    targets: sceneElementToTargets($scene),
    transitions: sceneElementToTransitions($scene)
  };
}

export class Scene {
  public readonly id: string = guid();

  private _targets: Dictionary<Target>;
  private _transitions: Dictionary<Transition>;
  private _name: string | undefined;

  private defaultTransition: string | undefined;
  private defaultState: string;
  private currentState: string;


  public name(): string | undefined;
  public name(name: string | undefined): this;
  public name(name?: string): string | undefined | this {
    const self = this;
    if (!arguments.length) {
      return self._name;
    }
    self._name = name;
    return self;
  }

  public load(options: ISceneOptions | Element | string | undefined): this {
    const self = this;
    if (!options) {
      return self;
    }

    const json = isString(options) || isElement(options)
      ? elementToScene(
        resolveElement(options as (string | Element), true)
      )
      : options as ISceneOptions;


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
      targets[name] = target(_, stateJSON);
    }

    // a starting point is required
    if (!defaultState) {
      throw missingArg('default state');
    }

    self.defaultTransition = defaultTransition;
    self._transitions = transitions;
    self.defaultState = defaultState;
    self.currentState = defaultState;
    self._targets = targets;
    return self;
  }

  public reset(): this {
    return this.set(this.defaultState);
  }

  public set(toStateName: string): this {
    const self = this;

    const setOperations = [];
    for (const targetName in self._targets) {
      const target = self._targets[targetName];
      const state = target.states[toStateName];

      // skip update operation target doesn't have state
      if (!state) {
        continue;
      }

      const targets = target.targets();
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
    const transitions = self._transitions;

    // find a suitable transition between the states
    const fromStates = mapProperties(self._targets, (key, val) => val.currentState);

    const stateTweens: IStateTween[] = [];

    each(states, toStateName => {
      // capture a tween for each target in this state
      const targetTweens: ITargetTween[] = [];

      for (const targetName in self._targets) {
        const target = self._targets[targetName];

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
          targets: target.targets(),
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

  public toJSON(): ISceneOptions {
    const self = this;
    return {
      targets: mapProperties(self._targets, (key, val) => val.toJSON()),
      transitions: mapProperties(self._transitions, (key, val) => val.toJSON())
    }
  }
}

export interface ISceneOptions {
  targets: Dictionary<ITargetOptions>;
  transitions: Dictionary<ITransitionJSON>;
}

export const scene = (name?: string, json?: ISceneOptions) => {
  return new Scene().name(name).load(json);
};

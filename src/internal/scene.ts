import { findElements, getAttributes, isElement, resolveElement } from '../utils/elements';
import { guid } from '../utils/guid';
import { each } from '../utils/lists';
import { assign, isString, mapProperties } from '../utils/objects';
import { _, DURATION, EASING, NAME, S_TARGET, S_TRANSITION } from '../utils/constants';
import {  missingArg } from '../utils/errors';
import { Dictionary, ISetOperation, IStateTween, ITargetTween, ITimelineTween } from '../types';
import { getEngine } from './engine';
import { elementToTarget, ITargetOptions, target, Target } from './target';
import { elementToTransition, ITransitionOptions, transition, Transition } from './transition';

const sceneAttributeWhitelist = [NAME];

export const sceneElementToTargets = ($scene: Element): ITargetOptions[] => {
  return findElements(S_TARGET, $scene).map($target => elementToTarget($target));
}

export const sceneElementToTransitions = ($scene: Element): ITransitionOptions[] => {
  return findElements(S_TRANSITION, $scene).map($transition => elementToTransition($transition));
}

export const elementToScene = ($scene: Element): ISceneOptions => {
  const sceneOptions = getAttributes($scene, sceneAttributeWhitelist) as ISceneOptions;
  sceneOptions.targets = sceneElementToTargets($scene);
  sceneOptions.transitions = sceneElementToTransitions($scene)
  return sceneOptions;
}

export class Scene {
  readonly id: string = guid();

  _targets: Dictionary<Target>;
  _transitions: Dictionary<Transition>;
  _name: string;

  defaultTransition: string;
  defaultState: string;
  currentState: string;

  /** returns the name of the scene */
  name(): string;
  /** sets the name of the scene, returns this */
  name(name: string): this;

  name(name?: string) {
    const self = this;
    if (!arguments.length) {
      return self._name;
    }
    self._name = name!;
    return self;
  }

  load(options: ISceneOptions | Element | string) {
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
    let defaultTransition: string;
    const transitions = {};
    for (const transitionJSON of json.transitions) {
      const transitionName = transitionJSON.name;
      if (!transitionName) {
        continue;
      }
      if (transitionJSON.default) {
        defaultTransition = transitionName;
      }
      transitions[transitionName] = transition(transitionName, transitionJSON);
    }

    // load targets into scene
    let defaultState: string;
    const targets = {};
    for (const targetJSON of json.targets) {
      const name = targetJSON.name;
      if (targetJSON.default) {
        defaultState = name;
      }
      targets[name] = target(_, targetJSON);
    }

    // a starting point is required
    if (!defaultState) {
      throw missingArg('default state');
    }

    self._transitions = transitions;
    self._targets = targets;

    self.defaultTransition = defaultTransition;
    self.defaultState = defaultState;
    self.currentState = defaultState;
    return self;
  }

  reset() {
    return this.set(this.defaultState);
  }

  set(toStateName: string) {
    const self = this;

    const setOperations: ISetOperation[] = [];
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

  transition(states: string[]) {
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
          throw missingArg(EASING);
        }

        // the engine won't know what to do without a duration, will have to relax
        // this if  we add physics based durations
        if (!duration) {
          throw missingArg(DURATION);
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
          keyframes: [
            assign({}, _, fromState),
            assign({}, _, toState)
          ],
          targets: target.targets()
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
}

export interface ISceneOptions {
  name?: string;
  targets: ITargetOptions[];
  transitions: ITransitionOptions[];
}

export const scene = (name?: string, json?: ISceneOptions) => {
  return new Scene().name(name || '').load(json);
};

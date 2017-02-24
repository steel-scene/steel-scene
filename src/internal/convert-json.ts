import { IScene, ISceneJSON, IState, IStateJSON, ITransition, ITransitionJSON } from '../types';
import { missingArg, nil } from '../internal';

export function fromScene(scene: IScene): ISceneJSON {
  const transitions = {};
  for (let transitionName in scene.transitions) {
    const transition = scene.transitions[transitionName];
    const transitionJSON = fromTransition(transition, scene.defaultTransition === transition);
    transitions[transitionName] = transitionJSON;
  }

  const states = {};
  for (let stateName in scene.states) {
    const state = scene.states[stateName];
    const stateJSON = fromState(state, scene.defaultTransition === state);
    states[stateName] = stateJSON;
  }

  return {
    states,
    transitions
  };
}

export function fromState(state: IState, isDefault: boolean): IStateJSON {
  return {
    default: isDefault,
    duration: state.duration,
    easing: state.easing,
    targets: state.targets,
    transition: nil
  };
}

export function fromTransition(transition: ITransition, isDefault: boolean): ITransitionJSON  {
  return {
    default: isDefault,
    duration: transition.duration,
    easing: transition.easing
  };
}

export function toScene(sceneJSON: ISceneJSON): IScene {
  let defaultTransition: ITransition | undefined;
  const transitions = {};
  for (let transitionName in sceneJSON.transitions) {
    const transitionJSON = sceneJSON.transitions[transitionName];
    const transition = toTransition(transitionName, transitionJSON);
    if (transitionJSON.default) {
      defaultTransition = transition;
    }
    transitions[transitionName] = transition;
  }

  let defaultState: IState | undefined;
  const states = {};
  for (let stateName in sceneJSON.states) {
    const stateJSON = sceneJSON.states[stateName];
    const state = toState(stateName, stateJSON);
    const transition = stateJSON.transition;
    if (transition) {
      state.transition = transitions[transition] || nil;
    }
    if (stateJSON.default) {
      defaultState = state;
    }
    states[stateName] = state;
  }

  if (!defaultState) {
    throw missingArg('default state');
  }

  return {
    defaultState,
    defaultTransition,
    currentState: defaultState.name,
    states,
    transitions
  };
}

export function toState(stateName: string, stateJSON: IStateJSON): IState {
  return {
    duration: stateJSON.duration,
    easing: stateJSON.easing,
    name: stateName,
    targets: stateJSON.targets,
    transition: nil
  };
}

export function toTransition(transitionName: string, transitionJSON: ITransitionJSON): ITransition {
  return {
    duration: transitionJSON.duration,
    name: transitionName,
    easing: transitionJSON.easing
  };
}

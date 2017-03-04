import {
  IDictionary,
  ISceneJSON,
  IStateJSON,
  ITargetJSON,
  ITransitionJSON
} from '../types';

import {
  attr,
  convertToFloat,
  missingArg,
  nil,
  selectAll
} from '../internal';

const sceneSelector = 's-scene';
const stateSelector = 's-state';
const transitionSelector = 's-transition';
const targetSelector = 's-target';
const nameAttr = 'name';
const refAttr = 'ref';
const durationAttr = 'duration';
const easingAttr = 'easing';
const defaultAttr = 'default';
const defaultName = '_';

export function scenesToElement(scenes: IDictionary<ISceneJSON>): Element {
  const $container = document.createElement('div');
  for (const layerName in scenes) {
    const $scene = sceneToElement(layerName, scenes[layerName]);
    $container.appendChild($scene);
  }
  return $container;
}

export function sceneToElement(sceneName: string, scene: ISceneJSON): Element {
  const $scene = document.createElement(sceneSelector);
  $scene.setAttribute(nameAttr, sceneName);

  const states = scene.states;
  for (let stateName in states) {
    const state = states[stateName];
    const $state = stateToElement(stateName, state);
    $scene.appendChild($state);
  }

  const transitions = scene.transitions;
  for (let transitionName in scene.transitions) {
    const transition = transitions[transitionName];
    const $transition = transitionToElement(transition);
    if (transitionName && transitionName !== defaultName) {
      $transition.setAttribute(nameAttr, transitionName);
    }
    if (transition.default) {
      $transition.setAttribute(defaultAttr, '');
    }
    $scene.appendChild($transition);
  }

  return $scene;
}

export function transitionToElement(transition: ITransitionJSON): Element {
  const $transition = document.createElement(transitionSelector);
  if (transition.duration) {
    $transition.setAttribute(durationAttr, transition.duration.toString());
  }
  if (transition.easing) {
    $transition.setAttribute(easingAttr, transition.easing);
  }
  if (transition.default) {
    $transition.setAttribute(defaultAttr, '');
  }
  return $transition;
}

export function stateToElement(stateName: string, state: IStateJSON): Element {
  const $state = document.createElement(stateSelector);

  if (state.default) {
    $state.setAttribute(defaultAttr, '');
  }
  if (state.duration) {
    $state.setAttribute(durationAttr, state.duration.toString());
  }
  if (state.easing) {
    $state.setAttribute(easingAttr, state.easing);
  }
  if (state.transition) {
    $state.setAttribute(easingAttr, state.transition);
  }

  const targets = state.targets;
  for (let i = 0, len = targets.length; i < len; i++) {
    $state.appendChild(targetToElement(targets[i]));
  }

  return $state;
}

export function targetToElement(target: ITargetJSON): Element {
  const $target = document.createElement(targetSelector);
  for (let propName in target) {
    const val = target[propName];
    if (val === nil) {
      continue;
    }
    $target.setAttribute(propName, val.toString());
  }
  return $target;
}

export function elementToScenes(el: Element): IDictionary<ISceneJSON> {
  // find all layer elemenets
  const $scenes = selectAll(el, sceneSelector);

  // assemble a JSON object for each layer and return as a dictionary
  const scenes: IDictionary<ISceneJSON> = {};
  for (let i = 0, len = $scenes.length; i < len; i++) {
    const $scene = $scenes[i];

    // get the bane if the layer
    const sceneName = attr($scene, nameAttr);
    if (!sceneName) {
      throw missingArg(nameAttr);
    }

    // read element to pull in the layer definition
    scenes[sceneName] = elementToScene($scene);
  }
  return scenes;
}

export function elementToScene($scene: Element): ISceneJSON {
  return {
    states: sceneElementToStates($scene),
    transitions: sceneElementToTransitions($scene)
  };
}

function sceneElementToStates($scene: Element): IDictionary<IStateJSON> {
  // find all "state" elements
  const states: IDictionary<IStateJSON> = {};

  // assemble all states (nodes)... each ref refers to an element and its
  // properties instruct the animation engine what propertie to set
  const $states = selectAll($scene, stateSelector);
  for (let i = 0, len = $states.length; i < len; i++) {
    const $state = $states[i];

    // read element to pull in state definiton
    const state = elementToState($state);
    const stateName = attr($state, nameAttr) || (state.default ? defaultName : nil);

    // skip if no name present and not marked default
    if (!stateName) {
      continue;
    }

    states[stateName] = state;
  }

  return states;
}

function sceneElementToTransitions($scene: Element): IDictionary<ITransitionJSON> {
  // assemble all transitions (the edges between nodes)
  const transitions: IDictionary<ITransitionJSON> = {};

  // find all "transition" elements
  const $transitions = selectAll($scene, transitionSelector);
  for (let i = 0, len = $transitions.length; i < len; i++) {
    // assemble transitions and add to the list
    const $transition = $transitions[i];
    const transition = elementToTransition($transition);
    const name = attr($transition, nameAttr) || (transition.default ? defaultName : nil);

    // skip if no name present and not marked default
    if (!name) {
      continue;
    }

    // add to list, merge if duplicate
    transitions[name] = transition;
  }

  return transitions;
}


export function elementToState($state: Element): IStateJSON {

  // read all "target" elements
  const $targets = selectAll($state, targetSelector);
  const targets: ITargetJSON[] = [];
  for (let i = 0, len = $targets.length; i < len; i++) {
    // assemble target elements and properties and to the list
    const target = elementToTarget($targets[i]);
    targets.push(target);
  }

  const props = {} as IStateJSON;
  const attributes = $state.attributes;
  for (let i = 0, len = attributes.length; i < len; i++) {
    // each attribute pair is a property and its value in the animation
    const att = attributes[i];
    const name = att.name;
    if (name === nameAttr) {
      continue;
    }
    if (name === durationAttr) {
      props.duration = convertToFloat(attr($state, durationAttr));
    } else if (name === defaultAttr) {
      props.default = $state.hasAttribute(defaultAttr);
    } else {
      props[name] = att.value;
    }
  }

  props.targets = targets;

  return props;
};

export function elementToTarget($target: Element): ITargetJSON {
  const target = {} as ITargetJSON;

  // read all attribute pairs into a regular dictionaryh
  const attributes = $target.attributes;
  for (let i = 0, len = attributes.length; i < len; i++) {
    // each attribute pair is a property and its value in the animation
    const att = attributes[i];
    target[att.name] = att.value;
  }

  // a referring element is required
  if (!target.ref) {
    throw missingArg(refAttr);
  }

  return target;
}

export function elementToTransition($transition: Element): ITransitionJSON {
  const defaultVal = $transition.hasAttribute(defaultAttr);
  const duration = convertToFloat(attr($transition, durationAttr));

  // grab easing definition (the animation engine will interpret this, so no parsing possible)
  const easing = attr($transition, easingAttr) || nil;

  // return transition
  return {
    default: defaultVal,
    duration,
    easing
  };
}

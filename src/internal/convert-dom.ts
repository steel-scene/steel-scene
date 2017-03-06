import {
  Dictionary,
  ISceneJSON,
  IStateJSON,
  ITargetJSON,
  ITransitionJSON
} from '../types';

import {
  getAttribute,
  convertToFloat,
  missingArg,
  _,
  findElements,
  createElement,
  setAttribute,
  appendElement,
  copyArray
} from '../utils';

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

export function scenesToElement(scenes: Dictionary<ISceneJSON>): Element {
  const $container = createElement('div');
  for (const layerName in scenes) {
    const $scene = sceneToElement(scenes[layerName]);
    setAttribute($scene, nameAttr, layerName);
    appendElement($container, $scene);
  }
  return $container;
}

export function sceneToElement(scene: ISceneJSON): Element {
  const $scene = createElement(sceneSelector);

  const states = scene.states;
  for (let stateName in states) {
    const $state = stateToElement(states[stateName]);
    setAttribute($state, nameAttr, stateName);
    appendElement($scene, $state);
  }

  const transitions = scene.transitions;
  for (let transitionName in scene.transitions) {
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

export function isElementDefault(element: Element): boolean {
  return element.hasAttribute(defaultAttr);
}

export function transitionToElement(transition: ITransitionJSON): Element {
  const $transition = createElement(transitionSelector);
  if (transition.duration) {
    setAttribute($transition, durationAttr, transition.duration.toString());
  }
  if (transition.easing) {
    setAttribute($transition, easingAttr, transition.easing);
  }
  if (transition.default) {
    setAttribute($transition, defaultAttr, '');
  }
  return $transition;
}

export function stateToElement(state: IStateJSON): Element {
  const $state = createElement(stateSelector);

  if (state.default) {
    setAttribute($state, defaultAttr, '');
  }
  if (state.duration) {
    setAttribute($state, durationAttr, state.duration.toString());
  }
  if (state.easing) {
    setAttribute($state, easingAttr, state.easing);
  }
  if (state.transition) {
    setAttribute($state, easingAttr, state.transition);
  }

  state.targets.forEach(t => appendElement($state, targetToElement(t)))
  return $state;
}

export function targetToElement(target: ITargetJSON): Element {
  const $target = createElement(targetSelector);
  for (let propName in target) {
    const val = target[propName];
    if (val === _) {
      continue;
    }
    setAttribute($target, propName, val.toString());
  }
  return $target;
}

export function elementToScenes(el: Element): Dictionary<ISceneJSON> {
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
}

export function elementToScene($scene: Element): ISceneJSON {
  return {
    states: sceneElementToStates($scene),
    transitions: sceneElementToTransitions($scene)
  };
}

function sceneElementToStates($scene: Element): Dictionary<IStateJSON> {
  // find all "state" elements
  const states: Dictionary<IStateJSON> = {};

  // assemble all states (nodes)... each ref refers to an element and its
  // properties instruct the animation engine what propertie to set
  findElements(stateSelector, $scene).forEach($state => {
    // read element to pull in state definiton
    const state = elementToState($state);
    const stateName = getAttribute($state, nameAttr) || (state.default ? defaultName : _);

    // skip if no name present and not marked default
    if (!stateName) {
      return;
    }

    states[stateName] = state;
  });

  return states;
}

function sceneElementToTransitions($scene: Element): Dictionary<ITransitionJSON> {
  // assemble all transitions (the edges between nodes)
  const transitions: Dictionary<ITransitionJSON> = {};

  // find all "transition" elements
  findElements(transitionSelector, $scene).forEach($transition => {
    const transition = elementToTransition($transition as Element);
    const name = getAttribute($transition as Element, nameAttr) || (transition.default ? defaultName : _);

    // skip if no name present and not marked default
    if (!name) {
      return;
    }

    // add to list, merge if duplicate
    transitions[name] = transition;
  });

  return transitions;
}

export function elementToState($state: Element): IStateJSON {

  // read all "target" elements
  // assemble target elements and properties and to the list
  const props: IStateJSON = {
    targets: findElements(targetSelector, $state).map(elementToTarget)
  };

  copyArray($state.attributes)
    .forEach(att => {
      const name = att.name;
      if (name === nameAttr) {
        // do nothing
      } else if (name === durationAttr) {
        props.duration = convertToFloat(getAttribute($state, durationAttr));
      } else if (name === defaultAttr) {
        props.default = true;
      } else {
        props[name] = att.value;
      }
    });

  return props;
};

export function elementToTarget($target: Node): ITargetJSON {
  const target = {} as ITargetJSON;

  // read all attribute pairs into a regular dictionary
  copyArray($target.attributes).forEach(att => {
    target[att.name] = att.value;
  });

  // a referring element is required
  if (!target.ref) {
    throw missingArg(refAttr);
  }

  return target;
}

export function elementToTransition($transition: Element): ITransitionJSON {
  return {
    default: $transition.hasAttribute(defaultAttr),
    duration: convertToFloat(getAttribute($transition, durationAttr)),
    easing: getAttribute($transition, easingAttr) || _
  };
}

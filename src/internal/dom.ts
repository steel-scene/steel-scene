import { ICurve, IDictionary, ILayer, ITarget } from '../types';
import { attr, selectAll, missingArg, nil } from '../internal';

const layerSelector = 'layer';
const stateSelector = 'state';
const curveSelector = 'curve';
const targetSelector = 'target';
const nameAttr = 'name';
const refAttr = 'ref';
const stateAttr = 'state';
const state1Attr = 'state-1';
const state2Attr = 'state-2';
const durationAttr = 'duration';
const easingAttr = 'easing';
const transitionDurationAttr = 'transition-duration';
const transitionEasingAttr = 'transition-easing';

export function layersToElement(layers: IDictionary<ILayer>): Element {
  const $container = document.createElement('div');
  for (const layerName in layers) {
    $container.appendChild(layerToElement(layerName, layers[layerName]));
  }
  return $container;
}

export function layerToElement(layerName: string, layer: ILayer): Element {
  const $layer = document.createElement(layerSelector);
  $layer.setAttribute(nameAttr, layerName);
  $layer.setAttribute(stateAttr, layer.state);

  if (layer.transitionDuration) {
    $layer.setAttribute(transitionDurationAttr, layer.transitionDuration.toString());
  }
  if (layer.transitionEasing) {
    $layer.setAttribute(transitionEasingAttr, layer.transitionEasing);
  }

  const states = layer.states;
  for (let stateName in states) {
    $layer.appendChild(stateToElement(stateName, states[stateName]));
  }

  const curves = layer.curves;
  for (let i = 0, len = curves.length; i < len; i++) {
    $layer.appendChild(curveToElement(curves[i]));
  }

  return $layer;
}

export function curveToElement(curve: ICurve): Element {
  const $curve = document.createElement(curveSelector);
  if (curve.duration) {
    $curve.setAttribute(durationAttr, curve.duration.toString());
  }
  if (curve.easing) {
    $curve.setAttribute(easingAttr, curve.easing);
  }
  $curve.setAttribute(state1Attr, curve.state1);
  $curve.setAttribute(state2Attr, curve.state2);
  return $curve;
}

export function stateToElement(stateName: string, targets: ITarget[]): Element {
  const $state = document.createElement(stateSelector);
  for (let i = 0, len = targets.length; i < len; i++) {
    const target = targets[i];
    const $target = document.createElement(targetSelector);
    for (let propName in target) {
      $target.setAttribute(propName, target[propName]);
    }
    $state.appendChild($target);
  }
  return $state;
}

export function elementToLayers(el: Element): IDictionary<ILayer> {
  // find all layer elemenets
  const $layers = el.querySelectorAll(layerSelector);

  // assemble a JSON object for each layer and return as a dictionary
  const layers: IDictionary<ILayer> = {};
  for (let i = 0, len = $layers.length; i < len; i++) {
    const $layer = $layers[i];

    // get the bane if the layer
    const layerName = attr($layer, nameAttr);
    if (!layerName) {
      throw missingArg(nameAttr);
    }

    // read element to pull in the layer definition
    layers[layerName] = elementToLayer($layer);
  }
  return layers;
}

export function elementToLayer($layer: Element): ILayer {
  // find all "state" elements
  const states: IDictionary<ITarget[]> = {};

  // assemble all states (nodes)... each ref refers to an element and its
  // properties instruct the animation engine what propertie to set
  const $states = selectAll($layer, stateSelector);
  for (let i = 0, len = $states.length; i < len; i++) {
    const $state = $states[i];

    // find required "name" field
    const stateName = attr($state, nameAttr);
    if (!stateName) {
      throw missingArg(nameAttr);
    }

    // read element to pull in state definiton
    states[stateName] = elementToState($state);
  }

  // assemble all curves (the edges between nodes)
  const curves: ICurve[] = [];

  // find all "curve" elements
  const $curves = selectAll($layer, curveSelector);
  for (let i = 0, len = $curves.length; i < len; i++) {
    // assemble curves and add to the list
    curves.push(elementToCurve($curves[i]));
  }

  // get the required "state" that sets the initial state of the layer
  const state = attr($layer, stateAttr);
  if (!state) {
      throw missingArg(stateAttr);
  }

  const transitionEasing = attr($layer, transitionEasingAttr);
  const transitionDurationStr = attr($layer, transitionDurationAttr) || nil;
  const transitionDuration = transitionDurationStr ? parseFloat(transitionDurationStr) : nil;

  // return layer
  return {
    curves,
    state,
    states,
    transitionDuration,
    transitionEasing
  };
}

export function elementToState($state: Element): ITarget[] {
  const targets: ITarget[] = [];

  // read all "target" elements
  const $targets = selectAll($state, targetSelector);
  for (let i = 0, len = $targets.length; i < len; i++) {
    // assemble target elements and properties and to the list
    targets.push(elementToTarget($targets[i]));
  }

  return targets;
};

export function elementToTarget($target: Element): ITarget {
  const target = {} as ITarget;

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

export function elementToCurve($curve: Element): ICurve {
  // starting node to which this edge connects
  const state1 = attr($curve, state1Attr);
  if (!state1) {
      throw missingArg(state1Attr);
  }

  // ending node to which this edge connects
  const state2 = attr($curve, state2Attr);
  if (!state2) {
    throw missingArg(state2Attr);
  }

  // parse duration to decimal if present
  const durationStr = attr($curve, durationAttr);
  const duration = durationStr ? parseFloat(durationStr) : undefined;

  // grab easing definition (the animation engine will interpret this, so no parsing possible)
  const easing = attr($curve, easingAttr) || undefined;

  // return curve
  return {
    state1,
    state2,
    duration,
    easing
  };
}

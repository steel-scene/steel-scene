import { Dictionary, ICurve, ILayer, ITarget } from '../types';
import { attr, selectAll } from '../internal';

const layerSelector = 'layer';
const stateSelector = 'state';
const curveSelector = 'curve';
const targetSelector = 'target';
const nameAttr = 'name';
const stateAttr = 'state';
const state1Attr = 'state-1';
const state2Attr = 'state-2';

export function elementToLayers(el: Element): Dictionary<ILayer> {
  // find all layer elemenets
  const $layers = el.querySelectorAll(layerSelector);

  // assemble a JSON object for each layer and return as a dictionary
  const layers: Dictionary<ILayer> = {};
  for (let i = 0, len = $layers.length; i < len; i++) {
    const $layer = $layers[i];

    // get the bane if the layer    
    const layerName = attr($layer, nameAttr);
    if (!layerName) {
      throw '<layer> is missing "name"';
    }
    
    // read element to pull in the layer definition
    layers[layerName] = elementToLayer($layer);
  }
  return layers;
}

export function elementToLayer($layer: Element): ILayer {
  // get the required "state" that sets the initial state of the layer
  const layerState = attr($layer, stateAttr);
  if (!layerState) {
    throw '<layer> is missing "state"';
  }

  // find all "state" elements
  const states: Dictionary<ITarget[]> = {};

  // assemble all states (nodes)... each ref refers to an element and its
  // properties instruct the animation engine what propertie to set
  const $states = selectAll($layer, stateSelector);
  for (let i = 0, len = $states.length; i < len; i++) {
    const $state = $states[i];

    // find required "name" field
    const stateName = attr($state, nameAttr);
    if (!stateName) {
      throw '<state> is missing "name"';
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

  // return layer
  return {
    state: layerState,
    states: states,
    curves: curves
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
    throw '<target> is missing "ref"';
  }

  return target;
}

export function elementToCurve($curve: Element): ICurve {
  // starting node to which this edge connects
  const state1 = attr($curve, state1Attr);
  if (!state1) {
    throw '<curve> is missing "state-1"';
  }

  // ending node to which this edge connects
  const state2 = attr($curve, state2Attr);
  if (!state2) {
    throw '<curve> is missing "state-2"';
  }

  // parse duration to decimal if present
  const durationStr = attr($curve, 'duration');
  const duration = durationStr ? parseFloat(durationStr) : undefined;

  // grab easing definition (the animation engine will interpret this, so no parsing possible)
  const easing = attr($curve, 'easing') || undefined;

  // return curve
  return {
    state1,
    state2,
    duration,
    easing
  };
}

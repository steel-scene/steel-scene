import { ICurve, IDictionary, ILayer, ITarget } from '../types';

export function layersToElement(layers: IDictionary<ILayer>): Element {
  const $container = document.createElement('div');
  for (const layerName in layers) {
    $container.appendChild(layerToElement(layerName, layers[layerName]));
  }
  return $container;
}

export function layerToElement(layerName: string, layer: ILayer): Element {
  const $layer = document.createElement('layer');
  $layer.setAttribute('name', layerName);
  $layer.setAttribute('state', layer.state);

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
  const $curve = document.createElement('curve');
  if (curve.duration) {
    $curve.setAttribute('duration', curve.duration.toString());
  }
  if (curve.easing) {
    $curve.setAttribute('duration', curve.easing);
  }
  $curve.setAttribute('state-1', curve.state1);
  $curve.setAttribute('state-2', curve.state2);
  return $curve;
}

export function stateToElement(stateName: string, targets: ITarget[]): Element {
  const $state = document.createElement('state');
  for (let i = 0, len = targets.length; i < len; i++) {
    const target = targets[i];
    const $target = document.createElement('target');
    for (let propName in target) {
      $target.setAttribute(propName, target[propName]);
    }
    $state.appendChild($target);
  }
  return $state;
}

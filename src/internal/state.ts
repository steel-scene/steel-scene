import { Dictionary } from '../types';
import { _, createElement, setAttribute, stateSelector } from '../utils';

export const stateToElement = (state: Dictionary<any>): Element => {
  const $target = createElement(stateSelector);
  for (let propName in state) {
    const val = state[propName];
    if (val === _) {
      continue;
    }
    setAttribute($target, propName, val.toString());
  }
  return $target;
}


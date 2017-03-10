import { _, copyArray, createElement, missingArg, refAttr, setAttribute, targetSelector } from '../utils';

export const elementToTarget = ($target: Node): ITargetJSON => {
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

export const targetToElement = (target: ITargetJSON): Element => {
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

export interface ITargetJSON {
  ref: string;
  [name: string]: string | number;
}

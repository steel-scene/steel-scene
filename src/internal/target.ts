import { findElements, getAttributes, isElement, resolveElement } from '../utils/elements';
import { guid } from '../utils/guid';
import { assign, isString } from '../utils/objects';
import { _, S_STATE } from '../utils/constants';
import { Dictionary } from '../types';

export const elementToTarget = ($target: Element): ITargetOptions => {
  const states: Dictionary<any> = {};
  findElements(S_STATE, $target).forEach(e => {
    const attributes = getAttributes(e, _);
    // tslint:disable-next-line:no-string-literal
    states[attributes['name']] = attributes;
  });

  // read all "state" elements
  // assemble state elements and properties and to the list
  const props = getAttributes($target, _) as ITargetOptions;
  props.states = states;
  return props;
};


export class Target {
  readonly id: string = guid();

  duration: number;
  transition: string;
  easing: string;
  currentState: string;

  _targets: any[];
  props: Dictionary<any>;
  states: Dictionary<Dictionary<any>>;

  /** returns the targets */
  targets(): any[];
  /** sets the targets, returns this */
  targets(target: string | Element | {}): this;

  targets(target?: string | Element | {}) {
    const self = this;
    if (!arguments.length) {
      return self._targets;
    }

    if (isString(target)) {
      target = resolveElement(target as string, true)
    }

    self._targets = [ target ];
    return self;
  }

  /** loads from a selector, element, htmlString, or json options, returns this */
  load(options?: ITargetOptions | string | Element): this {
    const self = this;
    // skip if nothing was passed in
    if (!options) {
      return self;
    }

    if (isString(options) || isElement(options)) {
      const element = resolveElement(options as (string | Element), true);
      options = elementToTarget(element);
    }

    self.props = assign({}, _, options);
    return self;
  }
}


export interface ITargetOptions {
  default?: boolean;
  duration?: number;
  easing?: string;
  transition?: string;
  states: Dictionary<Dictionary<any>>;
  name: string;
  [name: string]: boolean | number | string | Dictionary<any>;
}

export function target(animatable?: string | Element | {}, options?: ITargetOptions): Target {
  return new Target().targets(animatable!).load(options as ITargetOptions);
}

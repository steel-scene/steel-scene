import { Dictionary } from '../types';

import {
  _,
  appendElement,
  assign,
  convertToFloat,
  createElement,
  defaultAttr,
  durationAttr,
  each,
  easingAttr,
  findElements,
  getAttribute,
  getAttributes,
  isElement,
  isString,
  missingArg,
  nameAttr,
  refAttr,
  resolveElement,
  setAttribute,
  setAttributes,
  stateSelector,
  targetSelector,
  transitionAttr
} from '../utils';

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



export const elementToTarget = ($target: Element): ITargetOptions => {

  const states: Dictionary<any> = {};
  findElements(stateSelector, $target).forEach(e => {
    const attributes = getAttributes(e, _);
    states[attributes['name']] = attributes;
  });


  // read all "state" elements
  // assemble state elements and properties and to the list
  const props = { states } as ITargetOptions;

  each($target.attributes, att => {
    const name = att.name;
    if (name === nameAttr) {
      // do nothing
    } else if (name === durationAttr) {
      props.duration = convertToFloat(getAttribute($target, durationAttr));
    } else if (name === defaultAttr) {
      props.default = true;
    } else {
      props[name] = att.value;
    }
  });

  return props;
};

export class Target {
  public duration: number | undefined;
  public transition: string | undefined;
  public easing: string | undefined;
  public currentState: string;

  public targets: any[];
  public props: Dictionary<any>;
  public states: Dictionary<Dictionary<any>>;

  public load(options: ITargetOptions | Element | string): this {
    const self = this;
    if (!options) {
      throw missingArg('options');
    }

    if (isString(options) || isElement(options)) {
      return this.load(
        elementToTarget(
          resolveElement(options as (string | Element), true)
        )
      );
    }

    const json = options as ITargetOptions;
    self.duration = json.duration;
    self.easing = json.easing;
    self.transition = json.transition;
    self.states = json.states;
    self.props = assign({}, [durationAttr, easingAttr, nameAttr, 'states', transitionAttr], json);
    return self;
  }

  public toJSON(): ITargetOptions {
    const self = this;
    return {
      duration: self.duration,
      easing: self.easing,
      transition: self.transition,
      states: self.states
    }
  }
}

export const sceneElementToTargets = ($scene: Element): Dictionary<ITargetOptions> => {
  // find all "state" elements
  const targets: Dictionary<ITargetOptions> = {};

  // assemble all states (nodes)... each ref refers to an element and its
  // properties instruct the animation engine what propertie to set
  findElements(targetSelector, $scene).forEach($target => {
    // read element to pull in state definiton
    const target = elementToTarget($target);
    const targetRef = getAttribute($target, refAttr) || _;

    // skip if no name present and not marked default
    if (!targetRef) {
      return;
    }

    targets[targetRef] = target;
  });

  return targets;
}



export const targetToElement = (target: ITargetOptions): Element => {
  const $target = createElement(targetSelector);
  setAttributes($target, target, [defaultAttr, durationAttr, easingAttr, transitionAttr]);

  for (const stateName in target.states) {
    appendElement($target, stateToElement(target.states[stateName]))
  }
  return $target;
}

export interface ITargetOptions {
  default?: boolean | undefined;
  duration?: number | undefined;
  easing?: string | undefined;
  transition?: string | undefined;
  states: Dictionary<Dictionary<any>>;
  [name: string]: boolean | number | string | Dictionary<any> | undefined;
}

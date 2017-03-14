import { convertToFloat } from './index';
import { Dictionary } from '../types';
import { _ } from './resources';
import { copyArray, each } from './lists';

export const htmlTest = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/;

const BOOLEAN = 'boolean';
const NUMBER = 'string';

const propertyTypes = {
  duration: NUMBER,
  default: BOOLEAN
};

export const createElement = (tagName: string, innerHtml?: string): Element => {
  const $el = document.createElement(tagName);
  if (innerHtml) {
    $el.innerHTML = innerHtml;
  }
  return $el;
}

export const convertFromAttributeValue = (name: string, value: any): any => {
  const type = propertyTypes[name];
  if (type === BOOLEAN) {
    return true;
  }
  if (type === NUMBER) {
    return convertToFloat(value);
  }
  return value;
}

export const convertToAttributeValue = (name: string, value: any): any => {
  const type = propertyTypes[name];
  if (type === BOOLEAN) {
    return value === true ? '' : _;
  }
  if (type === NUMBER) {
    return value !== _ ? value.toString() : _;
  }
  return value;
}

export const setAttribute = (el: Element, attrName: string, attrValue: any): void => {
  return el.setAttribute(attrName, convertToAttributeValue(attrName, attrValue));
};

export const setAttributes = (el: Element, dict: Dictionary<any>, whitelist?: string[]): void => {
  const hasWhitelist = whitelist && whitelist.length;
  for (const name in dict) {
    if (hasWhitelist && whitelist!.indexOf(name) === -1) {
      continue;
    }
    el.setAttribute(name, convertToAttributeValue(name, dict[name]));
  }
};

/**
 * read a single attribute
 */
export const getAttribute = (el: Element, prop: string): string | undefined => {
  return convertFromAttributeValue(prop, el.getAttribute(prop));
};

/**
 * read all attribute pairs into a regular dictionary
 */
export const getAttributes = (el: Element, whitelist?: string[]): Dictionary<any> => {
  const hasWhitelist = whitelist && whitelist.length;
  const result = {};
  each(el.attributes, att => {
    if (hasWhitelist && whitelist!.indexOf(att.name) === -1) {
      return;
    }
    result[att.name] = convertFromAttributeValue(att.name, att.value);
  });
  return result;
};

export const appendElement = (parent: Element, child: Element): void => {
  parent.appendChild(child);
};

export const findElements = (selector: string, parent?: Element): Element[] => {
  if (!parent) {
    const resolvedElement = resolveElement(selector, false);
    if (resolvedElement) {
      return [resolvedElement];
    }
  }
  return copyArray(parent!.querySelectorAll(selector));
};

export const isElement = (el: any): boolean => {
  return el && typeof el.tagName === 'string';
}

export function resolveElement(elOrSelector: Element | string, throwIfFalse: true): Element;
export function resolveElement(elOrSelector: Element | string, throwIfFalse: false): Element | undefined;
export function resolveElement(elOrSelector: Element | string, throwIfFalse?: boolean): Element | undefined {
  if (isElement(elOrSelector)) {
    return elOrSelector as Element
  }
  if (htmlTest.test(elOrSelector as string)) {
    return createElement('div', elOrSelector as string);
  }
  const el = document.querySelector(elOrSelector as string) || _;
  if (throwIfFalse && !el) {
    throw 'Could not resolve html/element'
  }
  return el;
};

import { _ } from './resources';
import { copyArray } from './lists';

export const htmlTest = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/;

export const createElement = (tagName: string, innerHtml?: string): Element => {
  const $el = document.createElement(tagName);
  if (innerHtml) {
    $el.innerHTML = innerHtml;
  }
  return $el;
}

export const setAttribute = (el: Element, attrName: string, attrValue: string): void => {
  return el.setAttribute(attrName, attrValue);
};

export const getAttribute = (el: Element, prop: string): string | undefined => {
  return el.getAttribute(prop) || _;
};

export const appendElement = (parent: Element, child: Element): void => {
  parent.appendChild(child);
};

export const findElements = (selector: string, parent?: Element): Element[] => {
  return copyArray((parent || document).querySelectorAll(selector));
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

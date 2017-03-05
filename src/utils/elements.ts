import { _ } from './resources';

export const htmlTest = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/;

export function resolveElement(elOrSelector: Element | string, throwIfFalse: true): Element;
export function resolveElement(elOrSelector: Element | string, throwIfFalse: false): Element | undefined;
export function resolveElement(elOrSelector: Element | string, throwIfFalse?: boolean): Element | undefined {
  if (isElement(elOrSelector)) {
    return elOrSelector as Element
  }
  if (htmlTest.test(elOrSelector as string)) {
    const el = document.createElement('div');
    el.innerHTML = elOrSelector as string;
    return el;
  }
  const el = document.querySelector(elOrSelector as string) || _;
  if (throwIfFalse && !el) {
    throw 'Could not resolve html/element'
  }
  return el;
};

export function attr(el: Element, prop: string): string | undefined {
  return el.getAttribute(prop) || _;
};

export function $(selector: string, parent?: Element): NodeList {
  return (parent || document).querySelectorAll(selector);
};

export function isElement(el: any): boolean {
  return el && typeof el.tagName === 'string';
}

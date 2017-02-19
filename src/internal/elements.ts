export const resolveElement = (elOrSelector: Element | string): Element | null => {
  return elOrSelector instanceof Element ? elOrSelector : document.querySelector(elOrSelector);
};

export const attr = (el: Element, prop: string): string | undefined => {
  return el.getAttribute(prop) || undefined;
};

export const selectAll = (el: Element, selector: string) => {
  return el.querySelectorAll(selector);
};

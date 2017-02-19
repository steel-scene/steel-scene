import { Dictionary, ILayer } from '../types';
import { resolveElement, elementToLayers } from '../internal';

const frolicAttr = 'frolic';

export class BlueUnicorn {
  private _layers: Dictionary<ILayer> = {};

  public frolic(elOrSelector: Element | string): void {
    const el = resolveElement(elOrSelector);
    if (!el) {
      throw 'Could not frolic in ' + elOrSelector;
    }
    if (el.getAttribute(frolicAttr) === 'true') {
      throw 'Unicorn is frolicing in ' + elOrSelector + ' already!';
    }
    this._layers = elementToLayers(el);
    el.setAttribute(frolicAttr, 'true');
  }
}


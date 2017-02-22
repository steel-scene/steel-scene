import { BlueUnicorn } from './internal';
import { IAnimationEngine, ILayer, IDictionary } from './types';

// initialize default instance
const bu = new BlueUnicorn();

// export default to namespace
export const {
  exportHTML,
  exportJSON,
  importHTML,
  reset,
  set,
  setPlayState,
  transition
} = bu;

// export directly because of typing visibility
export const importJSON = bu.importJSON as { (layers: IDictionary<ILayer>, reset: boolean): BlueUnicorn };
export const use = bu.use as { (a: IAnimationEngine): BlueUnicorn };

// auto-wire up document on DOMContentLoaded
if (window && window.document) {
  document.addEventListener('DOMContentLoaded', () => {
    bu.importHTML(document.body);
  });
}

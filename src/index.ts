import { BlueUnicorn } from './internal';
import { IAnimationEngine, ISceneJSON, IDictionary } from './types';

// initialize default instance
const bu = new BlueUnicorn();

// export default to namespace
export const {
  exportHTML,
  exportJSON,
  importHTML,
  reset,
  set,
  transition
} = bu;

// export directly because of typing visibility
export const importJSON = bu.importJSON as { (scenes: IDictionary<ISceneJSON>, reset: boolean): BlueUnicorn };
export const use = bu.use as { (a: IAnimationEngine): BlueUnicorn };

/**
 * Export all types to "types"
 */
import * as types from './types';
export { types };

// auto-wire up document on DOMContentLoaded
if (window && window.document) {
  document.addEventListener('DOMContentLoaded', () => {
    bu.importHTML(document.body);
  });
}

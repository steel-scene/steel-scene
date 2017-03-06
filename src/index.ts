import { SteelScene } from './internal';
import { IAnimationEngine, ISceneJSON, Dictionary } from './types';
import * as types from './types';

// initialize default instance
const bu = new SteelScene();

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
export const importJSON = bu.importJSON as { (scenes: Dictionary<ISceneJSON>, reset: boolean): SteelScene };
export const use = bu.use as { (a: IAnimationEngine): SteelScene };

/**
 * Export all types to "types"
 */
export { types };

// auto-wire up document on DOMContentLoaded
if (window && window.document) {
  document.addEventListener('DOMContentLoaded', () => {
    bu.importHTML(document.body);
  });
}

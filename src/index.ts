import { BlueUnicorn } from './internal';
import { IAnimationEngine, ILayer, IDictionary } from './types';

// initialize default instance
const bu = new BlueUnicorn();

// export default to namespace
export const {
  load,
  set,
  setPlayState,
  transition
} = bu;

// export directly because of typing visibility
export const loadJSON = bu.loadJSON as { (layers: IDictionary<ILayer>, reset: boolean): BlueUnicorn };
export const use = bu.use as { (a: IAnimationEngine): BlueUnicorn };

if (window && window.document) {
  document.addEventListener('DOMContentLoaded', () => {
    bu.load(document.body);
  });
}

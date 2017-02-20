import { BlueUnicorn } from './internal';
import {IAnimationEngine} from './types';

// initialize default instance
const bu = new BlueUnicorn();

// export default to namespace
export const {
 frolic,
 set,
 setPlayState,
 transition
} = bu;

// export use directly because of typing visibility
export const use = bu.use as { (a: IAnimationEngine): BlueUnicorn };

if (window && window.document) {
  document.addEventListener('DOMContentLoaded', () => {
    bu.frolic('body');
  });
}

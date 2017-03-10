import { importHTML } from './internal/steel';
import { setEngine } from './internal/engine';

// export types and helpers to steel namespace
export * from './types';
export { exportJSON, importJSON, reset, set, transition, exportHTML } from './internal/steel';
export { importHTML, setEngine as use }

// auto-wire up document on DOMContentLoaded
if (window && window.document) {
  document.addEventListener('DOMContentLoaded', () => {
    importHTML(document.body);
  });
}

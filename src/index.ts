import { load } from './internal/steel'
import { setEngine } from './internal/engine'
import { startRendering } from './internal/render'

// export types and helpers to steel namespace
export * from './types'
export { scene } from './internal/scene'
export { target } from './internal/target'
export { load, setEngine as use }
export { dispatch, subscribe, unsubscribe } from './internal/store'

// auto-wire up document on DOMContentLoaded
if (window && window.document) {
  document.addEventListener('DOMContentLoaded', () => {
    load(document.body)
  })
}

// start listening to events and rendering results
startRendering()

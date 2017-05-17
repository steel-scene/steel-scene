import { Store } from './store'
import { Dictionary, ISceneState, ITargetState } from '../types'

const store = new Store({
    scenes: {} as Dictionary<ISceneState>,
    targets: {} as Dictionary<ITargetState>
  })

const { dispatch, getState } = store
export { dispatch, getState }

export { loadTarget } from './load-target'
export { setSceneState } from './set-scene-state'
export { setTargetState } from './set-target-state'
export { transitionTargetState } from './transition-target-state'
export { updateTargetProps } from './update-target-props'
export { updateTargetState } from './update-target-states'
export { updateTargetTargets } from './update-target-targets'
export { transitionSceneState } from './transition-scene-state'
export { addSceneTargets } from './add-scene-targets'
export { removeSceneTargets } from './remove-scene-targets'
export { loadScene } from './load-scene'

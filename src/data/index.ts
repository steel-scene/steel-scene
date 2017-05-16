import * as ActionType from './actions'
import { onLoadTarget } from './load-target'
import { onSetTargetState } from './set-target-state'
import { onSetSceneState } from './set-scene-state'
import { onUpdateTargetProps } from './update-target-props'
import { onUpdateTargetStates } from './update-target-states'
import { onUpdateTargetTargets } from './update-target-targets'
import { onTransitionTargetState } from './transition-target-state'
import { onTransitionSceneState } from './transition-scene-state'
import { onAddSceneTargets } from './add-scene-targets'
import { onRemoveSceneTargets } from './remove-scene-targets'
import { onLoadScene } from './load-scene'
import { Store } from './store'
import { Dictionary, ISceneState, ITargetState } from '../types'

const store = new Store({
    scenes: {} as Dictionary<ISceneState>,
    targets: {} as Dictionary<ITargetState>
  })
  .register(ActionType.LOAD_TARGET, onLoadTarget)
  .register(ActionType.SET_TARGET_STATE, onSetTargetState)
  .register(ActionType.UPDATE_TARGET_PROPS, onUpdateTargetProps)
  .register(ActionType.UPDATE_TARGET_STATES, onUpdateTargetStates)
  .register(ActionType.UPDATE_TARGET_TARGETS, onUpdateTargetTargets)
  .register(ActionType.TRANSITION_TARGET_STATE, onTransitionTargetState)
  .register(ActionType.SET_SCENE_STATE, onSetSceneState)
  .register(ActionType.TRANSITION_SCENE_STATE, onTransitionSceneState)
  .register(ActionType.ADD_SCENE_TARGET, onAddSceneTargets)
  .register(ActionType.REMOVE_SCENE_TARGET, onRemoveSceneTargets)
  .register(ActionType.LOAD_SCENE, onLoadScene)

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

import { TRANSITION_SCENE_STATE } from './actions'
import { ISteelAction, ITargetOptions, ISteelState } from '../types'
import { _, assign } from '../utils'

// todo: loosely couple dispatch from actual reducer code
import { dispatch, transitionTargetState } from '.'

export interface ITransitionSceneStateAction extends ISteelAction {
  id: string
  stateNames: string | string[]
}

export const onTransitionSceneState = (store: ISteelState, action: ITransitionSceneStateAction) => {
  const { id, stateNames } = action

  const scene = store.scenes[id]
  if (!scene) {
    return store
  }

  const targetOptions: ITargetOptions = assign({ inherited: true }, _, scene.props)
  for (let i = 0, ilen = scene.targets.length; i < ilen; i++) {
    dispatch(transitionTargetState(scene.targets[i], stateNames, targetOptions))
  }

  return store
}

export const transitionSceneState = (id: string, stateNames: string | string[]): ITransitionSceneStateAction => {
  return { id, stateNames, type: TRANSITION_SCENE_STATE }
}

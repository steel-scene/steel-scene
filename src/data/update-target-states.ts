import { UPDATE_TARGET_STATES } from './actions'
import { Dictionary, ISteelAction, ISteelState } from '../types'
import { assign, NAME, SELECT, STATES } from '../utils'

const targetBlackList = [STATES, SELECT, NAME]

export interface IUpdateStateDefinitionAction extends ISteelAction {
  id: string
  stateName: string
  props: Dictionary<any>
}

export const onUpdateTargetStates = (store: ISteelState, action: IUpdateStateDefinitionAction) => {
  const { id, props, stateName } = action
  const target = store.targets[id]
  if (target) {
    target.states[stateName] = assign(target.states[stateName], targetBlackList, props)
  }
  return store
}

export const updateTargetState = (id: string, stateName: string, props: Dictionary<any>): IUpdateStateDefinitionAction => {
  return {
    id,
    type: UPDATE_TARGET_STATES,
    stateName,
    props
  }
}

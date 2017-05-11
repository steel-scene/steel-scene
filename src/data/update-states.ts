import { Dictionary, ISteelAction, ISteelState } from '../types'
import { assign, SELECT, STATES } from '../utils'

const targetBlackList = [STATES, SELECT]

export const TARGET_STATE_MERGE = 'TARGET_STATE_MERGE'

export interface IUpdateStateDefinitionAction extends ISteelAction<'TARGET_STATE_MERGE'> {
  id: string
  stateName: string
  props: Dictionary<any>
}

export const onUpdateStates = (store: ISteelState, action: IUpdateStateDefinitionAction) => {
  const { id, props, stateName } = action
  const target = store.targets[id]
  if (target) {
    target.states[stateName] = assign(target.states[stateName], targetBlackList, props)
  }
  return store
}

export const updateStateDefinitions = (id: string, stateName: string, props: Dictionary<any>): IUpdateStateDefinitionAction => {
  return {
    id,
    type: TARGET_STATE_MERGE,
    stateName,
    props
  }
}

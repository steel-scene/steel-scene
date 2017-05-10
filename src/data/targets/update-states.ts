import { Dictionary, ISteelAction } from '../../types'
import { assign, SELECT, STATES } from '../../utils'

const targetBlackList = [STATES, SELECT]

export const TARGET_STATE_MERGE = 'TARGET_STATE_MERGE'

export interface IUpdateStateDefinitionAction extends ISteelAction<'TARGET_STATE_MERGE'> {
  id: string
  stateName: string
  props: Dictionary<any>
}

export const onUpdateStates = (states: Dictionary<Dictionary<any>>, action: IUpdateStateDefinitionAction) => {
  if (action.type !== TARGET_STATE_MERGE) {
    return states
  }

  const { props, stateName } = action
  states[stateName] = assign(states[stateName], targetBlackList, props)
  return states
}

export const updateStateDefinitions = (id: string, stateName: string, props: Dictionary<any>): IUpdateStateDefinitionAction => {
  return {
    id,
    type: TARGET_STATE_MERGE,
    stateName,
    props
  }
}

import { Dictionary, ISteelAction } from '../../types'
import { assign, SELECT, STATES } from '../../utils'

const targetBlackList = [STATES, SELECT]

export const TARGET_PROPS_MERGE = 'TARGET_PROPS_MERGE'

export interface IUpdatePropsAction extends ISteelAction<'TARGET_PROPS_MERGE'> {
  id: string
  targets: Dictionary<any>
}

export const onUpdateProps = (s: Dictionary<any>, action: IUpdatePropsAction) => {
  if (action.type !== TARGET_PROPS_MERGE) {
    return s
  }
  return s.props = assign({}, targetBlackList, s.props, action.targets)
}

export const updateProps = (id: string, targets: Dictionary<any>): IUpdatePropsAction => {
  return {
    id,
    type: TARGET_PROPS_MERGE,
    targets
  }
}

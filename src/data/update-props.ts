import { Dictionary, ISteelAction, ISteelState } from '../types'
import { assign, SELECT, STATES } from '../utils'

const targetBlackList = [STATES, SELECT]

export const TARGET_PROPS_MERGE = 'TARGET_PROPS_MERGE'

export interface IUpdatePropsAction extends ISteelAction<'TARGET_PROPS_MERGE'> {
  id: string
  targets: Dictionary<any>
}

export const onUpdateProps = (store: ISteelState, action: IUpdatePropsAction) => {
  const { id, targets } = action
  const target = store.targets[id]
  if (target) {
    target.props = assign({}, targetBlackList, target.props, targets)
  }
  return store
}

export const updateProps = (id: string, targets: Dictionary<any>): IUpdatePropsAction => {
  return {
    id,
    type: TARGET_PROPS_MERGE,
    targets
  }
}

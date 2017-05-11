import { ActionType } from './actions'
import { Dictionary, ISteelAction, ISteelState } from '../types'
import { assign, SELECT, STATES } from '../utils'

const targetBlackList = [STATES, SELECT]

export interface IUpdatePropsAction extends ISteelAction<ActionType.UPDATE_TARGET_PROPS> {
  id: string
  targets: Dictionary<any>
}

export const onUpdateTargetProps = (store: ISteelState, action: IUpdatePropsAction) => {
  const { id, targets } = action
  const target = store.targets[id]
  if (target) {
    target.props = assign({}, targetBlackList, target.props, targets)
  }
  return store
}

export const updateTargetProps = (id: string, targets: Dictionary<any>): IUpdatePropsAction => {
  return {
    id,
    targets,
    type: ActionType.UPDATE_TARGET_PROPS
  }
}

import { ACTION_TYPES, IAction } from '../constant';

const uiReducerDefaultState = {
  shops:[]
};

export function uiReducer(
  state = uiReducerDefaultState,
  action : IAction
) {
  switch (action.type) {
    case ACTION_TYPES.SET_SHOPS:
      return {
        ...state,
        shops:action.payload
      };
    default:
      return state;
  }
}

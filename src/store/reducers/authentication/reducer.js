import { ACTION_TYPES, IAction } from '../constant';

const authReducerDefaultState = {
  authToken: 'akilaakilaakila',
  loading: false,
  signedIn: false
};

export function AuthenticationReducer(
  state = authReducerDefaultState,
  action : IAction
) {
  switch (action.type) {
    case ACTION_TYPES.SET_TOKEN:
      return {
        ...state,
        authToken: action.payload
      };
    case ACTION_TYPES.SET_SIGNIN_STATUS:
      return {
        ...state,
        signedIn: action.payload
      };
    default:
      return state;
  }
}

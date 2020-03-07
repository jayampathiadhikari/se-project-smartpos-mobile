
export const ACTION_TYPES = {
  SET_TOKEN : 'SET_TOKEN',
  SET_PATH : 'SET_PATH',
  SET_USER_NAME : 'SET_USER_NAME',
  SET_USER_IMAGE : 'SET_USER_IMAGE',
  SET_SIGNIN_STATUS : 'SET_SIGNIN_STATUS',
  SET_PHONE_NO : 'SET_PHONE_NO'
};

export interface IAction {
  type: string;
  payload: any;
}

import {ACTION_TYPES} from "../constant";

export function changeName(payload) {
  return {type: ACTION_TYPES.SET_USER_NAME, payload}
}

export function setUser(payload) {
  return {type: ACTION_TYPES.SET_USER, payload}
}
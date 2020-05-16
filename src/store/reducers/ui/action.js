import {ACTION_TYPES} from "../constant";


export function setShopDetails(payload) {
  return {type: ACTION_TYPES.SET_SHOPS, payload}
};

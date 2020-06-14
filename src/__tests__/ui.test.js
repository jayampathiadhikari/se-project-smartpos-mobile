import {setShopDetails} from "../store/reducers/ui/action";
import {uiReducer} from '../store/reducers/ui/reducer';
import * as types from "../store/reducers/constant";

describe ('ui actions',()=>{
    it ('should create an action to set shop details',()=>{
        const payload = [{shop_id:1},{shop_id:2}]
        const expectedAction = {
            type:types.ACTION_TYPES.SET_SHOPS,
            payload
        }
        expect(setShopDetails(payload)).toEqual(expectedAction)
    })
})

describe('ui reducers',()=>{
    const expectedInitialState={
        shops:[]
    };
    const initialAction = {
        type:'None',
        payload:{}
    };
    it ('should return the initial state',()=>{
        expect(uiReducer(undefined, initialAction)).toEqual(expectedInitialState);
    });


    const expectedState_setShops={
        shops:[{shop_id:1},{shop_id:2}]
    };
    const setShopsAction ={
        type : types.ACTION_TYPES.SET_SHOPS,
        payload:[{shop_id:1},{shop_id:2}]
    };
    it ('should handle set shops',()=>{
        expect(uiReducer(undefined, setShopsAction)).toEqual(expectedState_setShops);
    });



})
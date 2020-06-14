import {setUser} from "../store/reducers/authentication/action";
import {AuthenticationReducer} from '../store/reducers/authentication/reducer';
import * as types from "../store/reducers/constant";

describe ('Authentication actions',()=>{
    it ('should create an action to set user',()=>{
        const payload = {userId : '123650'}
        const expectedAction = {
            type:types.ACTION_TYPES.SET_USER,
            payload
        }
        expect(setUser(payload)).toEqual(expectedAction)
    })
})

describe('Authentication reducers',()=>{
    const initialState={
        token:null,
        loading: false,
        signedIn: false,
        user:null
    };
    const initialAction = {
        type:'None',
        payload:{}
    };
    it ('should return the initial state',()=>{
        expect(AuthenticationReducer(undefined, initialAction)).toEqual(initialState);
    });


    const expectedState_setUser={
        token:null,
        loading: false,
        signedIn: false,
        user:{userId : '123456'}
    };
    const setUserAction ={
        type : types.ACTION_TYPES.SET_USER,
        payload:{userId:'123456'}
    };
    it ('should handle set user',()=>{
        expect(AuthenticationReducer(undefined, setUserAction)).toEqual(expectedState_setUser);
    });


    const expectedState_setToken={
        token: 'token1',
        loading: false,
        signedIn: false,
        user:null
    };
    const setTokenAction ={
        type: types.ACTION_TYPES.SET_TOKEN,
        payload:'token1'
    };
    it ('should handle set token',()=>{
        expect(AuthenticationReducer(undefined, setTokenAction)).toEqual(expectedState_setToken);
    });


    const expectedState_setSignIn={
        token:null,
        loading: false,
        signedIn: true,
        user:null
    };
    const setSignInStatusAction ={
        type: types.ACTION_TYPES.SET_SIGNIN_STATUS,
        payload:true
    };
    it ('should handle set sign in status',()=>{
        expect(AuthenticationReducer(undefined, setSignInStatusAction)).toEqual(expectedState_setSignIn);
    });



})
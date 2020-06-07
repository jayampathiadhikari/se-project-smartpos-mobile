import 'react-native';
import React from 'react';
import ConnectedStockScreen, {StockScreen} from "./currentStockScreen";
import {shallow,mount} from "enzyme";
import {Provider}from 'react-redux';
import axios from 'axios';
import configureStore from 'redux-mock-store';
import renderer from 'react-test-renderer'

jest.mock('axios');
// const mockStore = configureStore([]);

describe('Current stock screen functions',()=>{
    let wrapper;
    // let wrapper2;
    // let store;



    // {"AuthenticationReducer": {"authToken": "akilaakilaakila", "loading": false, "signedIn": false, "user": {"address": "kalinasdsadg", "email": "salesp@mailcupp.com", "firstName": "sp1
    //     ", "lastName": "sp1", "nic": "7897456212v", "phoneNumber": "654879123", "region": "Kegalle", "supervisorUid": "ySRNCA8E4hacmi9ZNsofSki5Uyv1", "type": "salesperson", "uid": "Rp7TWT0svQOe2M
    //     WAqr29CisH7QU2"}}, "_persist": {"rehydrated": true, "version": -1}, "uiReducer": {"shops": []}}
    //



    beforeEach(() => {
        // store = mockStore(
        //     {AuthenticationReducer: {user: {uid: "Rp7TWT0svQOe2MWAqr29CisH7QU2"}},  uiReducer: {shops: []}}
        // );
        //
        // wrapper2 = shallow(
        //     <Provider store={store}>
        //         <ConnectedStockScreen />
        //     </Provider>
        // ).dive();
        //


        const user = {uid:'Rp7TWT0svQOe2MWAqr29CisH7QU2'};
        wrapper =shallow(<StockScreen user={user}/>,{ disableLifecycleMethods: true });
    },5);

    afterEach(() => {
        wrapper.unmount();
    },5);

    it('should fetch stock details from an api and update the state.',async ()=>{
        const products = [{name:'Termeric',product_id:'12',unit_price:100, quantity:20}];
        const resp = {data: {success:true,data:products}};
        axios.post.mockResolvedValue(resp);
        await wrapper.instance().getStockDetails()//When calling function make sure to use wrapper.instance()
        expect(wrapper.state().products).toEqual(products);// When acceesing states just use the wrapper
    })

    it('should handle error occurred when fetching stock details',async ()=>{
        const resp = {data: {success:false,data:[]}};
        axios.post.mockRejectedValue('Error occured while fetching data');
        await wrapper.instance().getStockDetails();
        expect(wrapper.state().products).toEqual([]);
    })

    it('should handle ',async ()=>{
        const resp = {data: {success:false,data:[]}};
        axios.post.mockResolvedValue(resp);
        await wrapper.instance().getStockDetails();
        expect(wrapper.state().products).toEqual([]);
    })

    // it('testing4',async ()=>{
    //     const products = [{name:'Termeric',product_id:'12',unit_price:100, quantity:20}];
    //     const resp = {data: {success:true,data:products}};
    //     axios.post.mockResolvedValue(resp);
    //     console.log(wrapper2.find())
    //     await wrapper2.instance().getStockDetails()//When calling function make sure to use wrapper.instance()
    //     expect(wrapper2.state().products).toEqual(products);// When acceesing states just use the wrapper
    // })

})



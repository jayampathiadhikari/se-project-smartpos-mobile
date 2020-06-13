import 'react-native';
import React from 'react';
import {StockScreen} from "../screens/currentStockScreen";
import {shallow} from "enzyme";
// import {Provider}from 'react-redux';
import axios from 'axios';
import configureStore from 'redux-mock-store';
import renderer from 'react-test-renderer'

jest.mock('axios');
// const mockStore = configureStore();

describe('Current stock screen',()=>{
    let wrapper;
    let user;

    beforeEach(() => {
        // const store = mockStore(
        //     {AuthenticationReducer: {user: {uid: "Rp7TWT0svQOe2MWAqr29CisH7QU2"}},  uiReducer: {shops: []}}
        // );
        user = {uid:'Rp7TWT0svQOe2MWAqr29CisH7QU2'};
        wrapper =shallow(<StockScreen user={user}/>,{ disableLifecycleMethods: true });
        wrapper.instance()._isMounted=true;
    },5);

    afterEach(() => {
        wrapper.unmount();
    },5);

    it('should render initial loading correctly',async ()=>{
        const tree = renderer.create(wrapper).toJSON();
        expect(tree).toMatchSnapshot();
    })

    it('should render the screen relevant to empty stock',async ()=>{
        axios.post.mockResolvedValue({data:{success:false,data:[]}});
        wrapper.instance().getStockDetails()
        expect(wrapper.state().onceFetched).toEqual(true)
        const tree = renderer.create(wrapper).toJSON();
        expect(tree).toMatchSnapshot();
    })

    it('should render the stocks details correctly',async ()=>{

        const products = [{name:'Termeric',product_id:'12',unit_price:100, quantity:20}];
        wrapper.instance().setState({products:products})
        const resp = {data: {success:true,data:products}};
        axios.post.mockResolvedValue(resp);
        await wrapper.instance().getStockDetails()//When calling function make sure to use wrapper.instance()
        expect(wrapper.state().products).toEqual(products);// When acceesing states just use the wrapper
        const tree = renderer.create(wrapper).toJSON();
        expect(tree).toMatchSnapshot();
    })

    describe('getStockDetails() ',()=>{

        it('should fetch stock details from an api and update the state.',async ()=>{
            const products = [{name:'Termeric',product_id:'12',unit_price:100, quantity:20}];
            const resp = {data: {success:true,data:products}};
            axios.post.mockResolvedValue(resp);
            await wrapper.instance().getStockDetails()//When calling function make sure to use wrapper.instance()
            expect(wrapper.state().products).toEqual(products);// When acceesing states just use the wrapper
        })

        it('should handle error occurred when fetching stock details',async ()=>{
            axios.post.mockRejectedValue('Error : Network error occured.');
            await wrapper.instance().getStockDetails();
            expect(wrapper.state().products).toEqual([]);
        })

        it('should handle unsuccessful response from the api ',async ()=>{
            const resp = {data: {success:false,data:[]}};
            axios.post.mockResolvedValue(resp);
            await wrapper.instance().getStockDetails();
            expect(wrapper.state().products).toEqual([]);
        })

    })

})




// mount() result to render the full dom (the specific component allong with the child)
//shallow() will render the specific component





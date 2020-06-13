import 'react-native';
import React from 'react';
import ShopDetailsScreen from "../screens/shopDetailsScreen";
import {shallow} from "enzyme";
import axios from 'axios';
import renderer from 'react-test-renderer'

jest.mock('axios');

describe('Shop details screen',()=> {
    let wrapper;

    beforeEach(() => {
        wrapper =shallow(<ShopDetailsScreen navigation={{ getParam: jest.fn() }}/>,{ disableLifecycleMethods: true });
        wrapper.instance()._isMounted=true;
    },5);

    afterEach(() => {
        wrapper.instance()._isMounted=false;
        wrapper.unmount();
    },5);

    it('renders the initial loading screen correctly',()=>{
        const tree = renderer.create(wrapper).toJSON();
        expect(tree).toMatchSnapshot();
    })

    it('renders the shop details screen correctly',()=>{
        const shopDetails={shop_name:'W.P.Stores',owner_name:'M.M.De Silva',owner_cell_num:'0770620350',owner_land_num:'0912246300',shop_contact_num:'075623023'};
        wrapper.instance().setState({shopDetails:shopDetails})
        expect(wrapper.state().shopDetails).toEqual(shopDetails);
        const tree = renderer.create(wrapper).toJSON();
        expect(tree).toMatchSnapshot();
    });

    describe ('geStockDetails()',()=> {
        it('should fetch shop details from an api and update the state.', async () => {
            const shopDetails={shop_name:'W.P.Stores',owner_name:'M.M.De Silva',owner_cell_num:'0770620350',owner_land_num:'0912246300',shop_contact_num:'075623023'};
            const resp = {data: {success: true, data: shopDetails}};
            axios.post.mockResolvedValue(resp);
            await wrapper.instance().getShopDetails()//When calling function make sure to use wrapper.instance()
            expect(wrapper.state().shopDetails).toEqual(shopDetails);// When acceesing states just use the wrapper
        })

        it('should handle error occurred when fetching shop details', async () => {
            axios.post.mockRejectedValue('Error: Network error occured');
            await wrapper.instance().getShopDetails();
            expect(wrapper.state().shopDetails).toEqual({});
        })

        it('should handle unsuccessful response from the api ', async () => {
            const resp = {data: {success: false, data: {}}};
            axios.post.mockResolvedValue(resp);
            await wrapper.instance().getShopDetails();
            expect(wrapper.state().shopDetails).toEqual({});
        })
    })
})
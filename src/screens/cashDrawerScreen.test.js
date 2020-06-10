import 'react-native';
import React from 'react';
import CashDrawerScreen from "./cashDrawerScreen";
import {shallow} from "enzyme";
import axios from 'axios';
import renderer from 'react-test-renderer'

jest.mock('axios');

describe('Cash Drawer screen',()=> {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(<CashDrawerScreen navigation={{getParam: jest.fn()}}/>, {disableLifecycleMethods: true});
    }, 5);

    afterEach(() => {
        wrapper.unmount();
    }, 5);

    it('renders a cash drawer for zero due amount correctly', () => {
        const tree = renderer.create(wrapper).toJSON();
        expect(tree).toMatchSnapshot();
    })

    it('renders a cash drawer with the due amount correctly', () => {
        wrapper.instance().setState({dueAmount: 1000});
        expect(wrapper.state().dueAmount).toBe(1000);
        const tree = renderer.create(wrapper).toJSON();
        expect(tree).toMatchSnapshot();
    })

    describe('getInvoiceDetails() ',()=>{

        it('should fetch invoice details from an api and update the due amount.',async ()=>{
            const invoices = [{invoice_id :10 , invoice_value:10000 ,paid_amount:2000},{invoice_id :18 , invoice_value:15000 ,paid_amount:10000}];
            const resp = {data: {success:true,data:invoices}};
            axios.post.mockResolvedValue(resp);
            await wrapper.instance().getInvoiceDetails()//When calling function make sure to use wrapper.instance()
            expect(wrapper.state().dueAmount).toEqual(13000);// When acceesing states just use the wrapper
        })

        it('should handle error occurred when fetching invoice details',async ()=>{
            axios.post.mockRejectedValue('Error : Network error occured.');
            await wrapper.instance().getInvoiceDetails();
            expect(wrapper.state().dueAmount).toEqual(0);
        })

        it('should handle unsuccessful response from the api ',async ()=>{
            const resp = {data: {success:false,data:[]}};
            axios.post.mockResolvedValue(resp);
            await wrapper.instance().getInvoiceDetails();
            expect(wrapper.state().dueAmount).toEqual(0);
        })

    })
})
import 'react-native';
import React from 'react';
import SalesDetailsScreen from "./salesDetailsScreen";
import {shallow} from "enzyme";
import axios from 'axios';
import renderer from 'react-test-renderer'
import { Alert } from 'react-native';


jest.mock('axios');

describe('Sales details screen',()=>{
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(<SalesDetailsScreen navigation={{getParam: jest.fn()}}/>, {disableLifecycleMethods: true});
    }, 5);


    it('should render the initial loading screen correctly', () => {
        const tree = renderer.create(wrapper).toJSON();
        expect(tree).toMatchSnapshot();
    })

    it(' should render no records found screen correctly', () => {
        wrapper.instance().setState({onceFetched:true});
        expect(wrapper.state().onceFetched).toBe(true);
        const tree = renderer.create(wrapper).toJSON();
        expect(tree).toMatchSnapshot();
    })

    it('should render a sales records screen correctly', () => {
        const invoiceDetails = [{id:12,date:'2020/5/1',total:25000,due:25000},{id:27,date:'2020/7/2',total:35000,due:20000},{id:15,date:'2020/6/1',total:29000,due:20000}];
        wrapper.instance().setState({tableData:invoiceDetails , onceFetched:true});
        expect(wrapper.state().tableData).toBe(invoiceDetails);
        expect(wrapper.state().onceFetched).toBe(true);
        const tree = renderer.create(wrapper).toJSON();
        expect(tree).toMatchSnapshot();
    })

    describe('getInvoiceDetails() ',()=>{

        it('should fetch invoice details from an api and update the tableData with a sorted list.',async ()=>{

            const invoices =[{id:12,date:'2020/5/1',total:25000,due:25000},{id:27,date:'2020/7/2',total:35000,due:20000},{id:15,date:'2020/6/1',total:29000,due:20000}];
            const resp = {data: {success:true,data:invoices}};
            axios.post.mockResolvedValue(resp);

            wrapper.instance().formatInvoiceDetails=jest.fn();
            wrapper.instance().sortInvoicesById = jest.fn();
            wrapper.instance().sortInvoicesByState=jest.fn();

            await wrapper.instance().getInvoiceDetails();

            expect(wrapper.instance().formatInvoiceDetails).toHaveBeenCalled();
            expect(wrapper.instance().sortInvoicesById).toHaveBeenCalled();
            expect(wrapper.instance().sortInvoicesByState).toHaveBeenCalled();
        })

        it('should handle error occurred when fetching invoice details',async ()=>{
            axios.post.mockRejectedValue('Error : Network error occured.');
            await wrapper.instance().getInvoiceDetails();
            expect(wrapper.state().tableData).toEqual([]);
        })

        it('should handle unsuccessful response from the api ',async ()=>{
            const resp = {data: {success:false,data:[]}};
            axios.post.mockResolvedValue(resp);
            await wrapper.instance().getInvoiceDetails();
            expect(wrapper.state().tableData).toEqual([]);
        })

    })

    // describe('updateDatabasePaidAmount()',()=>{
    //     it('should handle error occurred when fetching data',async ()=>{
    //
    //         const invoice_id=12;
    //         const amountReceived = 1000;
    //         wrapper.instance().setState({amountReceived:amountReceived});
    //         const resp= {data:{sucees:false}};
    //
    //         wrapper.instance().closeDeuAmountModal=jest.fn();
    //
    //         axios.post.mockResolvedValue(resp);
    //         await wrapper.instance().updateDatabasePaidAmount(invoice_id,amountReceived);
    //
    //         expect(wrapper.instance().closeDeuAmountModal).toHaveBeenCalled();
    //         expect(wrapper.state().amountReceived).toEqual(0);
    //     })
    // })

    describe('sortInvoicesById() ',()=>{
        it('should return a list of invoices sorted by its ID',()=>{
            const invoices =[{id:12,date:'2020/5/1',total:25000,due:25000},{id:27,date:'2020/7/2',total:35000,due:20000},{id:15,date:'2020/6/1',total:29000,due:20000}];
            const expectedSortedList = [{id:12,date:'2020/5/1',total:25000,due:25000},{id:15,date:'2020/6/1',total:29000,due:20000},{id:27,date:'2020/7/2',total:35000,due:20000}]
            const  receivedSortedList =wrapper.instance().sortInvoicesById(invoices);
            expect(receivedSortedList).toEqual(expectedSortedList);
        })

        it ('should return an empty list if the input is an empty array',()=>{
            const  receivedSortedList =wrapper.instance().sortInvoicesById([]);
            expect(receivedSortedList).toEqual([]);
        })
    })

    describe('sortInvoicesByState() ',()=>{
        it('should sort the list of invoices  by its state(paid or due) and update the tableData',()=>{
            const invoices =[{id:12,date:'2020/5/1',total:25000,due:0},{id:27,date:'2020/7/2',total:35000,due:20000},{id:15,date:'2020/6/1',total:29000,due:20000}];
            const expectedSortedList = [{id:27,date:'2020/7/2',total:35000,due:20000},{id:15,date:'2020/6/1',total:29000,due:20000},{id:12,date:'2020/5/1',total:25000,due:0}];
            wrapper.instance().sortInvoicesByState(invoices);
            expect(wrapper.state().tableData).toEqual(expectedSortedList);
        })

        it ('should handle the input of an empty array',()=>{
            wrapper.instance().sortInvoicesByState([]);
            expect(wrapper.state().tableData).toEqual([]);
        })
    })


    describe ('formatInvoiceDetails() ',()=>{

        it('should convert the invoice details of a list of invoices to an acceptable format',()=>{
            const fetchedInvoices=[{invoice_id:12,issued_date:'2020/5/1',invoice_value:25000 , paid_amount: 25000},{invoice_id:27,issued_date:'2020/7/2',invoice_value: 35000, paid_amount: 15000},{invoice_id:15,issued_date:'2020/6/1',invoice_value: 29000, paid_amount: 9000}];
            const expectedSortedList =[{id:12,date:'2020/5/1',total:25000,due:0},{id:27,date:'2020/7/2',total:35000,due:20000},{id:15,date:'2020/6/1',total:29000,due:20000}];
            const returnedSortedList = wrapper.instance().formatInvoiceDetails(fetchedInvoices);
            expect(returnedSortedList).toEqual(expectedSortedList);
        })

        it ('should handle the input of an empty array',()=>{
            const returnedSortedList =wrapper.instance().formatInvoiceDetails([]);
            expect(returnedSortedList).toEqual([]);
        })
    })


    describe('openDueAmountModal()',()=>{
        it ('should update the invoiceToUpdate and modalVisibility states',()=>{
            const invoice = {id:14,date:'2020/01/10' , total:50000,due:40000};
            expect(wrapper.state().invoiceToUpdate).toEqual('');
            expect(wrapper.state().updateDueAmountModalVisible).toEqual(false);
            wrapper.instance().openDueAmountModal(invoice);
            expect(wrapper.state().invoiceToUpdate).toEqual(invoice);
            expect(wrapper.state().updateDueAmountModalVisible).toEqual(true);

        })
    })


    describe('closeDueAmountModal()',()=>{
        it ('should update the invoiceToUpdate and modalVisibility states',()=>{
            const invoice = {id:14,date:'2020/01/10' , total:50000,due:40000};
            wrapper.instance().setState({invoiceToUpdate:invoice, updateDueAmountModalVisible: true})
            expect(wrapper.state().invoiceToUpdate).toEqual(invoice);
            expect(wrapper.state().updateDueAmountModalVisible).toEqual(true);
            wrapper.instance().closeDeuAmountModal();
            expect(wrapper.state().invoiceToUpdate).toEqual('');
            expect(wrapper.state().updateDueAmountModalVisible).toEqual(false);


        })
    })


    describe ('setDueAmount()',()=>{
        it('should update the state:amount received , when  received amount is valid',()=>{
            wrapper.instance().setDueAmount(1000,2000);
            expect(wrapper.state().amountReceived).toBe(1000)
        })

        it('should invoke the alert() when received a null value for amount',()=>{
            Alert.alert = jest.fn()
            wrapper.instance().setDueAmount(NaN,2000);
            expect(Alert.alert).toHaveBeenCalled();
        })

        it('should alert with a error message when received an amount greater than total amount',()=>{
            Alert.alert = jest.fn(()=>'Invalid input.Enter a number less than the due amount')
            wrapper.instance().setDueAmount(3000,2000);
            expect(Alert.alert).toHaveBeenCalled();
            expect(Alert.alert.mock.calls[0][0]).toEqual('Invalid input.Enter a number less than the due amount')
        })


    })

})
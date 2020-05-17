import React, { Component } from 'react';
import { StyleSheet, View, ScrollView,Text,  Alert,TouchableOpacity,Modal,TouchableHighlight} from 'react-native';
import {Button,Input} from 'react-native-elements';
import { Table, TableWrapper, Row, Cell } from 'react-native-table-component';
const axios = require('axios');

export default class SalesDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableHead: ['Invoice No.', 'Date', 'Total', 'Due Amount'],
      tableData: [],

      updateDueAmountModalVisible :false,
      invoiceToUpdate:'',
      amountReceived : 0,
      onceFetched:false
    }
  }

   componentDidMount(){
      this.getInvoiceDetails();

   }

   getInvoiceDetails=()=>{
         this.setState({onceFetched:true});
         axios.post("https://se-smartpos-backend.herokuapp.com/invoice/viewallinvoices",
         {shop_id:14})
        .then( (response)=> {
            if (response.data.success){
               let invoices=[]
               response.data.data.map((invoice)=>{
                    invoices.push({
                        id : invoice.invoice_id ,
                        date : invoice.issued_date,
                        total : invoice.invoice_value,
                        due : (invoice.invoice_value-invoice.paid_amount)
                    });
               });
               var sorted = invoices.sort(function IHaveAName(a, b) {
                   return b.id < a.id ?  1
                        : b.id > a.id ? -1
                        : 0;
               });
               this.setState({tableData: sorted});
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    };


    updateDatabasePaidAmount=(invoice_id,amountReceived)=>{
        axios.put("https://se-smartpos-backend.herokuapp.com/invoice/updateinvoicepaidamount",
        {"amount_received": amountReceived,
         "invoice_id" : invoice_id
        })
        .then( (response)=> {
            if (response.data.success){
                this.setState(state => {
                    const list = state.tableData.map((invoice, j)  => {
                        if (invoice.id === this.state.invoiceToUpdate.id && this.state.amountReceived<=invoice.due) {
                            const due_amount = invoice.due;
                            invoice['due']=due_amount-this.state.amountReceived;
                            return invoice;
                        } else {
                            return invoice;
                        }
                    });
                    return {list};
               },()=>{this.setState({amountReceived:0}); this.closeDeuAmountModal(); Alert.alert('Successfully Updated')});
            }else{
                this.setState({amountReceived:0});
                this.closeDeuAmountModal();
                Alert.alert('Error occured while updating. Try Again!');}
            })
        .catch(function (error) {
            console.log(error);
            this.setState({amountReceived:0});
            this.closeDeuAmountModal();
            Alert.alert('Error occured while updating. Try Again!');
        });
    };


  openDueAmountModal=(invoice)=>{
    this.setState({invoiceToUpdate:invoice,updateDueAmountModalVisible:true});
  };

  closeDeuAmountModal=()=>{
    this.setState({updateDueAmountModalVisible:false,invoiceToUpdate:''});
  };

  updateDueAmount= async ()=>{
    const isSuccess = await this.updateDatabasePaidAmount(this.state.invoiceToUpdate.id,this.state.amountReceived);
    console.log(isSuccess)
    console.log('hghfhd')
    if (!isSuccess){
        this.setState({amountReceived:0});
        this.closeDeuAmountModal();
        Alert.alert('Error occured while updating. Try Again!')
        return;
    };
    this.setState(state => {
          const list = state.tableData.map((invoice, j)  => {
            if (invoice.id === this.state.invoiceToUpdate.id && this.state.amountReceived<=invoice.due) {
              const due_amount = invoice.due;
              invoice['due']=due_amount-this.state.amountReceived;
              return invoice;
            } else {
              return invoice;
            }
          });
          return {
            list,
          };
        },()=>{this.setState({amountReceived:0}); this.closeDeuAmountModal(); Alert.alert('Successfully Updated')});
  }

  setDueAmount=(amount,total_amount)=>{
    if (~isNaN(amount) && amount<=total_amount){
        this.setState({amountReceived:amount});
    }else{
        Alert.alert('Invalid input.Enter a number less than the due amount')
    }
  }

  render() {
    const state = this.state;

    if (! state.onceFetched){
        return(
            <View style={{flex: 1,alignItems: 'center',justifyContent: 'center',}} >
                  <Text style={{fontWeight:'bold',fontSize:32}}> Loading... </Text>
            </View>);
    };

    if (state.tableData.length==0 ){
        return(
            <View style={{flex: 1,alignItems: 'center',justifyContent: 'center',}} >
                  <Text style={{fontWeight:'bold',fontSize:20}}> No sales are recorded. </Text>
            </View>);
    };

    const element = (invoice_index,invoice) => {
        if (invoice.due == 0 ){
            return(
                <Button title='Paid'buttonStyle={{alignItems: 'center',backgroundColor: '#0a5a00',padding: 2,marginTop: 1,}} titleStyle={{color:'#fff',fontWeight:'100'}}/>
            );
        }else{
            return (
                <TouchableOpacity key={invoice_index} style={{alignItems: 'center',backgroundColor: '#af0810',padding:5 ,marginTop: 1,borderRadius:3}}
                onPress={()=>{this.openDueAmountModal(invoice)}}>
                     <Text style={{color: '#fff' ,fontWeight:'bold'}} >{'Rs. '+invoice.due}</Text>
                </TouchableOpacity>
            );
        }};

    return (

        // Return a table with available products in the stock in hand

      <ScrollView style={styles.container}>
        <Table borderStyle={{borderColor: 'transparent'}}>
          <Row data={state.tableHead} style={styles.head} textStyle={styles.textHeader}/>
          {
            state.tableData.map((rowData, index) => (
              <TableWrapper key={index} style={styles.row}>
                <Cell key={0} data={rowData.id} textStyle={styles.text}/>
                <Cell key={1} data={rowData.date} textStyle={styles.text}/>
                <Cell key={2} data={'Rs. '+rowData.total } textStyle={styles.text}/>
                <Cell key={3} data={element(index,rowData)} />
              </TableWrapper>
            ))
          }
        </Table>

        <Modal animationType="fade" transparent={true} visible={state.updateDueAmountModalVisible}>
                             <View style={modalstyles.centeredView}>
                               <View style={modalstyles.modalView}>
                                 <Text style={modalstyles.modalText}>Invoice Id : {state.invoiceToUpdate.id} </Text>
                                 <Text style={modalstyles.modalText}>Due Amount : Rs. {state.invoiceToUpdate.due} </Text>
                                 <Input
                                   placeholder='  Amount Received'
                                   errorStyle={{ color: 'red' ,textAlign:'center'}}
                                   errorMessage='Update cannot be rolled back'
                                   onChangeText ={(amount)=>{this.setDueAmount(amount,state.invoiceToUpdate.due)}}
                                 />

                                 <Button title='Update' buttonStyle={{...modalstyles.openButton , backgroundColor:"#af0810"}}  onPress={()=>{this.updateDatabasePaidAmount(this.state.invoiceToUpdate.id,this.state.amountReceived)}}/>
                                 <Button title = 'Cancel'  buttonStyle={modalstyles.openButton} onPress={() => {this.closeDeuAmountModal();}}/>


                               </View>
                             </View>
                          </Modal>
    </ScrollView>

       )}}


const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 25, backgroundColor: '#fff' },
  head: { height: 40, backgroundColor: '#2c3033' },
  textHeader :{margin:7,color:'#fff'},
  text: { margin: 7 },
  textTotal : {margin:10 , fontWeight:"bold"},
  row: { flexDirection: 'row', backgroundColor: '#eeeeee' },

});




const modalstyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 10,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",

    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  openButton: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    margin:8,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
});


import React, { Component } from 'react';
import { StyleSheet, View, ScrollView,Text,  Alert,TouchableOpacity,Modal,TouchableHighlight} from 'react-native';
import {Button,Input} from 'react-native-elements';
import { Table, TableWrapper, Row, Cell } from 'react-native-table-component';

export default class SalesDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableHead: ['Invoice No.', 'Date', 'Total', 'Due Amount'],
      tableData: [
        {id:'00001',date:'1/4/2020', total:20000, due:0},
        {id:'00002',date:'2/4/2020', total:10000, due:0},
        {id:'00005',date:'7/4/2020', total:5000, due:0},
        {id:'00008',date:'9/4/2020', total:15000, due:10000},
        {id:'00010',date:'10/4/2020', total:20000, due:0},
        {id:'00020',date:'12/4/2020', total:15000, due:1000},
        {id:'00022',date:'15/4/2020', total:10000, due:8000},
        {id:'00029',date:'20/4/2020', total:5000, due:2500},
      ],
      updateDueAmountModalVisible :false,
      invoiceToUpdate:'',
      amountReceived : 0
    }
  }

  openDueAmountModal(invoice){
    this.setState({invoiceToUpdate:invoice,updateDueAmountModalVisible:true});
  };

  closeDeuAmountModal(){
    this.setState({updateDueAmountModalVisible:false,invoiceToUpdate:''});
  };

  updateDueAmount(){
    this.setState(state => {
          const list = state.tableData.map((invoice, j) => {
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

  setDueAmount(amount,total_amount){
    if (~isNaN(amount) && amount<=total_amount){
        this.setState({amountReceived:amount});
    }else{
        Alert.alert('Invalid input.Enter a number less than the due amount')
    }
  }

  render() {
    const state = this.state;
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

                <Button title='Update' buttonStyle={{...modalstyles.openButton , backgroundColor:"#af0810"}}  onPress={()=>{this.updateDueAmount()}}/>
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


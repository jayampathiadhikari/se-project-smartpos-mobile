
import React, { Component } from 'react';
import { StyleSheet, ScrollView,View, Text, Alert ,Modal,TouchableHighlight} from 'react-native';
import {Button } from 'react-native-elements';
import { Table, TableWrapper, Row, Cell } from 'react-native-table-component';
import Invoice from '../components/invoice.js';
const axios = require('axios');

export default class SalesDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tableHead:['Name','Price','Quantity',''],
            tableData: [],
            total:0,
            modalVisible:false,
            onceFetched:false
        }
    }


    componentDidMount(){
        this.getStockDetails();

    }

    getStockDetails=()=>{
        this.setState({onceFetched:true});
        axios.post("https://se-smartpos-backend.herokuapp.com/stock/viewsalespersonstock",
        {salesperson_id:'W9FfmzqWI6QZjGWpRnZOpBhwGM02'})
        .then( (response)=> {
            if (response.data.success){
            let products=[]
            response.data.data.map((product)=>{
                products.push({
                    id : product.product_id ,
                    name : product.name,
                    price : product.unit_price,
                    quantityInStock : product.quantity,
                    quantity :0
               });
            });
            this.setState({tableData: products});
            }
        })
       .catch(function (error) {
            console.log(error);
        });
    };

    generateInvoice=()=>{
        let productsList=[];
        this.state.tableData.map((product)=>{
            if (product.quantity!=0){
                productsList.push({product_id:product.id,quantity:product.quantity});
            }
        });
        console.log(productsList);
        axios.post("https://se-smartpos-backend.herokuapp.com/invoice/generateInvoice",
        {salesperson_id:'W9FfmzqWI6QZjGWpRnZOpBhwGM02',shop_id : 14,products:JSON.stringify(productsList) })
        .then( (response)=> {
        console.log(response);
            if (response.data.success){
                Alert.alert('Invoice Successfully Generated');
                this.getStockDetails();
                this.setQuantityToZero();
            };
            Alert.alert('Error occured while generation invoice.Try Again!');
        })
        .catch(function (error) {
            console.log(error);
            Alert.alert('Error occured while generation invoice.Try Again!');

        });
    };

    incrementQuantity = (i) => {
        this.setState(state => {
            const list = state.tableData.map((item, j) => {
            if (j === i) {
                const pre_quantity=item.quantity ;
                if (pre_quantity+1>item.quantityInStock){
                    Alert.alert('Maximum limit of item : '+item.name+' has reached')
                    return item;
                }
                delete item.quantity;
                item['quantity']=pre_quantity+1 ;
                return item;
            } else {
                return item;
            }
            });
            return {list};
        },()=>{this.setState({total:this.calTotal()})});
    };

    decrementQuantity = (i) => {

        this.setState(state => {
            const list = state.tableData.map((item, j) => {
                if (j === i && item.quantity!=0) {
                    const pre_quantity=item.quantity;
                    delete item.quantity;
                    item['quantity']=pre_quantity-1;
                    return item;
                } else {
                    return item;
                }
            });
            return {list};
        },()=>{this.setState({total:this.calTotal()})})
    };

    calTotal= ()=> {
        var t=0;
        this.state.tableData.map((item) => {
            t+=item.price*item.quantity;
        });
        return t;
    }

    openModal=()=>{
        if(this.state.total==0){
            Alert.alert('No items added to the invoice')
        }else{
            this.setState({modalVisible:true});
        }
    }

    closeModal=()=>{
        this.setState({modalVisible:false});
    }

    calAmount=(index)=>{
        let item = this.state.tableData[index]
        return item.price * item.quantity;
    }

    setQuantityToZero=()=>{
        this.setState(state => {
            const list = state.tableData.map((item, j) => {
            item.quantity=0;
            return item
            });
            return {list};
        },()=>{this.setState({modalVisible:false,total:0})})
    }


  render() {

    const state = this.state;

    if (state.tableData.length==0 ){
       return(
           <View style={{padding:20,flex: 1, alignItems: 'center',justifyContent: 'center'}}>
               <Text style={{marginVertical: 4,fontSize:16,textAlign :'center',marginVertical:10}}>No products available in the stock</Text>
           </View>)
    }


    const element = (item_index) => (
    <View style={{flex:1, flexDirection:'row' , textAlign:'center'}}>
      <Button title='  +  ' buttonStyle={{margin:2,marginTop:5, padding:3,backgroundColor:"#053d6e"}} onPress={()=>{this.incrementQuantity(item_index)}}/>
      <Button title='  -  ' buttonStyle={{margin:2 ,marginTop:5,padding:3, backgroundColor:"#af0810"}} onPress={()=>{this.decrementQuantity(item_index)}}/>
      </View>
    );

    return (

        // Return a table with available products in the stock in hand

      <ScrollView style={styles.container}>
        <Table borderStyle={{borderColor: 'transparent'}}>
          <Row data={state.tableHead} style={styles.head} textStyle={styles.textHeader}/>
          {
            state.tableData.map((rowData, index) => (
              <TableWrapper key={index} style={styles.row}>
                <Cell key={0} data={rowData.name} textStyle={styles.text}/>
                <Cell key={1} data={'Rs. '+rowData.price} textStyle={styles.text}/>
                <Cell key={2} data={rowData.quantity } textStyle={styles.text}/>
                <Cell key={3} data={element(index)} textStyle={styles.text}/>
              </TableWrapper>
            ))
          }
        </Table>
        <Text style={styles.textTotal}> Total :  Rs.{state.total}</Text>
        <Button title="Generate Invoice" buttonStyle={{borderRadius:5 ,marginBottom:40 , backgroundColor:"#053d6e"}} onPress={()=>{this.openModal()}} />

        <Modal
                animationType="slide"
                transparent={false}
                visible={state.modalVisible}
              >
                <View style={modalstyles.centeredView}>
                  <View >

                    <Invoice data={state.tableData }/>

                    <Button title="Confirm" buttonStyle={{borderRadius:5 ,marginBottom:40 , backgroundColor:"#053d6e"}} onPress={()=>{this.generateInvoice()}}/>

                    <Button title="Cancel" buttonStyle={{borderRadius:5 ,marginBottom:40 , backgroundColor:"#053d6e"}} onPress={() => {this.closeModal(); }}/>

                  </View>
                </View>
              </Modal>



      </ScrollView>






    )
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 25, backgroundColor: '#fff' },
  head: { height: 40, backgroundColor: '#2c3033' },
  textHeader :{margin:7,color:'#fff'},
  text: { margin: 7 },
  textTotal : {margin:10 , fontWeight:"bold"},
  row: { flexDirection: 'row', backgroundColor: '#eeeeee' ,height : 50},
});

const modalstyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
//    alignItems: "center",
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
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
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


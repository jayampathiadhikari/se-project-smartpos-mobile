import React,{Component} from 'react';
import {View,Text,ScrollView} from 'react-native';
import { DataTable } from 'react-native-paper';
const axios = require('axios');

export default class StockScreen extends Component {

   state = {
        onceFetched:false,
        products: [],
        total:0,

   };

   componentDidMount(){
    this.getStockDetails();
    this.interval = setInterval(this.getStockDetails, 20000);

   }

   getStockDetails=()=>{
       this.setState({onceFetched:true});
       axios.post("https://se-smartpos-backend.herokuapp.com/stock/viewsalespersonstock",
       {salesperson_id:'W9FfmzqWI6QZjGWpRnZOpBhwGM02'})
      .then( (response)=> {
          if (response.data.success){
             this.setState({products: response.data.data});
          }
      })
      .catch(function (error) {
          console.log(error);
      });
   };

   componentWillUnmount() {
//       clearInterval(this.intervalID);
   }


  render() {
    if (! this.state.onceFetched){
          return(
              <View style={{flex: 1,alignItems: 'center',justifyContent: 'center',}} >
                    <Text style={{fontWeight:'bold',fontSize:32}}> Loading... </Text>
              </View>);
    }

    if (this.state.products.length==0 ){
        return(
            <View style={{padding:20,flex: 1, alignItems: 'center',justifyContent: 'center'}}>
                <Text style={{fontWeight: "bold",marginVertical: 4,fontSize:20,textAlign :'center',marginVertical:20}}>Stock In Hand</Text>
                <Text style={{marginVertical: 4,fontSize:16,textAlign :'center',marginVertical:10}}>No products available in the stock</Text>
            </View>)
    }

    return (
      <View style={{padding:20}}>
      <Text style={{fontWeight: "bold",marginVertical: 4,fontSize:20,textAlign :'center',marginVertical:20}}>Stock In Hand</Text>
      <DataTable>
        <DataTable.Header>
              <DataTable.Title>ID</DataTable.Title>
              <DataTable.Title >Name</DataTable.Title>
              <DataTable.Title >Unit Price</DataTable.Title>
              <DataTable.Title numeric>Quantity</DataTable.Title>
        </DataTable.Header>

        <ScrollView>
{
          this.state.products.map((item,index) => {
          return (
            <DataTable.Row key={item.product_id}>
              <DataTable.Cell>
                {item.product_id}
              </DataTable.Cell>
              <DataTable.Cell >
                {item.name}
              </DataTable.Cell>
              <DataTable.Cell >
                  {'Rs. '+item.unit_price}
                </DataTable.Cell>
              <DataTable.Cell numeric>
                {item.quantity}
              </DataTable.Cell>

            </DataTable.Row>
        )})}

        </ScrollView>
      </DataTable>
      </View>
    );
  }
}

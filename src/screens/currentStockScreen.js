import React,{Component} from 'react';
import {View, Text, ScrollView} from 'react-native';
import {Button,Card} from 'react-native-elements';
const axios = require('axios');

export default class StockScreen extends Component {

   state = {
        onceFetched:false,
        products: [],
        total:0,

   };

   componentDidMount(){
    this.getStockDetails();
    // this.interval = setInterval(this.getStockDetails, 20000);

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

    if (this.state.products.length===0 ){
        return(
            <View style={{padding:20,flex: 1, alignItems: 'center',justifyContent: 'center'}}>
                <Text style={{fontWeight: "bold",fontSize:20,textAlign :'center',marginVertical:20}}>Stock In Hand</Text>
                <Text style={{fontSize:16,textAlign :'center',marginVertical:10}}>No products available in the stock</Text>
                <Button title='Refresh' buttonStyle={{padding: 5,marginTop: 10,borderRadius:5 ,marginBottom:40}} onPress={()=>{this.getStockDetails()}}/>
            </View>)
    }

    return (
      <ScrollView style={{padding:20}}>
      <Text style={{fontWeight: "bold",fontSize:20,textAlign :'center',marginVertical:20,color:'#1F5EC6'}}>STOCK IN HAND</Text>
          <Card title="Details of the products">
              {
                  this.state.products.map((product,i) => {
                      return (
                          <View key={i} >
                              <Text style={{fontWeight: "bold",fontSize:15,marginTop:15}}>{product.name}</Text>
                              <Text>    ID               : {product.product_id}</Text>
                              <Text>    Unit Price : Rs.{product.unit_price}</Text>
                              <Text>    Quantity   : {product.quantity}</Text>
                          </View>
                      );
                  })
              }
          </Card>
          <Button title='Refresh' buttonStyle={{marginTop:20,marginBottom:20,borderRadius:6,backgroundColor:'#4D4E50'}} onPress={()=>{this.getStockDetails()}}/>
      </ScrollView>
    );
  }
}

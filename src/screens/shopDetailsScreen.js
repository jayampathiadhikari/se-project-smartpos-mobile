import React,{Component} from 'react';
import {View,Text} from 'react-native';
const axios = require('axios');


export default class ShopDetailsScreen extends React.Component {

   state={
    shopDetails :{}
   }

   componentDidMount(){
       this.getShopDetails();
   };

   getShopDetails=()=>{
          axios.post("https://se-smartpos-backend.herokuapp.com/shop/viewshopdetails",
          {shop_id:14})
         .then( (response)=> {
             if (response.data.success){
                this.setState({shopDetails: response.data.data});
             }
         })
         .catch(function (error) {
             console.log(error);
         });
      };

   render() {
        const  state = this.state;

        if (Object.keys(state.shopDetails).length==0){
        return (
            <View style={{flex: 1,alignItems: 'center',justifyContent: 'center',}} >
                  <Text style={{fontWeight:'bold',fontSize:32}}> Loading... </Text>
            </View>);
        }

        return (

            <View style={{flex: 1,alignItems: 'center',justifyContent: 'center',}} >
                      <Text style={{fontWeight:'bold',fontSize:32}}> {state.shopDetails.shop_name.toUpperCase()} </Text>
                      <Text style={{fontWeight:'bold',fontSize:18,marginTop:50}}>Owner name : </Text>
                      <Text style={{fontWeight:'bold',fontSize:20,marginTop:0 , color:'#063580'}}>{state.shopDetails.owner_name}</Text>
                      <Text style={{fontWeight:'bold',fontSize:18,marginTop:12}}>Contact Number (Owner) : </Text>
                      <Text style={{fontWeight:'bold',fontSize:20,marginTop:0, color:'#063580'}}>{state.shopDetails.owner_cell_num}</Text>
                      <Text style={{fontWeight:'bold',fontSize:20,marginTop:0, color:'#063580'}}>{state.shopDetails.owner_land_num}</Text>
                      <Text style={{fontWeight:'bold',fontSize:18,marginTop:12}}>Contact Number (Shop)  : </Text>
                      <Text style={{fontWeight:'bold',fontSize:20,marginTop:0, color:'#063580'}}>{state.shopDetails.shop_contact_num}</Text>
            </View>
        );
  }
}
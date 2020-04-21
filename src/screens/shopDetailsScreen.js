import React,{Component} from 'react';
import {View,Text} from 'react-native';


export default class ShopDetailsScreen extends React.Component {

    constructor(props){
        super(props);
        this.state={
            shop_name:'House of Hidayath',
            owner_name:'M.A.M. Wickramarachchi',
            contact_num_owner : '0770250501',
            contact_num_shop : '912245300'
        }
    }

  render() {
   const  state = this.state;
    return (

        <View style={{flex: 1,alignItems: 'center',justifyContent: 'center',}} >
                  <Text style={{fontWeight:'bold',fontSize:32}}> {state.shop_name} </Text>
                  <Text style={{fontWeight:'bold',fontSize:18,marginTop:50}}>Owner name : </Text>
                  <Text style={{fontWeight:'bold',fontSize:20,marginTop:0 , color:'#063580'}}>{state.owner_name}</Text>
                  <Text style={{fontWeight:'bold',fontSize:18,marginTop:12}}>Contact Number (Owner) : </Text>
                  <Text style={{fontWeight:'bold',fontSize:20,marginTop:0, color:'#063580'}}>{state.contact_num_owner}</Text>
                  <Text style={{fontWeight:'bold',fontSize:18,marginTop:12}}>Contact Number (Shop)  : </Text>
                  <Text style={{fontWeight:'bold',fontSize:20,marginTop:0, color:'#063580'}}>{state.contact_num_shop}</Text>
        </View>
    );
  }
}
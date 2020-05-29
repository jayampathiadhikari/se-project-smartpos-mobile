import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {LinearGradient} from "expo-linear-gradient";
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
          {shop_id:this.props.navigation.getParam('shop_id')})
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

        if (Object.keys(state.shopDetails).length===0){
        return (
            <View style={{flex: 1,alignItems: 'center',justifyContent: 'center',}} >
                  <Text style={{fontWeight:'bold',fontSize:20}}> Loading... </Text>
            </View>);
        }

        return (
            <View style={styles.root} >
                <LinearGradient
                    colors={["#0033ff","#6bc1ff"]}
                    style={{height:"20%"}}
                />
                <View style={styles.imageContainer}>
                    <Image style={styles.image} source={ require('../assets/logo-pos-600.png')  }/>
                </View>

                <View style={styles.textContainer} >
                          <Text style={styles.textHeading}> {state.shopDetails.shop_name.toUpperCase()} </Text>
                          <Text style={{...styles.textCategory,marginTop:50}}>Owner name : </Text>
                          <Text style={{...styles.textContent,marginTop:0 }}>{state.shopDetails.owner_name}</Text>
                          <Text style={{...styles.textCategory,marginTop:12}}>Contact Number (Owner) : </Text>
                          <Text style={{...styles.textContent,marginTop:0}}>{state.shopDetails.owner_cell_num}</Text>
                          <Text style={{...styles.textContent,marginTop:0}}>{state.shopDetails.owner_land_num}</Text>
                          <Text style={{...styles.textCategory,marginTop:12}}>Contact Number (Shop)  : </Text>
                          <Text style={{...styles.textContent,marginTop:0}}>{state.shopDetails.shop_contact_num}</Text>
                </View>

            </View>
        );
  }
}

const styles = StyleSheet.create({
    root:{
        flex:1
    },
    image:{
        width:230,
        height:230,
        borderRadius:70,
        marginTop:-100
    },
    imageContainer:{
        alignItems:"center"
    },
    textContainer:{
        alignItems:"center"
    },
    textHeading :{
        marginTop:-40,
        fontWeight:'bold',
        fontSize:25
    },
    textCategory:{
        fontWeight:'bold',
        fontSize:18
    },
    textContent:{
        fontWeight:'bold',
        fontSize:20,
        color:'#063580'
    }
});

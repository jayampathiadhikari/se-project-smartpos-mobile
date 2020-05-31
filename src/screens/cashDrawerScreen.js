import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {Button} from 'react-native-elements';
import {LinearGradient} from "expo-linear-gradient";
const axios = require('axios');

export default class cashDrawersScreen extends React.Component {

    state ={
        dueAmount : 0
    };


    componentDidMount(){
        this.getInvoiceDetails();
        this.interval = setInterval(this.getInvoiceDetails, 10000);
    };

    getInvoiceDetails=()=>{
             axios.post("https://se-smartpos-backend.herokuapp.com/invoice/viewallinvoices",
             {shop_id:this.props.navigation.getParam('shop_id')})
            .then( (response)=> {
                if (response.data.success){
                   let amount=0
                   response.data.data.map((invoice)=>{
                        amount+=invoice.invoice_value-invoice.paid_amount;
                   });
                   this.setState({dueAmount: amount});
                }

            })
            .catch(function (error) {
                console.log(error);
            });
     };

    componentWillUnmount() {
           clearInterval(this.intervalID);
       }

  render() {
    const state=this.state;
    const element = ()=>{
         if (this.state.dueAmount === 0 ){
            return <Button title={'Rs. '+state.dueAmount} buttonStyle={{...styles.button,backgroundColor: '#0a5a00' }} titleStyle={styles.buttonText} onPress={()=>{}}/>
         }else{
            return <Button title={'Rs. '+state.dueAmount} buttonStyle={{...styles.button,backgroundColor: '#af0810'}} titleStyle={styles.buttonText} onPress={()=>{}} />

         }
    }


    return (
        <View style={styles.root} >
            <LinearGradient
                colors={["#000000","#DCDCDC"]}
                style={{height:120}}
            />
            <View style={styles.imageContainer}>
                <Image style={styles.image} source={ require('../assets/cashDrawer.png')  }/>
            </View>
            <View style={styles.textConatiner} >
              <Text style={styles.text}>Total Due Amount  : </Text>
              {element()}
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
        width:220,
        height:220,
        borderRadius:70,
        marginTop:-70
    },
    imageContainer:{
        alignItems:"center"
    },
    textConatiner:{
        alignItems: 'center',
        justifyContent: 'center'
    },
    text:{
        fontWeight:'bold',
        fontSize:20
    },
    button:{
        alignItems: 'center',
        padding: 15,
        width:200,
        marginTop: 15
    },
    buttonText:{
         color:'#fff',
         fontWeight:'100' ,
         fontSize: 20
    }
})
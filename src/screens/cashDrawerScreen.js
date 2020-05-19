import React from 'react';
import {View,Text} from 'react-native';
import {Button} from 'react-native-elements';
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
            return <Button title={'Rs. '+state.dueAmount} buttonStyle={{alignItems: 'center',backgroundColor: '#0a5a00' ,padding: 15,width:200, marginTop: 15}} titleStyle={{color:'#fff',fontWeight:'100' ,fontSize: 20}} onPress={()=>{}}/>
         }else{
            return <Button title={'Rs. '+state.dueAmount} buttonStyle={{alignItems: 'center',backgroundColor: '#af0810' ,padding: 15,width:200, marginTop: 15}} titleStyle={{color:'#fff',fontWeight:'100' ,fontSize: 20}} onPress={()=>{}} />

         }
    }


    return (
        <View style={{flex: 1,alignItems: 'center',justifyContent: 'center'}} >
          <Text style={{fontWeight:'bold',fontSize:20}}>Total Due Amount  : </Text>
          {element()}
        </View>
    );
  }
}
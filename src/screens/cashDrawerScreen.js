import React,{Component} from 'react';
import {View,Text,TouchableOpacity} from 'react-native';
import {Button} from 'react-native-elements';

export default class cashDrawersScreen extends React.Component {

  constructor(props){
    super(props);
    this.state ={
        dueAmount : 100
    }
  }

  render() {
    const state=this.state;
    const element = ()=>{
         if (this.state.dueAmount == 0 ){
            return <Button title={'Rs. '+state.dueAmount} buttonStyle={{alignItems: 'center',backgroundColor: '#0a5a00' ,padding: 15,width:200, marginTop: 15}} titleStyle={{color:'#fff',fontWeight:'100' ,fontSize: 20}}/>
         }else{
            return <Button title={'Rs. '+state.dueAmount} buttonStyle={{alignItems: 'center',backgroundColor: '#af0810' ,padding: 15,width:200, marginTop: 15}} titleStyle={{color:'#fff',fontWeight:'100' ,fontSize: 20}}/>

         }
    }


    return (
        <View style={{flex: 1,alignItems: 'center',justifyContent: 'center',}} >
          <Text style={{fontWeight:'bold',fontSize:20}}>Total Due Amount  : </Text>
          {element()}
        </View>
    );
  }
}
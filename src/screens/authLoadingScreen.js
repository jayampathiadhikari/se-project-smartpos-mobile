import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';

class AuthLoadingScreen extends React.Component{
  constructor(props){
    super(props);
    this._bootstrapAsync();
  }
  _bootstrapAsync = () => {
    if(true){
      this.props.navigation.navigate('Login')
    }else{
      this.props.navigation.navigate('Home')
    }
  }
  render(){
    return(null)
  }
}

export default AuthLoadingScreen;
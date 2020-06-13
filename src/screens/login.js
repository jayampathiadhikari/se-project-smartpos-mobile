import React from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';
import { Input,Icon, Button, Image  } from 'react-native-elements';
import auth from '@react-native-firebase/auth';
import {connect} from "react-redux";
import {setUser,setToken} from "../store/reducers/authentication/action";
import {checkAuthentication,getToken} from "../Utils";
import axios from 'axios';

class Login extends React.Component{
  state = {
    email:'',
    password: ''
  };

  onPress = () => {
    if(this.checkForAuthentication(this.state.email, this.state.password)){
      this.props.navigation.navigate('Home')
    }
  };

  checkForAuthentication = async () => {
    console.log('AUTHENTICATION');
    try{
      // const user = await auth().signInWithEmailAndPassword(this.state.email,this.state.password)
      // const user = await auth().signInWithEmailAndPassword('salesp@mailcupp.com','Password123#')
      const res = await checkAuthentication('salesp3@mailcupp.com','Password123#');
      // const res = await checkAuthentication(this.state.email,this.state.password);
      console.log(res);
      if(res.success){
        this.props.setUser(res.user);
        const result = await getToken(res.user.uid);
        // console.log(result,'TOKEN RESULT')
        if(result.data.success) {
          this.props.setToken('Bearer ' + result.data.data[0].token);
          console.log(result, 'GET TOKEN');
          this.props.navigation.navigate('Home')
        }else{
          console.log('auth error');

        }
      }else{
      console.log('auth error');
    }
      // console.log(user.user)
      // if (user != null){
      //   this.props.setUser(user.user);
      //   this.props.navigation.navigate('Home')
      // }
    }catch(e){
      console.log(e)
    }
  };

  render(){
    return(
      <View style={styles.root}>
          <Image
            source={ require('../assets/logo-pos-600.png')  }
            style={{ width: 200, height: 200 }}
            PlaceholderContent={<ActivityIndicator />}
          />
          <Input
            placeholder='email'
            leftIcon={
              <Icon
                name='ios-person'
                type={"ionicon"}
                size={24}
                color='grey'
              />
            }
            value={this.state.email}
            leftIconContainerStyle={styles.iconContainer}
            inputStyle={{color:'grey'}}
            onChangeText={(text)=>{this.setState({email: text})}}
          />
          <Input
            placeholder='password'
            leftIcon={
              <Icon
                name='ios-key'
                type={"ionicon"}
                size={24}
                color='grey'
              />
            }
            secureTextEntry={true}
            leftIconContainerStyle={styles.iconContainer}
            inputStyle={{color:'grey'}}
            value = {this.state.password}
            onChangeText={(text)=>{this.setState({password: text})}}

          />
        <View style={styles.buttonWrapper}>
          <Button
            title="Login"
            icon={<Icon
              name='ios-unlock'
              type={"ionicon"}
              size={24}
              color='white'
            />}
            buttonStyle={styles.button}
            titleStyle={styles.title}
            onPress={this.checkForAuthentication}
            />
        </View>
      </View>
    )

  }
}

const mapStateToProps = (state) => ({

});

const bindAction = (dispatch) => ({
  setUser: (user) => dispatch(setUser(user)),
  setToken: (token) => dispatch(setToken((token)))
});

export default connect(
  mapStateToProps,
  bindAction
)(Login);




const styles =  StyleSheet.create({
  root: {
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  },
  iconContainer:{
    marginRight:10
  },
  buttonWrapper:{
    marginTop:50,
    marginBottom:100
  },
  button:{
    width:100,
  },
  title:{
    color:'white',
    marginLeft: 5
  }
});
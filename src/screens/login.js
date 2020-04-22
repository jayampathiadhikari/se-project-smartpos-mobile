import React from 'react';
import {View, StyleSheet, ActivityIndicator, Dimensions} from 'react-native';
import { Input,Icon, Button, Image  } from 'react-native-elements';


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
  checkForAuthentication = (email,pw) => {
    return true;
  }
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
            onPress={this.onPress}
            />
        </View>
      </View>
    )

  }
}

export default Login;
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
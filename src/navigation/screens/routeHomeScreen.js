import React,{Component} from 'react';
import {View,Text,Button} from 'react-native';


export default class RouteHomeScreen extends Component {

static navigationOptions  = ({navigation})=>{
    const{ params} = navigation.state;
    return {
        headerTitle: ' Route : '+navigation.getParam('route_name'),
        headerLeft: () => (
              <Button
                onPress={() => alert('This is a button!')}
                title="Info"
              />
            ),

    }
  };
  render() {
    return (
        <View >
          <Text>Route Home Screen</Text>
        </View>
    );
  }
}
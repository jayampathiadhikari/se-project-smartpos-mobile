import React,{Component} from 'react';
import {Button, Card} from 'react-native-elements';
import { Text, View, ScrollView,TouchableOpacity, StyleSheet } from 'react-native';
import {routes} from '../../constants/data.js'

export default class RoutesScreen extends Component {

  static navigationOptions  = ({navigation})=>{

      // const{ params} = navigation.state;
      return {
        title: 'List of Routes',
    };}


renderButtons() {
       return  routes.map((route) => {
                     return (

                     <TouchableOpacity
                                 style={styles.button}
                                 key={route.route_id}
//                                 onPress={() => this.props.navigation.navigate('')}>
                                   onPress= {() => this.props.navigation.navigate('Route',{route_id : route.route_id , route_name:route.route_name})}>
                                 <Text style={styles.text}>{'Day '+route.day +' :  '+route.route_name}</Text>

                               </TouchableOpacity>

                );})
}



  render() {
    return (
//      <View style={styles.MainContainer}>


        <ScrollView >
            <View style={styles.MainContainer}>
                < Text style={{ marginTop: 30, fontSize: 18 , fontFamily: 'Roboto'}}>The routes assigned to you .</Text>

                {this.renderButtons()}
                </View>
        </ScrollView>
  );}
}

const styles = StyleSheet.create({

  MainContainer: {

    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5fcff',
    padding: 11

  },

  button: {
    alignItems: 'center',
    backgroundColor: '#29a4e7',
    padding: 12,
    width: 280,
    marginTop: 12,
  },

  text: {
    fontSize: 16,
    color: '#fff'
  }

});


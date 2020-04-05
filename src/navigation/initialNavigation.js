/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */


import React,{Component} from 'react';
import {View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import routesScreen from './screens/routesScreen.js';
import homeScreen from './screens/homeScreen.js';
import currentStockScreen from './screens/currentStockScreen.js';
import userAccountScreen from './screens/userAccountScreen.js';
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
//import Icon from 'react-native-vector-icons/Ionicons';
//import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';


const TabNavigator= createBottomTabNavigator(
  {
    Home: {
        screen: homeScreen,
        navigationOptions:{
          tabBarLabel:'Home'
//          tabBarIcon:({tintColor})=>(
//              <Icon name="ios-home" color={tintColor} size={25}/>
//          )
        }
     },
    Routes: {
        screen: routesScreen,
        navigationOptions:{
           tabBarLabel:'Routes'
//           tabBarIcon:({tintColor})=>(
//               <Icon name="ios-home" color={tintColor} size={25}/>
//           )
         }
    },
    Stock: { screen: currentStockScreen },
    Account: { screen: userAccountScreen },
  },
  {
    initialRouteName: 'Home',
    activeColor: '#f0edf6',
    inactiveColor: '#3e2465',
    barStyle: { backgroundColor: '#694fad' },
  }
);

const AppContainer = createAppContainer(TabNavigator);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}
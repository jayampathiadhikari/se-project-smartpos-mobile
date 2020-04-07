/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */


import React,{Component} from 'react';
import {View} from 'react-native';
import routesScreen from '../screens/routesScreen.js';
import homeScreen from '../screens/homeScreen.js';
import currentStockScreen from '../screens/currentStockScreen.js';
import userAccountScreen from '../screens/userAccountScreen.js';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Icon from 'react-native-vector-icons/Ionicons';


const TabNavigator= createBottomTabNavigator(
  {
    Home: {
        screen: homeScreen,
        navigationOptions:{
          tabBarLabel:'Home',
          tabBarIcon:({tintColor})=>(
              <Icon name="ios-home" color={tintColor} size={25}/>
          )
        }
     },
    Routes: {
        screen: routesScreen,
        navigationOptions:{
          tabBarLabel:'Routes',
          tabBarIcon:({tintColor})=>(
              <Icon name="md-map" color={tintColor} size={25}/>
          )
        }
    },
    Stock: {
        screen: currentStockScreen ,
        navigationOptions:{
          tabBarLabel:'Stock',
          tabBarIcon:({tintColor})=>(
              <Icon name="ios-cart" color={tintColor} size={25}/>
          )
        }
    },
    Account: {
        screen: userAccountScreen,
         navigationOptions:{
           tabBarLabel:'Account',
           tabBarIcon:({tintColor})=>(
               <Icon name="ios-person" color={tintColor} size={25}/>
           )
         }
    },
  },
  {
    initialRouteName: 'Home',
    activeColor: '#f0edf6',
    inactiveColor: '#3e2465',
    barStyle: { backgroundColor: '#694fad' },
  }
);

const AppContainer = createAppContainer(TabNavigator);

export default class Navigation extends Component {
  render() {
    return <AppContainer />;
  }
}
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */


import React, {Component} from 'react';
import {Dimensions, TouchableHighlight, View} from 'react-native';
import routesListScreen from '../screens/routesListScreen.js';
import routeHomeScreen from '../screens/routeHomeScreen.js';
import homeScreen from '../screens/homeScreen.js';
import currentStockScreen from '../screens/currentStockScreen.js';
import map from '../screens/map.js';
import userAccountScreen from '../screens/userAccountScreen.js';
import salesDetailsScreen from '../screens/salesDetailsScreen.js';
import shopDetailsScreen from '../screens/shopDetailsScreen.js';
import cashDrawerScreen from '../screens/cashDrawerScreen.js';
import generateInvoiceScreen from '../screens/generateInvoiceScreen.js';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {createStackNavigator} from 'react-navigation-stack';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import DrawerMenu from '../navigation/drawerMenu';
import FlyTo from "../screens/FlyTo";
import {createDrawerNavigator} from "react-navigation-drawer";
import loginScreen from "../screens/login";
import authLoadingScreen from "../screens/authLoadingScreen";

const shopTopNavigator = createMaterialTopTabNavigator({
  Details: {
    screen: shopDetailsScreen,
    navigationOptions: {
      title: 'Details',
    },
  },
  Sales: {
    screen: salesDetailsScreen,
    navigationOptions: {
      title: 'Sales',
    },
  },
  New_Invoice: {
    screen: generateInvoiceScreen,
    navigationOptions: {
      title: 'New Invoice',
    },
  },
  Cash_drawer: {
    screen: cashDrawerScreen,
    navigationOptions: {
      title: 'Cash Drawer',
    },
  }
}, {
  tabBarOptions: {indicatorStyle: {backgroundColor: "#ffffff"}}
//defaultNavigationOptions:{
//    activeColor: '#f0edf6',
//            inactiveColor: '#3e2465',
//            barStyle: { backgroundColor: '#694fad' },
//
//}

});

const DrawerNav = createDrawerNavigator({
    Map: routeHomeScreen
  },
  {
    initialRouteName: 'Map',
    contentComponent: props => <DrawerMenu {...props} />,
    edgeWidth: (Dimensions.get('window').width / 2),
  });


DrawerNav.navigationOptions = ({navigation}) => {
  const {params} = navigation.state;
  return {
    headerTitle: navigation.getParam('route_name'),
    headerRight: () => (
      <View style={{right: 20}}>
        <TouchableHighlight
          onPress={() => {navigation.toggleDrawer();}}
          style={{width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center'}}
          underlayColor={'rgba(214,214,214,0.27)'} activeOpacity={1}>
          <Icon
            name="ios-menu"
            type='ionicon'
            color='#000000'
            size={32}
          />
        </TouchableHighlight>
      </View>
    ),
  }
};

const routesStackNavigator = createStackNavigator(
  {
    RoutesList: routesListScreen,
    Route: DrawerNav,
    ShopHome: shopTopNavigator,
  }, {
    initialRouteName: 'RoutesList',
    defaultNavigationOptions: {
      headerTitleAlign: 'center'
    }
  }
);


const TabNavigator = createBottomTabNavigator(
  {
    Home: {
      screen: homeScreen,
      navigationOptions: {
        tabBarLabel: 'Home',
        tabBarIcon: ({tintColor}) => (
          <Icon name="ios-home" color={tintColor} size={25}/>
        )
      }
    },
    Routes: {
      screen: routesStackNavigator,
      navigationOptions: {
        tabBarLabel: 'Routes',
        tabBarIcon: ({tintColor}) => (
          <Icon name="md-map" color={tintColor} size={25}/>
        )
      }
    },
    Stock: {
      screen: currentStockScreen,
      navigationOptions: {
        tabBarLabel: 'Stock',
        tabBarIcon: ({tintColor}) => (
          <Icon name="ios-cart" color={tintColor} size={25}/>
        )
      }
    },
    Account: {
      screen: userAccountScreen,
      navigationOptions: {
        tabBarLabel: 'Account',
        tabBarIcon: ({tintColor}) => (
          <Icon name="ios-person" type='ionicon' color={tintColor} size={25}/>
        )
      }
    },
  },
  {
    initialRouteName: 'Home',
    activeColor: '#f0edf6',
    inactiveColor: '#3e2465',
    barStyle: {backgroundColor: '#694fad'},
  }
);


const switchNav = createSwitchNavigator(
  {
    Auth: authLoadingScreen,
    Login: loginScreen,
    Home: TabNavigator,
  },{
    initialRouteName:'Auth'
  }
);

const AppContainer = createAppContainer(switchNav);

export default class Navigation extends Component {
  render() {
    return <AppContainer/>;
  }
}
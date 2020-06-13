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
import myAccountScreen from "../screens/myAccountScreen";
import othersAccountScreen from "../screens/othersAccountScreen";
import editAccountDetails from "../screens/editAccountDetails";
import othersAccountProfile from "../screens/othersAccountProfile";

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
  Cash_drawer: {
    screen: cashDrawerScreen,
    navigationOptions: {
      title: 'Cash Drawer',
    },
  },
  New_Invoice: {
    screen: generateInvoiceScreen,
    navigationOptions: {
      title: 'New Invoice',
    },
  }

},{
  defaultNavigationOptions: ({ navigation }) => {
    return {
      tabBarOptions:{
        style: {
          backgroundColor: 'black',
          elevation: 0, // remove shadow on Android
          shadowOpacity: 0, // remove shadow on iOS,
          borderWidth:1,
          borderColor:'#ccc'
        },
        labelStyle: {
          fontSize: 15,
          fontWeight : '700'
        }
      },
    };
  }
});

const accountTopNavigator = createMaterialTopTabNavigator({
  My_account: {
    screen: myAccountScreen,
    navigationOptions: {
      title: 'My Profile',
    },
  },
  Others_accounts: {
    screen: othersAccountScreen,
    navigationOptions: {
      title: 'Others details',
    },
  }
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
    ShopHome:{
      screen:shopTopNavigator,
      navigationOptions :({navigation})=>{
        return {headerTitle: navigation.getParam('shop_name').toUpperCase()}
      }

      }
      ,
  },
    {
    initialRouteName: 'RoutesList',
    defaultNavigationOptions: {
      headerTitleAlign: 'center'
    }
  }
);


const accountStackNavigator = createStackNavigator(
  {
    AccountHome: accountTopNavigator,
    EditAccount: editAccountDetails,
    ShowOthersAccount: othersAccountProfile,
  }, {
    initialRouteName: 'AccountHome',
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
      screen: accountStackNavigator,
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
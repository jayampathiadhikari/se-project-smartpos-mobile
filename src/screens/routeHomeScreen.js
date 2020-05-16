import React, {Component} from 'react';
import {View, ScrollView, Image} from 'react-native';
import {Icon, ListItem} from 'react-native-elements';
import Map from './map'
import {connect} from "react-redux";
import {setShopDetails} from "../store/reducers/ui/action";
import {getShopsInSelectedRoute} from "../Utils";

const list = [
  {
    shop_id: 1,
    shop_name: 'House of Hidayath',
  }, {
    shop_id: 2,
    shop_name: 'Arpico',
  }, {
    shop_id: 3,
    shop_name: 'Keels',
  }, {
    shop_id: 4,
    shop_name: 'Zementras',
  }, {
    shop_id: 5,
    shop_name: 'Wickrama Brothers',
  }, {
    shop_id: 6,
    shop_name: 'Hayleys',
  }
];

class RouteHomeScreen extends Component {
  componentDidMount = async () => {
    const route_id = this.props.navigation.getParam('route_id');
    const res = await getShopsInSelectedRoute(route_id);
    if(res.success){
      this.props.setShopDetails(res.data);
    }
    console.log(res,'ROUTE HOME SCREEN')
  };

  static navigationOptions = ({navigation}) => {
    const {params} = navigation.state;
    return {
      headerTitle: navigation.getParam('route_name'),
      headerRight: () => (
        <View style={{right: 20}}>
          <Icon
            name="ios-menu"
            type='ionicon'
            color='#000000'
            size={32}
            onPress={() => {
            }}
          />
        </View>
      ),
      drawerLockMode: 'locked-open'
    }
  };

  render() {
    return (
      <View style={{flex: 1, flexDirection: 'column'}}>
        <Map />
      </View>
    );
  }
}

const mapStateToProps = (state) => ({

});

const bindAction = (dispatch) => ({
  setShopDetails: (shopDetails) => dispatch(setShopDetails(shopDetails)),
});

export default connect(
  mapStateToProps,
  bindAction
)(RouteHomeScreen);
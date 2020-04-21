import React, {Component} from 'react';
import {View, Text, ScrollView, Image} from 'react-native';
import {Button, Icon, ListItem} from 'react-native-elements';


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

export default class RouteHomeScreen extends Component {

  static navigationOptions = ({navigation}) => {
    const {params} = navigation.state;
    return {
      headerTitle: navigation.getParam('route_name'),
      headerRight: () => (
        <View style={{right:20}}>
          <Icon
            name="ios-menu"
            type='ionicon'
            color='#000000'
            size={32}
            onPress={()=>{}}
          />
        </View>
      ),
    }
  };

  getShopsList = () => {
    return (
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        {list.map((item, i) =>
          (
            <ListItem
              key={i}
              title={item.shop_name}
              //                      chevronColor={'red'}
              chevron
              containerStyle={{
                backgroundColor: '#343740',
                margin: 5,
                borderTopLeftRadius: 3,
                borderTopRightRadius: 3,
              }}
              onPress={() => {
                this.props.navigation.navigate('ShopHome', {shop_id: item.shop_id, shop_name: item.shop_name});
              }}
              titleStyle={{color: 'white'}}
            />
          ),
        )}
      </ScrollView>
    );

  };

  render() {
    return (
      <View style={{flex: 1, flexDirection: 'column', padding: 10}}>
        <Image
          source={require('./map.jpg')}
          style={{width: 390, height: 300}}
        />
        {this.getShopsList()}
      </View>
    );
  }
}
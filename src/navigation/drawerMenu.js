import React from 'react';
import {ScrollView} from 'react-native';
import {ListItem} from 'react-native-elements';
import {connect} from "react-redux";
import {setShopDetails} from "../store/reducers/ui/action";


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

class DrawerMenu extends React.Component{
  componentDidMount(): void {
    console.log(this.props.shops,'SHOPS REDUX')
  }

  render(){
    return(
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        {this.props.shops.map((item, i) =>
          (
            <ListItem
              key={i}
              title={item.name}
              //                      chevronColor={'red'}
              chevron
              containerStyle={{
                backgroundColor: '#343740',
                margin: 5,
                borderTopLeftRadius: 3,
                borderTopRightRadius: 3,
              }}
              onPress={() => {
                this.props.navigation.navigate('ShopHome', {shop_id: item.shop_id, shop_name: item.name});
              }}
              titleStyle={{color: 'white'}}
            />
          ),
        )}
      </ScrollView>
    )
  }
}

const mapStateToProps = (state) => ({
  shops : state.uiReducer.shops,
});


const bindAction = (dispatch) => ({

});

export default connect(
  mapStateToProps,
  bindAction
)(DrawerMenu);
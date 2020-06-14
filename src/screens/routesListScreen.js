import React, {Component} from 'react';
import {Text, View, ScrollView, TouchableOpacity, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import {getRoutesForSalesperson} from "../Utils";



class RoutesScreen extends Component {
  state = {
      routes : []
  };

  componentDidMount = async () => {
    const res = await getRoutesForSalesperson(this.props.user.uid);
    if(res.success){
      const sortedRoutes = this.sortbyDayId(res.data)
      console.log(res.data);
      this.setState({
        routes: sortedRoutes
      });
    }else{
      console.log('ERROR FETCHING');
    }
  };

  sortbyDayId=(routes)=>{
      return routes.sort(function sortById(a, b) {
        return b.day_id < a.day_id ? 1
            : b.day_id > a.day_id ? -1
                : 0;
      });
  }
  static navigationOptions = ({navigation}) => {
    // const{ params} = navigation.state;
    return {
      title: 'List of Routes',
    };
  };

  renderButtons() {
    return this.state.routes.map((route) => {
      return (
        <TouchableOpacity style={styles.button} key={route.route_id}
                          onPress={() => this.props.navigation.navigate('Route', {
                            route_id: route.route_id,
                            route_name: route.route_name
                          })}>
          <Text style={styles.text}>{'Week ' + route.week + ' ('+route.day+') : ' + route.route_name}</Text>
        </TouchableOpacity>

      );
    })
  }


  render() {
    return (
      <ScrollView style={styles.ScrollView}>
        <View style={styles.MainContainer}>
          < Text style={{marginTop: 20, fontSize: 18, fontFamily: 'Roboto'}}>The routes assigned to you .</Text>
          {this.renderButtons()}
        </View>
      </ScrollView>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.AuthenticationReducer.user,
});

const bindAction = (dispatch) => ({

});

export default connect(
  mapStateToProps,
  bindAction
)(RoutesScreen);

const styles = StyleSheet.create({
  ScrollView:{
    backgroundColor: '#f5fcff',
  },
  MainContainer: {

    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5fcff',
    padding: 11

  },

  button: {
    alignItems: 'center',
    backgroundColor: '#474747',
    padding: 12,
    borderRadius: 5,
    width: 350,
    marginTop: 12,
  },

  text: {
    fontSize: 16,
    color: '#fff'
  }

});


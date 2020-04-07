import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import React , {Component} from 'react';
import { Image } from 'react-native-elements';
export default class HomeScreen extends Component {

//  static navigationOptions =
//    {
//      title: '',
//    };

  render() {
    return (
      <View style={styles.MainContainer}>

        <Text style={{ marginTop: 40, fontSize: 40 , fontFamily: 'Roboto'}}>ZENARUS</Text>

        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Image
              source={ require('./home2.jpg') }
              style={{ width: 400, height: 300 }}
            />

          <TouchableOpacity
            style={styles.button}
            onPress={() => this.props.navigation.navigate('')}>

            <Text style={styles.text}>View the Daily Target</Text>

          </TouchableOpacity>


        </View>

      </View>
    );
  }
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
    backgroundColor: '#43A047',
    padding: 12,
    width: 280,
    marginTop: 12,
  },

  text: {

    color: '#fff'
  }

});
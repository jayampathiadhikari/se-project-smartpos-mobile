import React , {Component} from 'react';
import { Text, View, TouchableOpacity, StyleSheet, PermissionsAndroid } from 'react-native';
import { Image } from 'react-native-elements';
import {connect} from 'react-redux';
import Geolocation from 'react-native-geolocation-service';
import firestore from '@react-native-firebase/firestore';

export default class HomeScreen extends Component {
  state = {
    entryCreated : 1
  };
  componentDidMount() {
    this.getGeoLocation();
    this.watchMovement();
    this.watchFirestore();
  };
  componentWillUnmount(): void {
    //Geolocation.clearWatch(this.watchID);
    //add unscubcribe to prevent data fetch from firebsae
    this.unsubscribe();
  };
  async getLocationDetails(date){
    firestore().collection(`users/userid/03-08-2020`).get().then(querySnap => {
      const documentData = querySnap.docs.map(doc => doc.data());
      console.log('DOCUMENT DATA', documentData)
    })
  };
  async updateLocationDetails(ts,geoPoint){
    const userid = '0001';
    const docRef = firestore().collection('users').doc(userid);
    docRef.collection('07-04-2020').add({time:ts,location:geoPoint});
    console.log(docRef);
  };
  getGeoLocation() {
    this.requestLocationPermission().then(hasLocationPermission => {
      if (hasLocationPermission) {
        Geolocation.getCurrentPosition(
          (position) => {
            console.log(position)
          },
          (error) => {
            // See error code charts below.
            console.log(error.code, error.message);
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000}
        );
      }
    }).catch(err => {
      console.warn(err);
    });
  };
  watchFirestore() {
    this.unsubscribe = firestore().collection('users/0001/18-03-2020')
      .onSnapshot({
        error: (e) => console.error(e),
        next: (querySnapshot) => {console.log(querySnapshot.size)},
      });
  };
  watchMovement() {
    //we use 10s gap for location updates
    this.watchID = Geolocation.watchPosition((lastPosition) => {
        const ts = new Date(lastPosition.timestamp);
        const geoPoint = new firestore.GeoPoint(lastPosition.coords.latitude, lastPosition.coords.longitude);
        console.log(geoPoint);
        this.updateLocationDetails(ts,geoPoint);

      }, (err => {
        console.log(err)
      }),
      {
        enableHighAccuracy: true,
        distanceFilter: 0,
        interval: 10000,
        fastestInterval: 10000,
      } );
  };
  async requestLocationPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        {
          title: 'Location Permission',
          message:
            'This App needs access to your location ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera');
        return true;
      } else {
        console.log('Camera permission denied');
        return false;
      }

    } catch (err) {
      console.warn(err);
    }
  };

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
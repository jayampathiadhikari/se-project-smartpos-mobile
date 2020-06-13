import React from 'react';
import {View, Image} from 'react-native';
import {connect} from 'react-redux';
import Geolocation from 'react-native-geolocation-service';
import {PermissionsAndroid} from 'react-native';
import firestore from '@react-native-firebase/firestore';

class Screen extends React.Component {
  state = {
    entryCreated : 1
  };

  componentDidMount() {
    // Instead of navigator.geolocation, just use Geolocation.
    //this.getGeoLocation();
    this.watchMovement();
    this.watchFirestore();
    // const ts = new Date();
    // const today = ts.toISOString().split('T')[0];
    //this.updateLocationDetails();
    //this.getLocationDetails(today);
  };

  componentWillUnmount() {
    //Geolocation.clearWatch(this.watchID);
    //add unscubcribe to prevent data fetch from firebsae
    this.unsubscribe();
  }

  async getLocationDetails(date){
    firestore().collection(`users/userid/03-08-2020`).get().then(querySnap => {
      const documentData = querySnap.docs.map(doc => doc.data());
      console.log('DOCUMENT DATA', documentData)
    })
  };
  async updateLocationDetails(ts,geoPoint){
    const userid = '0001';
    const docRef = firestore().collection('users').doc(userid);
    docRef.collection('18-03-2020').add({time:ts,location:geoPoint});
    console.log(docRef);
  }
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
  }
  watchFirestore() {
    this.unsubscribe = firestore().collection('users/0001/18-03-2020')
      .onSnapshot({
        error: (e) => console.error(e),
        next: (querySnapshot) => {console.log(querySnapshot.size)},
      });
  }
  watchMovement() {
    //we use 10s gap for location updates
    this.watchID = Geolocation.watchPosition((lastPosition) => {
      const ts = new Date(lastPosition.timestamp);
      const geoPoint = new firestore.GeoPoint(lastPosition.coords.latitude, lastPosition.coords.longitude);
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
          title: 'Cool Photo App Camera Permission',
          message:
            'Cool Photo App needs access to your camera ' +
            'so you can take awesome pictures.',
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
      <View style={{backgroundColor: 'red', minHeight: 400}}>
      </View>
    )
  };
}

export default Screen;

import React from 'react';
import {View, Image} from 'react-native';
import {connect} from 'react-redux';
import Geolocation from 'react-native-geolocation-service';
import {PermissionsAndroid} from 'react-native';

class Screen extends React.Component {
  state = {};

  componentDidMount() {
    // Instead of navigator.geolocation, just use Geolocation.
    //this.getGeoLocation();
    this.watchMovement();
  };

  componentWillUnmount(): void {
    //Geolocation.clearWatch(this.watchID);
  }

  getGeoLocation() {
    this.requestLocationPermission().then(hasLocationPermission => {
      if (hasLocationPermission) {
        Geolocation.getCurrentPosition(
          (position) => {
            console.log(position);
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

  watchMovement() {
    this.watchID = Geolocation.watchPosition((lastPosition) => {
      console.log('LAST POSITION', lastPosition);
      this.setState({lastPosition});
    }, (err => {
      console.log(err)
    }),
      {
        enableHighAccuracy: true,
        distanceFilter: 5,
        interval: 5000,
        fastestInterval: 2000,
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

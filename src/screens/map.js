/**
 *required screens from example app:
 * SHOW MAP; FLYTO; FIT BOUNDS;  SET USER TRACKING MODES; CUSTOM ICON;
 * QUERY FEATURE POINT;
 * ANIMATION ALONG A LINE
 * USER LOCATION UPDATES
 * HEAT MAP
 */

import React from 'react';
import {View, Text, FlatList, StyleSheet, TouchableOpacity, useWindowDimensions, Dimensions} from 'react-native';
import {Icon} from 'react-native-elements';
import PropTypes from 'prop-types';
import MapboxGL from "@react-native-mapbox-gl/maps";

export const ACCESS_KEY= `pk.eyJ1IjoiamF5YW1wYXRoaSIsImEiOiJjazd3NTFhbngwMG44M2xucTU4bzl4azF4In0.DQhkwC9bVwzcVYhaZf1aVw`;


MapboxGL.setAccessToken(ACCESS_KEY);

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  container: {
    height: windowHeight-100,
    width: windowWidth,
    backgroundColor: "tomato"
  },
  map: {
    flex: 1
  }
});

class ShowMap extends React.Component {
  componentDidMount() {
  }
  onLocationUpdate = (location) => {
    console.log('LOCATION MAPBOX')
  };

  render() {
    return (
      <View style={styles.page}>
        <View style={styles.container}>
          <MapboxGL.MapView style={styles.map}>
            <MapboxGL.UserLocation
              visible={true}
              showsUserHeadingIndicator={true}
              onUpdate={this.onLocationUpdate}
            />
            <MapboxGL.Camera
              zoomLevel={5}
              animationMode={'flyTo'}
              animationDuration={6000}
              followUserMode={'normal'}
              followUserLocation
              followZoomLevel={14}
            />
          </MapboxGL.MapView>
        </View>
      </View>
    )
  }
}

export default ShowMap;
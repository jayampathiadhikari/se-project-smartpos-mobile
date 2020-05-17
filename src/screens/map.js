/**
 *required screens from example app:
 * SHOW MAP; FLYTO; FIT BOUNDS;  SET USER TRACKING MODES; CUSTOM ICON;
 * QUERY FEATURE POINT;
 * ANIMATION ALONG A LINE
 * USER LOCATION UPDATES
 * HEAT MAP
 */

import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import MapboxGL from "@react-native-mapbox-gl/maps";
import {connect} from "react-redux";
import {createGeojson} from "../Utils";

export const ACCESS_KEY = `pk.eyJ1IjoiamF5YW1wYXRoaSIsImEiOiJjazd3NTFhbngwMG44M2xucTU4bzl4azF4In0.DQhkwC9bVwzcVYhaZf1aVw`;

MapboxGL.setAccessToken(ACCESS_KEY);

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


const shopstyles = {
  icon: {
    iconImage: ['get', 'icon'],
    iconSize: 1.2,
    textField:['get','name'],
    textFont:['Open Sans Bold',
      'Arial Unicode MS Bold'],
    textSize:11,
    textTransform:'uppercase',
    textLetterSpacing:0.05,
    textOffset: [0, 1.5,],
    textColor: '#2e48f4',
    textHaloColor: '#fff',
    textHaloWidth:2
  },
};

const featureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      id: '9d10456e-bdda-4aa9-9269-04c1667d4552',
      properties: {
        icon: 'airport-15',
        name: 'test name',
      },
      geometry: {
        type: 'Point',
        coordinates: [79.85547637939453, 6.9346208572387695],
      },
    },

  ],
};

class ShowMap extends React.Component {

  state = {
    shopGeoJSON: null
  };

  componentDidMount() {
    MapboxGL.setTelemetryEnabled(false);

  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.shops != this.props.shops) {
      console.log(this.props.shops, 'MAP SHOPS PROPS UPDATED')
      const geoJSON = createGeojson(this.props.shops);
      this.setState({
        shopGeoJSON: geoJSON
      });
      console.log(geoJSON);
    }
  }

  // onLocationUpdate = (location) => {
  //   console.log('LOCATION MAPBOX')
  // };
  renderShops = () => {
    console.log('RENDERSHOPS', this.state.shopGeoJSON);
    return(
      <MapboxGL.ShapeSource id={'shopsGeoJSONLayer'} shape={this.state.shopGeoJSON}>
        <MapboxGL.SymbolLayer id="shopsLayer" style={shopstyles.icon}/>
      </MapboxGL.ShapeSource>
    )
  }
  render() {
    return (
      <View style={styles.page}>
        <View style={styles.container}>
          <MapboxGL.MapView style={styles.map}>

            <MapboxGL.ShapeSource
              id="exampleShapeSource"
              shape={featureCollection}>
              <MapboxGL.SymbolLayer id="exampleIconName" style={shopstyles.icon} />
            </MapboxGL.ShapeSource>

            <MapboxGL.UserLocation
              visible={true}
              showsUserHeadingIndicator={true}
              // onUpdate={this.onLocationUpdate}
            />
            <MapboxGL.Camera
              zoomLevel={5}
              animationMode={'flyTo'}
              animationDuration={6000}
              followUserMode={'normal'}
              followUserLocation
              followZoomLevel={14}
            />
            {this.state.shopGeoJSON != null ? this.renderShops()
              : null}
          </MapboxGL.MapView>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  container: {
    height: windowHeight - 130,
    width: windowWidth,
    backgroundColor: "red"
  },
  map: {
    flex: 1
  },
  icon: {
    position: 'absolute',
    top: 80,
    left: 10,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999
  }
});

const shopStyles = {
  iconShop: {
    iconImage: ['airport-15'],
    iconSize: [
      'match',
      ['get', 'icon'],
      'example',
      1.2,
      'airport-15',
      1.2,
      /* default */ 1,
    ],
    // textField:['get','name'],
    // textFont:['Open Sans Bold',
    //   'Arial Unicode MS Bold'],
    // textSize:11,
    // textTransform:'uppercase',
    // textLetterSpacing:0.05,
    // textOffset: [0, 1.5,],
    // textColor: '#2e48f4',
    // textHaloColor: '#fff',
    // textHaloWidth:2
  },
};

const mapStateToProps = (state) => ({
  shops: state.uiReducer.shops,
});


const bindAction = (dispatch) => ({});

export default connect(
  mapStateToProps,
  bindAction
)(ShowMap);
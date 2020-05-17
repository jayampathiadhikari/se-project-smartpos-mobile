/**
 *required screens from example app:
 * SHOW MAP; FLYTO; FIT BOUNDS;  SET USER TRACKING MODES; CUSTOM ICON;
 * QUERY FEATURE POINT;
 * ANIMATION ALONG A LINE
 * USER LOCATION UPDATES
 * HEAT MAP
 */

import React from 'react';
import {View, StyleSheet, Dimensions,Text} from 'react-native';
import MapboxGL from "@react-native-mapbox-gl/maps";
import {connect} from "react-redux";
import {createGeojson, getOptimizedRouteByWaypoints, getRouteByWaypoints, getWaypointsArray} from "../Utils";
import Bubble from '../components/bubble';
import Geolocation from "react-native-geolocation-service";
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
  line:{
    lineJoin: 'round',
    lineCap: 'round',
    lineColor: '#3887be',
    lineWidth: 3,
    lineOpacity: 0.75
  }
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
    shopGeoJSON: null,
    wayPoints:null,
    directions:null
  };
  wayPoints = [];

  componentDidMount() {
    MapboxGL.setTelemetryEnabled(false);

  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.shops != this.props.shops) {
      console.log(this.props.shops, 'MAP SHOPS PROPS UPDATED');
      const geoJSON = createGeojson(this.props.shops);


      console.log(geoJSON);
      const wayPoints = getWaypointsArray(this.props.shops);
      this.setState({
        shopGeoJSON: geoJSON,
        wayPoints: wayPoints,

      });
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
  };

  getRoute = async() => {
    var wayPoints = [];
    Geolocation.getCurrentPosition(
      async (position) => {
        wayPoints = [[position.coords.longitude,position.coords.latitude],...this.state.wayPoints];
        console.log('CURRENT POSITION MAPBOX',position, wayPoints)
        const res = await getRouteByWaypoints(wayPoints);
        var route = res.data.routes[0].geometry.coordinates;
        var geojson = {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: route
          }
        };
        this.setState({
          directions: geojson
        });
        console.log(geojson);
      },
      (error) => {
        // See error code charts below.
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000}
    )
  };

  renderRoute = () => {
    return(
      <MapboxGL.ShapeSource id={'routesGeoJSONLayer'} shape={this.state.directions}>
        <MapboxGL.LineLayer id="routeLayer" style={shopstyles.line} belowLayerID={'shopsLayer'}/>
      </MapboxGL.ShapeSource>
    )
  };

  render() {
    return (
      <View style={styles.page}>
        <View style={styles.container}>
          <MapboxGL.MapView style={styles.map}>

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
            {
              this.state.directions != null ? this.renderRoute() : null
            }
          </MapboxGL.MapView>
          <Bubble onPress={this.getRoute} style={{bottom: 30}}>
            <Text>
              Toggle User Location:{' '}
            </Text>
          </Bubble>
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
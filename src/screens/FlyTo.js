import React from 'react';
import {View,Alert, StyleSheet} from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import {ACCESS_KEY} from "./map";

MapboxGL.setAccessToken(ACCESS_KEY);

const layerStyles = {
  building: {
    fillExtrusionColor: '#aaa',

    fillExtrusionHeight: [
      'interpolate',
      ['linear'],
      ['zoom'],
      15,
      0,
      15.05,
      ['get', 'height'],
    ],

    fillExtrusionBase: [
      'interpolate',
      ['linear'],
      ['zoom'],
      15,
      0,
      15.05,
      ['get', 'min_height'],
    ],

    fillExtrusionOpacity: 0.6,
  },
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  container: {
    height: 300,
    width: 300,
    backgroundColor: "tomato"
  },
  map: {
    flex: 1
  }
});

class FlyTo extends React.Component {
  static SF_OFFICE_LOCATION = [-122.400021, 37.789085];

  static DC_OFFICE_LOCATION = [-77.036086, 38.910233];


  constructor(props) {
    super(props);

    this.state = {
      location: FlyTo.SF_OFFICE_LOCATION,
    };

    this._flyToOptions = [
      {label: 'SF', data: FlyTo.SF_OFFICE_LOCATION},
      {label: 'DC', data: FlyTo.DC_OFFICE_LOCATION},
    ];

    this.onFlyToPress = this.onFlyToPress.bind(this);
    this.onFlyToComplete = this.onFlyToComplete.bind(this);
  }

  onFlyToPress(i) {
    this.setState({location: this._flyToOptions[i].data});
  }

  onFlyToComplete() {
    Alert.alert('Fly To Animation Completed', 'We did it!!!');
  }

  render() {
    return (
      <View style={styles.page}>
        <View style={styles.container}>
          <MapboxGL.MapView style={{flex: 1}}>
            <MapboxGL.Camera
              zoomLevel={16}
              animationMode={'flyTo'}
              animationDuration={6000}
              centerCoordinate={this.state.location}
            />

            <MapboxGL.UserLocation />

            <MapboxGL.VectorSource>
              <MapboxGL.FillExtrusionLayer
                id="building3d"
                sourceLayerID="building"
                style={layerStyles.building}
              />
            </MapboxGL.VectorSource>
          </MapboxGL.MapView>
        </View>
      </View>

    );
  }
}

export default FlyTo;

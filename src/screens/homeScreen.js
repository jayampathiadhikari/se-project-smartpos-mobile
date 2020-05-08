import React , {Component} from 'react';
import { Text, View, TouchableOpacity, StyleSheet, PermissionsAndroid ,Modal} from 'react-native';
import { Image ,Button} from 'react-native-elements';
import {connect} from 'react-redux';
import Geolocation from 'react-native-geolocation-service';
import firestore from '@react-native-firebase/firestore';

export default class HomeScreen extends Component {

  state = {
    entryCreated : 1,

    dailyTarget : 8000,
    modalVisible:false,
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


  openModal(){
    this.setState({modalVisible:true});
  };

  closeModal(){
    this.setState({modalVisible:false});
  }

  render() {
    return (
      <View style={styles.MainContainer}>
        <Text style={{ marginTop: 40, fontSize: 40 , fontFamily: 'notoserif' ,fontWeight:'bold'}}>ZENARUS</Text>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Image
              source={ require('./home2.jpg') }
              style={{ width: 400, height: 300 }}
            />
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.openModal()}>
            <Text style={styles.text}>View the Daily Target</Text>
          </TouchableOpacity>

        </View>

          <Modal animationType="fade" transparent={true} visible={this.state.modalVisible}>
              <View style={modalstyles.centeredView}>
                <View style={modalstyles.modalView}>
                  <Text style={modalstyles.modalText}> Target assigned on {new Date().getDate() + '/' + new Date().getMonth() + '/' + new Date().getFullYear()} : </Text>
                  <Text style = {{...modalstyles.modalText , fontWeight: 'bold'}}>Rs. {this.state.dailyTarget}</Text>
                  <Button title = 'Back'  buttonStyle={modalstyles.closeButton} onPress={() => {this.closeModal();}}/>


                </View>
              </View>
           </Modal>




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
    borderRadius : 30
  },

  text: {
    fontSize: 17,
    fontWeight:'600',
    color: '#fff'
  }

});




const modalstyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 10,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",

    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  closeButton: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    margin:10,
    width : 100
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    fontSize :17,
    marginBottom: 6,
    textAlign: "center"
  },
});


import axios from 'axios';
import auth from '@react-native-firebase/auth';
import {Alert} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {MAPBOX_TOKEN} from "./constants/constants";


export const getToken = async(employee_id) => {
  try{
    const result = await axios.get('https://se-smartpos-backend.herokuapp.com/api/v1/auth/employee/gettoken',{
      params: {
        employee_id
      }
    });
    return result;
  }catch (e) {
    return {success: false, error: e}
  }
};

export const generateToken = async(employee_id) => {
  try{
    const result = await axios.get('https://se-smartpos-backend.herokuapp.com/api/v1/auth/employee/generatetoken',{
      params: {
        employee_id
      }
    });
    return result;
  }catch (e) {
    return {success: false, error: e}
  }
};

export const getRoutesForSalesperson = async (salesperson_id) => {
  const res = await axios.post('https://se-smartpos-backend.herokuapp.com/route/get-all-routes', {
    salesperson_id
  });
  if(res.data.success){
    return {
      success: true,
      data:res.data.data
    }
  }else{
    return {
      success: false,
      error:res.data.error,
    }
  }
};

export const getShopsInSelectedRoute = async(route_id) => {
  try{
    const res = await axios.post('https://se-smartpos-backend.herokuapp.com/shop/get-shops-selected-route', {
      route_id:route_id
    });
    console.log(res);
    if(res.data.success){
      return {
        success: true,
        data:res.data.data
      }
    }else{
      return {
        success: false,
        error:res.data.error,
      }
    }
  }
  catch (e) {
    console.log(e);
  }
};

export const checkAuthentication = (email, password) => {
  return auth().signInWithEmailAndPassword(email, password)
    .then(
      async () => {
        const userQueryRef = firestore().collection('users').where('email', '==', email);
        const userQuerySnapshot = await userQueryRef.get();
        const type = userQuerySnapshot.docs[0].data().type;
        console.log(userQuerySnapshot.docs[0].data(), 'USER DATA');
        return {success: true, type: type, user: userQuerySnapshot.docs[0].data()}
      }
    )
    .catch(function (error) {
      var errorMessage = error.message;
      return {success: false, message: errorMessage}
    });
};

export const createGeojson = (shopData) => {
  var data = {
    type: 'FeatureCollection',
    features: []
  };
  const feature = (shop) => ({
    type: 'Feature',
    properties: {
      name: shop.name,
      icon: 'shop-15',
      id: shop.shop_id
    },
    geometry: {
      type: 'Point',
      coordinates: [shop.longitude,shop.latitude]
    }
  });
  const getFeature  = (shop) => ({
    type: 'Feature',
    id: shop.shop_id,
    properties: {
      icon: 'airport-15',
    },
    geometry: {
      type: 'Point',
      coordinates: [shop.longitude,shop.latitude],
    },
  });
  shopData.forEach(shop => {
    data.features.push(feature(shop))
  });
  return data
};

export const getOptimizedRouteByWaypoints = async (waypointsArray) => {
  var coords = '';
  waypointsArray.forEach((coord) => {
    coords += coord.join() + ';'
  });
  coords = coords.slice(0, coords.length - 1);
  console.log(coords, 'COORDS STRING');
  const url = `https://api.mapbox.com/optimized-trips/v1/mapbox/driving/${coords}`;
  const res = await axios.get(url, {
      params: {
        alternatives: false,
        geometries: "geojson",
        steps: false,
        overview:"full",
        access_token: MAPBOX_TOKEN
      }
    }
  );
  return res;
};

export const getRouteByWaypoints = async (waypointsArray) => {
  console.log(waypointsArray,'WAYPOINT ARRAY');
  var coords = '';
  waypointsArray.forEach((coord) => {
    coords += coord.join() + ';'
  });
  coords = coords.slice(0, coords.length - 1);
  console.log(coords, 'COORDS STRING');
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coords}`;
  const res = await axios.get(url, {
      params: {
        alternatives: false,
        geometries: "geojson",
        steps: false,
        overview:"full",
        access_token: MAPBOX_TOKEN
      }
    }
  );
  return res;
};

export const getWaypointsArray = (shops) => {
  console.log (shops.map(shop => [shop.longitude,shop.latitude]),'waypoint')
  return (shops.map(shop => [shop.longitude,shop.latitude]))
};

export const showOtherUsers = async (agentID) => {
  const queryRef = firestore().collection("users").where("supervisorUid", "==", agentID);
  const querySnap = await queryRef.get();
  const salesperson = [];
  querySnap.docs.forEach(doc => {
    const data = doc.data();
    salesperson.push({name: data.firstName +" "+ data.lastName, region: data.region, email: data.email,
    phoneNumber: data.phoneNumber, address: data.address})
  });
  return salesperson;
};

export const updateUser = async (key, firstName, lastName, address, phoneNumber) => {
    const updateDBRef = firestore().collection("users").where("uid", "==", key);
    const updateDBRefSnap = await updateDBRef.get();
    const id = updateDBRefSnap.docs[0].id;
    const updateDBRefUpdate = firestore().collection("users").doc(id);
    updateDBRefUpdate.update("firstName" , firstName)
    updateDBRefUpdate.update("lastName" , lastName)
    updateDBRefUpdate.update("address" , address)
    updateDBRefUpdate.update("phoneNumber" , phoneNumber)
    .then((docRef) => {
        console.log("Document successfully written!");
        Alert.alert('Successfully Updated!');
    })
    .catch((error) => {
      console.error("Error: ", error);
    });
};

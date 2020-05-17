import axios from 'axios';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {MAPBOX_TOKEN} from "./constants/constants";

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
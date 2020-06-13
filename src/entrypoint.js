import React, { Component } from 'react';
import { ActivityIndicator } from 'react-native';
import 'react-native-gesture-handler'
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';
import Navigator from './navigation/initialNavigation';
import { store, persistor } from './store/storeConfiguration';
import axios from 'axios';

export default class Entrypoint extends Component {


    componentDidMount() {
        axios.interceptors.request.use(function (config) {
            // console.log(config,'INTERCEPTED');
            if(config.url.includes('/api/v1/auth/')){
                return config;
            }else{
                const token = store.getState().AuthenticationReducer.token;
                config.headers.Authorization = token;
                // console.log(config,'normal route')
                return config;
            }
            // Do something before request is sent
        }, function (error) {
            // Do something with request error
            return Promise.reject(error);
        });
    }


  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={<ActivityIndicator />} persistor={persistor}>
          <Navigator />
        </PersistGate>
      </Provider>
    );
  }
};
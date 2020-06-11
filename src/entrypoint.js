import React, { Component } from 'react';
import { ActivityIndicator } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';
import Navigator from './navigation/initialNavigation';
import { store, persistor } from './store/storeConfiguration';
import axios from 'axios';

export default class Entrypoint extends Component {


    componentDidMount() {
        axios.interceptors.request.use(function (config) {
            console.log(config,'INTERCEPTED');

            // Do something before request is sent
            return config;
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
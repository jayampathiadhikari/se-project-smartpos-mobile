/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
//yarn add react-native-vector-icons

import React from 'react';
//import Entrypoint from "./src/entrypoint";
import BottomTabNavigation from './src/navigation/initialNavigation.js';
import {View} from 'react-native';

const App: () => React$Node = () => {
  return (
    <BottomTabNavigation />

  );
};

export default App;

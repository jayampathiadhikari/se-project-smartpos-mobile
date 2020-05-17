import {combineReducers, createStore} from 'redux';
import {persistStore, persistReducer} from 'redux-persist';
import asyncStorage from '@react-native-community/async-storage';
import {AuthenticationReducer} from './reducers/authentication/reducer';
import {uiReducer} from "./reducers/ui/reducer";

export const appReducer = combineReducers({
  AuthenticationReducer,
  uiReducer
});

/**
 * Persist app state in async storage
 * Allows rehydration.
 */
const persistConfig = {
  key: 'root',
  storage: asyncStorage,
  whitelist: ['AuthenticationReducer']
};

const persistedReducer = persistReducer(persistConfig, appReducer);

export const store = createStore(
  persistedReducer
);

export const persistor = persistStore(store);

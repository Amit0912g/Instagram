import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice.js";
import postSlice from "./postSlice.js";
import socketSlice from "./socketSlice.js";
import chatSlice from "./chatSlice.js";
import rtnSlice from "./rtnSlice.js"
import bookmarkSlice from "./bookmarkSlice.js"
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  persistStore,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'root',
  version: 1,
  storage,

};

const appReducer = combineReducers({
  auth: authSlice,
  post: postSlice,
  socketio: socketSlice,
  chat: chatSlice,
  rtn:rtnSlice,
  bookmark:bookmarkSlice
});

const rootReducer = (state, action) => {
  if (action.type === 'RESET_APP') {
    state = undefined;
  }
  return appReducer(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

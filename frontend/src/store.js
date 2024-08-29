// store.js or rootReducer.js
import { configureStore } from '@reduxjs/toolkit';
import mainReducer from './mainSlice'; // Adjust the path as necessary
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, mainReducer);

const store = configureStore({
  reducer: persistedReducer,
  // Adding a custom middleware to handle non-serializable values
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['YOUR_NON_SERIALIZABLE_ACTION_TYPE'],
        ignoredPaths: ['your/path'],
      },
    }),
});

const persistor = persistStore(store);

export { store, persistor };

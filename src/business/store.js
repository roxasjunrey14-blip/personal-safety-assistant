import { configureStore } from '@reduxjs/toolkit';
import safetyReducer from './slices/safetySlice';
import locationReducer from './slices/locationSlice';
import contactReducer from './slices/contactSlice';
import incidentReducer from './slices/incidentSlice';

/**
 * Business Layer: Central Redux Store demonstrating Flux architecture.
 * Actions -> Dispatcher -> Store Reducers -> Selectors -> Presentation Layer (React Views)
 */
export const store = configureStore({
  reducer: {
    safety: safetyReducer,
    location: locationReducer,
    contacts: contactReducer,
    incidents: incidentReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Allows clean handling of date objects and native promises
    }),
});

export default store;

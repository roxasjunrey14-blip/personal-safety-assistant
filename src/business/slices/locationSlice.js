import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as Location from 'expo-location';

export const fetchCurrentLocation = createAsyncThunk(
  'location/fetchCurrentLocation',
  async (_, { rejectWithValue }) => {
    try {
      // 1. Request foreground permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return rejectWithValue({
          type: 'PERMISSION_DENIED',
          message: 'Location permission was denied by the user. Please enable it in Settings.',
        });
      }

      // 2. Fetch current GPS position with high accuracy
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude, altitude, accuracy } = location.coords;

      // 3. Try reverse geocoding for readable location name
      let addressString = 'Coordinates acquired';
      try {
        const reverseGeocode = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });
        if (reverseGeocode && reverseGeocode.length > 0) {
          const item = reverseGeocode[0];
          const parts = [item.name, item.street, item.city, item.region, item.country].filter(Boolean);
          addressString = parts.join(', ');
        }
      } catch (geocodeErr) {
        console.log('Geocoding note:', geocodeErr);
      }

      return {
        latitude: parseFloat(latitude.toFixed(6)),
        longitude: parseFloat(longitude.toFixed(6)),
        altitude: altitude ? parseFloat(altitude.toFixed(2)) : null,
        accuracy: accuracy ? parseFloat(accuracy.toFixed(1)) : null,
        address: addressString,
        timestamp: new Date().toLocaleTimeString(),
      };
    } catch (error) {
      return rejectWithValue({
        type: 'FETCH_ERROR',
        message: error.message || 'Failed to retrieve GPS location.',
      });
    }
  }
);

const initialState = {
  latitude: null,
  longitude: null,
  altitude: null,
  accuracy: null,
  address: null,
  timestamp: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'denied' | 'failed'
  errorMessage: null,
};

export const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    clearLocationError: (state) => {
      state.errorMessage = null;
      if (state.status === 'failed' || state.status === 'denied') {
        state.status = 'idle';
      }
    },
    setMockLocation: (state, action) => {
      state.latitude = action.payload.latitude;
      state.longitude = action.payload.longitude;
      state.accuracy = 5.0;
      state.address = action.payload.address || 'Mocked Safe Zone Location';
      state.timestamp = new Date().toLocaleTimeString();
      state.status = 'succeeded';
      state.errorMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentLocation.pending, (state) => {
        state.status = 'loading';
        state.errorMessage = null;
      })
      .addCase(fetchCurrentLocation.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.latitude = action.payload.latitude;
        state.longitude = action.payload.longitude;
        state.altitude = action.payload.altitude;
        state.accuracy = action.payload.accuracy;
        state.address = action.payload.address;
        state.timestamp = action.payload.timestamp;
        state.errorMessage = null;
      })
      .addCase(fetchCurrentLocation.rejected, (state, action) => {
        if (action.payload?.type === 'PERMISSION_DENIED') {
          state.status = 'denied';
          state.errorMessage = action.payload.message;
        } else {
          state.status = 'failed';
          state.errorMessage = action.payload?.message || 'Error acquiring GPS location';
        }
      });
  },
});

export const { clearLocationError, setMockLocation } = locationSlice.actions;
export default locationSlice.reducer;

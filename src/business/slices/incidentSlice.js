import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { storageService } from '../../data/storageService';

export const loadIncidentsThunk = createAsyncThunk(
  'incidents/loadIncidents',
  async () => {
    return await storageService.loadIncidents();
  }
);

export const saveIncidentThunk = createAsyncThunk(
  'incidents/saveIncident',
  async (incident, { getState }) => {
    const newIncident = {
      id: Date.now().toString(),
      title: incident.title || 'Security Incident',
      description: incident.description || '',
      severity: incident.severity || 'Medium',
      imageUri: incident.imageUri || null,
      latitude: incident.latitude || null,
      longitude: incident.longitude || null,
      address: incident.address || null,
      timestamp: new Date().toLocaleTimeString() + ' ' + new Date().toLocaleDateString(),
    };
    const currentList = getState().incidents.list;
    const updatedList = [newIncident, ...currentList];
    await storageService.saveIncidents(updatedList);
    return updatedList;
  }
);

export const deleteIncidentThunk = createAsyncThunk(
  'incidents/deleteIncident',
  async (id, { getState }) => {
    const currentList = getState().incidents.list;
    const updatedList = currentList.filter((item) => item.id !== id);
    await storageService.saveIncidents(updatedList);
    return updatedList;
  }
);

const initialState = {
  list: [],
  selectedImageUri: null,
  cameraPermissionGranted: null,
  loading: false,
  error: null,
};

export const incidentSlice = createSlice({
  name: 'incidents',
  initialState,
  reducers: {
    setSelectedImageUri: (state, action) => {
      state.selectedImageUri = action.payload;
    },
    clearSelectedImageUri: (state) => {
      state.selectedImageUri = null;
    },
    setCameraPermission: (state, action) => {
      state.cameraPermissionGranted = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadIncidentsThunk.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(saveIncidentThunk.fulfilled, (state, action) => {
        state.list = action.payload;
        state.selectedImageUri = null;
      })
      .addCase(deleteIncidentThunk.fulfilled, (state, action) => {
        state.list = action.payload;
      });
  },
});

export const { setSelectedImageUri, clearSelectedImageUri, setCameraPermission } = incidentSlice.actions;
export default incidentSlice.reducer;

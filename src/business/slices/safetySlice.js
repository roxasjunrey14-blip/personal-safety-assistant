import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { storageService } from '../../data/storageService';

export const loadSafetyStatusThunk = createAsyncThunk(
  'safety/loadSafetyStatus',
  async () => {
    const status = await storageService.loadSafetyStatus();
    const logs = await storageService.loadLogs();
    return { status, logs };
  }
);

export const updateSafetyStatusThunk = createAsyncThunk(
  'safety/updateSafetyStatus',
  async ({ status, reason }, { getState }) => {
    await storageService.saveSafetyStatus(status);
    const newLog = {
      id: Date.now().toString(),
      type: status,
      message: reason || `Status changed to ${status}`,
      timestamp: new Date().toLocaleTimeString() + ' ' + new Date().toLocaleDateString(),
    };
    const currentLogs = getState().safety.logs;
    const updatedLogs = [newLog, ...currentLogs];
    await storageService.saveLogs(updatedLogs);
    return { status, newLog };
  }
);

const initialState = {
  status: 'SAFE', // 'SAFE' | 'WARNING' | 'EMERGENCY'
  lastSosTriggeredAt: null,
  activeAlertMessage: 'Everything is normal. You are currently secure.',
  logs: [],
  loading: false,
};

export const safetySlice = createSlice({
  name: 'safety',
  initialState,
  reducers: {
    setQuickStatus: (state, action) => {
      state.status = action.payload;
    },
    triggerSosDirect: (state) => {
      state.status = 'EMERGENCY';
      state.lastSosTriggeredAt = new Date().toISOString();
      state.activeAlertMessage = 'SOS EMERGENCY SIGNAL BROADCAST ACTIVATED!';
    },
    resolveSosDirect: (state) => {
      state.status = 'SAFE';
      state.activeAlertMessage = 'Emergency resolved. Returned to Safe status.';
    },
    clearLogs: (state) => {
      state.logs = [];
      storageService.saveLogs([]);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadSafetyStatusThunk.fulfilled, (state, action) => {
        state.status = action.payload.status;
        state.logs = action.payload.logs;
      })
      .addCase(updateSafetyStatusThunk.fulfilled, (state, action) => {
        state.status = action.payload.status;
        state.logs = [action.payload.newLog, ...state.logs];
        if (action.payload.status === 'EMERGENCY') {
          state.activeAlertMessage = 'EMERGENCY ALERT: Immediate assistance requested!';
          state.lastSosTriggeredAt = new Date().toISOString();
        } else if (action.payload.status === 'WARNING') {
          state.activeAlertMessage = 'CAUTION: User reported suspicious activity.';
        } else {
          state.activeAlertMessage = 'Status Normal. You are marked as safe.';
        }
      });
  },
});

export const { setQuickStatus, triggerSosDirect, resolveSosDirect, clearLogs } = safetySlice.actions;
export default safetySlice.reducer;

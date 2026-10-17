import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { storageService } from '../../data/storageService';

export const loadContactsThunk = createAsyncThunk(
  'contacts/loadContacts',
  async () => {
    return await storageService.loadContacts();
  }
);

export const addContactThunk = createAsyncThunk(
  'contacts/addContact',
  async (contact, { getState }) => {
    const newContact = {
      id: Date.now().toString(),
      name: contact.name.trim(),
      phone: contact.phone.trim(),
      relationship: contact.relationship.trim() || 'Emergency Contact',
      isPrimary: contact.isPrimary || false,
    };
    const currentList = getState().contacts.list;
    const updatedList = [newContact, ...currentList];
    await storageService.saveContacts(updatedList);
    return updatedList;
  }
);

export const deleteContactThunk = createAsyncThunk(
  'contacts/deleteContact',
  async (id, { getState }) => {
    const currentList = getState().contacts.list;
    const updatedList = currentList.filter((item) => item.id !== id);
    await storageService.saveContacts(updatedList);
    return updatedList;
  }
);

const initialState = {
  list: [],
  loading: false,
  error: null,
};

export const contactSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadContactsThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadContactsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(loadContactsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addContactThunk.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(deleteContactThunk.fulfilled, (state, action) => {
        state.list = action.payload;
      });
  },
});

export default contactSlice.reducer;

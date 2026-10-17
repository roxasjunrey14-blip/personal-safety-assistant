import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  SAFETY_STATUS: '@safety_assistant_status',
  CONTACTS: '@safety_assistant_contacts',
  INCIDENTS: '@safety_assistant_incidents',
  LOGS: '@safety_assistant_logs',
};

/**
 * Data Layer: Handles persistence via AsyncStorage.
 * Isolates all direct storage calls away from business logic and UI presentation.
 */
export const storageService = {
  // --- Safety Status ---
  async saveSafetyStatus(status) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SAFETY_STATUS, JSON.stringify(status));
      return true;
    } catch (e) {
      console.error('Error saving safety status to storage:', e);
      return false;
    }
  },

  async loadSafetyStatus() {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SAFETY_STATUS);
      return data ? JSON.parse(data) : 'SAFE';
    } catch (e) {
      console.error('Error loading safety status:', e);
      return 'SAFE';
    }
  },

  // --- Emergency Contacts ---
  async saveContacts(contacts) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(contacts));
      return true;
    } catch (e) {
      console.error('Error saving contacts:', e);
      return false;
    }
  },

  async loadContacts() {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.CONTACTS);
      if (data) {
        return JSON.parse(data);
      }
      // Initial default contacts
      const initialContacts = [
        {
          id: '1',
          name: 'National Emergency Hotline',
          phone: '911',
          relationship: 'Emergency Services',
          isPrimary: true,
        },
        {
          id: '2',
          name: 'Philippine Red Cross',
          phone: '143',
          relationship: 'Medical & Rescue',
          isPrimary: false,
        },
      ];
      await AsyncStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(initialContacts));
      return initialContacts;
    } catch (e) {
      console.error('Error loading contacts:', e);
      return [];
    }
  },

  // --- Incidents & Evidence ---
  async saveIncidents(incidents) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.INCIDENTS, JSON.stringify(incidents));
      return true;
    } catch (e) {
      console.error('Error saving incidents:', e);
      return false;
    }
  },

  async loadIncidents() {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.INCIDENTS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error loading incidents:', e);
      return [];
    }
  },

  // --- Audit Logs ---
  async saveLogs(logs) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
      return true;
    } catch (e) {
      console.error('Error saving logs:', e);
      return false;
    }
  },

  async loadLogs() {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.LOGS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error loading logs:', e);
      return [];
    }
  },

  async clearAll() {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.SAFETY_STATUS,
        STORAGE_KEYS.CONTACTS,
        STORAGE_KEYS.INCIDENTS,
        STORAGE_KEYS.LOGS,
      ]);
      return true;
    } catch (e) {
      console.error('Error clearing storage:', e);
      return false;
    }
  },
};

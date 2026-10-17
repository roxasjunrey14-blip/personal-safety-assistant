import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import DashboardScreen from './screens/DashboardScreen';
import LocationScreen from './screens/LocationScreen';
import CameraIncidentScreen from './screens/CameraIncidentScreen';
import ContactsScreen from './screens/ContactsScreen';
import LogsScreen from './screens/LogsScreen';
import { loadSafetyStatusThunk } from '../business/slices/safetySlice';
import { loadContactsThunk } from '../business/slices/contactSlice';
import { loadIncidentsThunk } from '../business/slices/incidentSlice';
import { fetchCurrentLocation } from '../business/slices/locationSlice';

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'shield', iconActive: 'shield' },
  { id: 'location', label: 'GPS', icon: 'navigate-outline', iconActive: 'navigate' },
  { id: 'camera', label: 'Incident', icon: 'camera-outline', iconActive: 'camera' },
  { id: 'contacts', label: 'Contacts', icon: 'people-outline', iconActive: 'people' },
  { id: 'logs', label: 'Logs', icon: 'list-outline', iconActive: 'list' },
];

export const MainApp = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('dashboard');
  const safetyStatus = useSelector((state) => state.safety.status);

  // Initialize data from Data Layer (AsyncStorage) into Redux Store
  useEffect(() => {
    dispatch(loadSafetyStatusThunk());
    dispatch(loadContactsThunk());
    dispatch(loadIncidentsThunk());
    dispatch(fetchCurrentLocation());
  }, [dispatch]);

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'location':
        return <LocationScreen onBack={() => setActiveTab('dashboard')} />;
      case 'camera':
        return <CameraIncidentScreen onBack={() => setActiveTab('dashboard')} />;
      case 'contacts':
        return <ContactsScreen onBack={() => setActiveTab('dashboard')} />;
      case 'logs':
        return <LogsScreen onBack={() => setActiveTab('dashboard')} />;
      case 'dashboard':
      default:
        return <DashboardScreen onNavigate={(screen) => setActiveTab(screen)} />;
    }
  };

  const getStatusBannerColor = () => {
    switch (safetyStatus) {
      case 'EMERGENCY':
        return '#dc2626';
      case 'WARNING':
        return '#d97706';
      case 'SAFE':
      default:
        return '#15803d';
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle={safetyStatus === 'SAFE' ? 'light-content' : 'light-content'}
        backgroundColor={getStatusBannerColor()}
      />

      {/* Global Status Banner Bar */}
      <View style={[styles.statusBarBanner, { backgroundColor: getStatusBannerColor() }]}>
        <View style={styles.statusIndicator}>
          <View style={styles.statusBlinkDot} />
          <Text style={styles.statusBannerText}>
            STATUS: {safetyStatus}
          </Text>
        </View>
        <Text style={styles.statusSubText}>Personal Safety Assistant</Text>
      </View>

      {/* Active Screen Presentation */}
      <View style={styles.screenContainer}>{renderActiveScreen()}</View>

      {/* Persistent Bottom Navigation Options */}
      <View style={styles.bottomNav}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={styles.navItem}
              onPress={() => setActiveTab(tab.id)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isActive ? tab.iconActive : tab.icon}
                size={22}
                color={isActive ? '#2563eb' : '#64748b'}
              />
              <Text
                style={[
                  styles.navLabel,
                  isActive && styles.navLabelActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  statusBarBanner: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusBlinkDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ffffff',
  },
  statusBannerText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  statusSubText: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 11,
    fontWeight: '600',
  },
  screenContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingVertical: 8,
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navLabel: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
    fontWeight: '600',
  },
  navLabelActive: {
    color: '#2563eb',
    fontWeight: '800',
  },
});

export default MainApp;

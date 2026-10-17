import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import StatusBadge from '../components/StatusBadge';
import CustomButton from '../components/CustomButton';
import ContactCard from '../components/ContactCard';
import { updateSafetyStatusThunk } from '../../business/slices/safetySlice';
import { fetchCurrentLocation } from '../../business/slices/locationSlice';

export const DashboardScreen = ({ onNavigate }) => {
  const dispatch = useDispatch();

  const safety = useSelector((state) => state.safety);
  const location = useSelector((state) => state.location);
  const contacts = useSelector((state) => state.contacts.list);
  const incidents = useSelector((state) => state.incidents.list);

  const primaryContact = contacts.find((c) => c.isPrimary) || contacts[0];

  useEffect(() => {
    // Attempt to acquire initial location if not yet fetched
    if (location.status === 'idle') {
      dispatch(fetchCurrentLocation());
    }
  }, [dispatch, location.status]);

  const handleSosTrigger = () => {
    Alert.alert(
      '⚠️ TRIGGER EMERGENCY SOS',
      'Are you sure you want to broadcast an emergency alert? This will log an emergency event and mark your status as CRITICAL.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'ACTIVATE SOS',
          style: 'destructive',
          onPress: () => {
            dispatch(
              updateSafetyStatusThunk({
                status: 'EMERGENCY',
                reason: 'USER PRESSED EMERGENCY SOS BUTTON FROM DASHBOARD',
              })
            );
          },
        },
      ]
    );
  };

  const handleMarkSafe = () => {
    dispatch(
      updateSafetyStatusThunk({
        status: 'SAFE',
        reason: 'User resolved situation and marked status as SAFE',
      })
    );
  };

  const handleCautionAlert = () => {
    dispatch(
      updateSafetyStatusThunk({
        status: 'WARNING',
        reason: 'User flagged suspicious activity or caution state',
      })
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* App Header */}
      <View style={styles.header}>
        <View style={styles.appIdentity}>
          <View style={styles.logoBadge}>
            <Ionicons name="shield-checkmark-sharp" size={26} color="#ffffff" />
          </View>
          <View>
            <Text style={styles.appTitle}>Personal Safety Assistant</Text>
            <Text style={styles.appSubtitle}>IT313 Special Practical Activity</Text>
          </View>
        </View>
      </View>

      {/* Main Status Badge Component (Reusable Component with Props) */}
      <StatusBadge
        status={safety.status}
        title={
          safety.status === 'EMERGENCY'
            ? '🚨 EMERGENCY IN PROGRESS'
            : safety.status === 'WARNING'
            ? '⚠️ ELEVATED ALERT'
            : '🛡️ YOU ARE SAFE'
        }
        description={safety.activeAlertMessage}
      />

      {/* Big Emergency SOS Action */}
      <View style={styles.sosContainer}>
        <CustomButton
          title={safety.status === 'EMERGENCY' ? 'SOS SIGNAL BROADCASTING' : 'TRIGGER EMERGENCY SOS'}
          icon="alert-circle"
          variant="danger"
          style={styles.sosButton}
          textStyle={styles.sosButtonText}
          onPress={handleSosTrigger}
        />
        <View style={styles.statusActionRow}>
          <CustomButton
            title="Mark as Safe"
            icon="checkmark-circle"
            variant="primary"
            style={{ flex: 1, marginRight: 6 }}
            onPress={handleMarkSafe}
          />
          <CustomButton
            title="Caution Alert"
            icon="warning"
            variant="warning"
            style={{ flex: 1, marginLeft: 6 }}
            onPress={handleCautionAlert}
          />
        </View>
      </View>

      {/* Quick Navigation Cards */}
      <Text style={styles.sectionTitle}>Dashboard Quick Actions</Text>
      <View style={styles.gridContainer}>
        <CustomButton
          title="GPS & Location"
          icon="navigate"
          variant="secondary"
          onPress={() => onNavigate('location')}
          style={styles.gridBtn}
        />
        <CustomButton
          title="Report & Camera"
          icon="camera"
          variant="secondary"
          onPress={() => onNavigate('camera')}
          style={styles.gridBtn}
        />
        <CustomButton
          title={`Contacts (${contacts.length})`}
          icon="people"
          variant="secondary"
          onPress={() => onNavigate('contacts')}
          style={styles.gridBtn}
        />
        <CustomButton
          title="Safety Logs"
          icon="list"
          variant="secondary"
          onPress={() => onNavigate('logs')}
          style={styles.gridBtn}
        />
      </View>

      {/* Live GPS Summary Card */}
      <View style={styles.cardBox}>
        <View style={styles.cardBoxHeader}>
          <Text style={styles.cardBoxTitle}>Current Location Status</Text>
          <Ionicons
            name={location.latitude ? 'radio-button-on' : 'radio-button-off'}
            size={18}
            color={location.latitude ? '#16a34a' : '#94a3b8'}
          />
        </View>
        <Text style={styles.cardBoxBody}>
          {location.status === 'denied'
            ? '⚠️ GPS Permission was denied. Click below to review.'
            : location.latitude !== null
            ? `Lat: ${location.latitude}, Lon: ${location.longitude}\n${location.address || 'Location acquired'}`
            : 'Acquiring GPS fix...'}
        </Text>
        <CustomButton
          title="Open GPS Details"
          icon="navigate-outline"
          variant="outline"
          onPress={() => onNavigate('location')}
        />
      </View>

      {/* Primary Emergency Contact Preview (Reusable Component) */}
      <Text style={styles.sectionTitle}>Primary Emergency Hotline</Text>
      {primaryContact ? (
        <ContactCard
          id={primaryContact.id}
          name={primaryContact.name}
          phone={primaryContact.phone}
          relationship={primaryContact.relationship}
          isPrimary={true}
        />
      ) : (
        <Text style={styles.emptyText}>No emergency contact configured.</Text>
      )}

      {/* Recent Incidents Overview */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{incidents.length}</Text>
          <Text style={styles.statLabel}>Incidents Logged</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{contacts.length}</Text>
          <Text style={styles.statLabel}>Saved Contacts</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{safety.logs.length}</Text>
          <Text style={styles.statLabel}>Audit Events</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 12,
  },
  appIdentity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
  },
  appSubtitle: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  sosContainer: {
    marginVertical: 8,
  },
  sosButton: {
    paddingVertical: 18,
    borderRadius: 14,
    backgroundColor: '#dc2626',
  },
  sosButtonText: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1,
  },
  statusActionRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1e293b',
    marginTop: 18,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  gridBtn: {
    width: '48%',
    paddingVertical: 14,
  },
  cardBox: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardBoxHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardBoxTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  cardBoxBody: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 13,
    color: '#94a3b8',
    fontStyle: 'italic',
    marginVertical: 6,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: '#2563eb',
  },
  statLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
    marginTop: 2,
  },
});

export default DashboardScreen;

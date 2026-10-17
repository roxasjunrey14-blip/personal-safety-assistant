import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from './CustomButton';

/**
 * Reusable Component 5: LocationCard
 * Receives Props: latitude, longitude, altitude, accuracy, address, timestamp, status, errorMessage, onRefreshLocation, onSimulateLocation
 */
export const LocationCard = ({
  latitude,
  longitude,
  altitude,
  accuracy,
  address,
  timestamp,
  status = 'idle',
  errorMessage,
  onRefreshLocation,
  onSimulateLocation,
}) => {
  const isLoading = status === 'loading';
  const isDenied = status === 'denied';
  const isFailed = status === 'failed';
  const hasCoordinates = latitude !== null && longitude !== null;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.titleGroup}>
          <Ionicons name="navigate-circle" size={26} color="#2563eb" />
          <Text style={styles.title}>Live GPS Coordinates</Text>
        </View>

        <View
          style={[
            styles.statusPill,
            isDenied
              ? styles.pillDenied
              : hasCoordinates
              ? styles.pillActive
              : styles.pillIdle,
          ]}
        >
          <Text
            style={[
              styles.pillText,
              isDenied
                ? styles.textDenied
                : hasCoordinates
                ? styles.textActive
                : styles.textIdle,
            ]}
          >
            {isDenied
              ? 'PERMISSION DENIED'
              : isLoading
              ? 'ACQUIRING...'
              : hasCoordinates
              ? 'GPS ACTIVE'
              : 'OFFLINE'}
          </Text>
        </View>
      </View>

      {/* Permission Denied Notice */}
      {isDenied && (
        <View style={styles.alertBox}>
          <Ionicons name="warning" size={20} color="#b91c1c" />
          <View style={{ flex: 1 }}>
            <Text style={styles.alertTitle}>Location Permission Denied</Text>
            <Text style={styles.alertDesc}>
              {errorMessage || 'Personal Safety Assistant requires location permissions to broadcast your GPS during emergencies.'}
            </Text>
          </View>
        </View>
      )}

      {/* Other Error Notice */}
      {isFailed && !isDenied && (
        <View style={styles.alertBox}>
          <Ionicons name="alert-circle" size={20} color="#b91c1c" />
          <Text style={styles.alertDesc}>
            {errorMessage || 'Failed to receive GPS fix. Ensure location services are turned on.'}
          </Text>
        </View>
      )}

      {/* Coordinate Display Grid */}
      <View style={styles.coordGrid}>
        <View style={styles.coordBox}>
          <Text style={styles.coordLabel}>LATITUDE</Text>
          <Text style={styles.coordVal}>
            {latitude !== null ? latitude : '---.------'}
          </Text>
        </View>

        <View style={styles.coordBox}>
          <Text style={styles.coordLabel}>LONGITUDE</Text>
          <Text style={styles.coordVal}>
            {longitude !== null ? longitude : '---.------'}
          </Text>
        </View>
      </View>

      {/* Meta Info */}
      <View style={styles.metaRow}>
        <Text style={styles.metaText}>
          🎯 Accuracy: {accuracy ? `±${accuracy}m` : 'N/A'}
        </Text>
        <Text style={styles.metaText}>
          ⛰️ Alt: {altitude ? `${altitude}m` : 'N/A'}
        </Text>
        <Text style={styles.metaText}>
          🕒 {timestamp || 'Never'}
        </Text>
      </View>

      {address ? (
        <View style={styles.addressBox}>
          <Ionicons name="location" size={16} color="#0284c7" />
          <Text style={styles.addressText} numberOfLines={2}>
            {address}
          </Text>
        </View>
      ) : null}

      {/* Action Buttons */}
      <View style={styles.btnRow}>
        <CustomButton
          title={isLoading ? 'Locating...' : 'Refresh GPS'}
          icon="refresh"
          variant="primary"
          loading={isLoading}
          onPress={onRefreshLocation}
          style={{ flex: 1, marginRight: 6 }}
        />
        {onSimulateLocation && (
          <CustomButton
            title="Demo Safe GPS"
            icon="shield-outline"
            variant="outline"
            onPress={onSimulateLocation}
            style={{ flex: 1, marginLeft: 6 }}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0f172a',
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  pillActive: {
    backgroundColor: '#dcfce7',
  },
  pillDenied: {
    backgroundColor: '#fee2e2',
  },
  pillIdle: {
    backgroundColor: '#f1f5f9',
  },
  pillText: {
    fontSize: 10,
    fontWeight: '800',
  },
  textActive: {
    color: '#16a34a',
  },
  textDenied: {
    color: '#dc2626',
  },
  textIdle: {
    color: '#64748b',
  },
  alertBox: {
    backgroundColor: '#fee2e2',
    borderWidth: 1,
    borderColor: '#fca5a5',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  alertTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#991b1b',
  },
  alertDesc: {
    fontSize: 12,
    color: '#b91c1c',
    marginTop: 2,
  },
  coordGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  coordBox: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  coordLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
    marginBottom: 4,
  },
  coordVal: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    fontFamily: 'monospace',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    marginTop: 4,
  },
  metaText: {
    fontSize: 11,
    color: '#64748b',
  },
  addressBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f0f9ff',
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  addressText: {
    fontSize: 12,
    color: '#0369a1',
    flex: 1,
  },
  btnRow: {
    flexDirection: 'row',
    marginTop: 12,
  },
});

export default LocationCard;

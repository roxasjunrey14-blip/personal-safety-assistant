import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * Reusable Component 4: IncidentCard
 * Receives Props: id, title, description, timestamp, severity, imageUri, latitude, longitude, address, onDelete
 */
export const IncidentCard = ({
  id,
  title,
  description,
  timestamp,
  severity = 'Medium',
  imageUri,
  latitude,
  longitude,
  address,
  onDelete,
}) => {
  const getSeverityBadge = () => {
    switch (severity.toLowerCase()) {
      case 'high':
      case 'critical':
        return { bg: '#fee2e2', text: '#dc2626' };
      case 'low':
        return { bg: '#e0f2fe', text: '#0284c7' };
      case 'medium':
      default:
        return { bg: '#fef3c7', text: '#d97706' };
    }
  };

  const badgeTheme = getSeverityBadge();

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.titleInfo}>
          <Text style={styles.titleText}>{title}</Text>
          <Text style={styles.timestampText}>{timestamp}</Text>
        </View>

        <View style={styles.headerRight}>
          <View style={[styles.badge, { backgroundColor: badgeTheme.bg }]}>
            <Text style={[styles.badgeText, { color: badgeTheme.text }]}>
              {severity.toUpperCase()}
            </Text>
          </View>
          {onDelete && (
            <TouchableOpacity
              onPress={() => onDelete(id)}
              style={styles.deleteBtn}
            >
              <Ionicons name="trash-outline" size={16} color="#ef4444" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {description ? (
        <Text style={styles.descText}>{description}</Text>
      ) : null}

      {imageUri && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUri }} style={styles.incidentImage} resizeMode="cover" />
        </View>
      )}

      {(latitude !== null && longitude !== null) && (
        <View style={styles.geoBox}>
          <Ionicons name="location-sharp" size={14} color="#2563eb" />
          <Text style={styles.geoText}>
            GPS: {latitude}, {longitude}
          </Text>
        </View>
      )}

      {address ? (
        <Text style={styles.addressText}>📍 {address}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleInfo: {
    flex: 1,
  },
  titleText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  timestampText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  deleteBtn: {
    padding: 4,
  },
  descText: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 20,
    marginBottom: 8,
  },
  imageContainer: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#0f172a',
    marginVertical: 8,
  },
  incidentImage: {
    width: '100%',
    height: '100%',
  },
  geoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginTop: 4,
    gap: 4,
  },
  geoText: {
    fontSize: 12,
    color: '#1d4ed8',
    fontWeight: '600',
  },
  addressText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
    fontStyle: 'italic',
  },
});

export default IncidentCard;

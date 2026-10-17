import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * Reusable Component 2: StatusBadge
 * Receives Props: status ('SAFE' | 'WARNING' | 'EMERGENCY'), title, description, iconName, onPress
 */
export const StatusBadge = ({
  status = 'SAFE',
  title,
  description,
  iconName,
  onPress,
}) => {
  const getTheme = () => {
    switch (status) {
      case 'EMERGENCY':
        return {
          bg: '#fee2e2',
          border: '#ef4444',
          accent: '#b91c1c',
          iconDefault: 'alert-circle',
          label: 'CRITICAL EMERGENCY',
        };
      case 'WARNING':
        return {
          bg: '#fef3c7',
          border: '#f59e0b',
          accent: '#b45309',
          iconDefault: 'warning',
          label: 'ELEVATED CAUTION',
        };
      case 'SAFE':
      default:
        return {
          bg: '#dcfce7',
          border: '#22c55e',
          accent: '#15803d',
          iconDefault: 'shield-checkmark',
          label: 'NORMAL / SAFE',
        };
    }
  };

  const theme = getTheme();
  const icon = iconName || theme.iconDefault;

  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0.8 : 1}
      onPress={onPress}
      disabled={!onPress}
      style={[styles.container, { backgroundColor: theme.bg, borderColor: theme.border }]}
    >
      <View style={styles.topRow}>
        <View style={styles.badgeIndicator}>
          <View style={[styles.pulseDot, { backgroundColor: theme.accent }]} />
          <Text style={[styles.badgeText, { color: theme.accent }]}>
            {theme.label}
          </Text>
        </View>
        <Ionicons name={icon} size={28} color={theme.accent} />
      </View>

      <Text style={[styles.titleText, { color: theme.accent }]}>
        {title || `Current Status: ${status}`}
      </Text>

      {description ? (
        <Text style={styles.descText}>{description}</Text>
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 2,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  badgeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pulseDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  titleText: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  descText: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 18,
  },
});

export default StatusBadge;

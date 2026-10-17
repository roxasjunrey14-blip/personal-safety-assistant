import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * Reusable Component 3: ContactCard
 * Receives Props: id, name, phone, relationship, isPrimary, onCall, onDelete
 */
export const ContactCard = ({
  id,
  name,
  phone,
  relationship,
  isPrimary = false,
  onCall,
  onDelete,
}) => {
  const handleDirectCall = () => {
    if (onCall) {
      onCall(phone);
      return;
    }
    const phoneUrl = `tel:${phone}`;
    Linking.canOpenURL(phoneUrl)
      .then((supported) => {
        if (supported) {
          Linking.openURL(phoneUrl);
        } else {
          Alert.alert('Phone Call', `Dialing ${phone} (${name})`);
        }
      })
      .catch(() => {
        Alert.alert('Phone Call', `Dialing ${phone} (${name})`);
      });
  };

  return (
    <View style={[styles.card, isPrimary && styles.primaryCard]}>
      <View style={styles.avatar}>
        <Ionicons
          name={isPrimary ? 'shield-checkmark' : 'person'}
          size={24}
          color={isPrimary ? '#dc2626' : '#2563eb'}
        />
      </View>

      <View style={styles.infoCol}>
        <View style={styles.nameRow}>
          <Text style={styles.nameText}>{name}</Text>
          {isPrimary && (
            <View style={styles.primaryBadge}>
              <Text style={styles.primaryBadgeText}>PRIMARY</Text>
            </View>
          )}
        </View>
        <Text style={styles.relationText}>{relationship || 'Contact'}</Text>
        <Text style={styles.phoneText}>📞 {phone}</Text>
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.callButton}
          onPress={handleDirectCall}
          accessibilityLabel={`Call ${name}`}
        >
          <Ionicons name="call" size={18} color="#ffffff" />
        </TouchableOpacity>

        {onDelete && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => onDelete(id)}
            accessibilityLabel={`Delete ${name}`}
          >
            <Ionicons name="trash-outline" size={18} color="#dc2626" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    marginVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  primaryCard: {
    borderColor: '#fca5a5',
    backgroundColor: '#fff7f7',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoCol: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  nameText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  primaryBadge: {
    backgroundColor: '#dc2626',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  primaryBadgeText: {
    fontSize: 9,
    color: '#ffffff',
    fontWeight: '800',
  },
  relationText: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  phoneText: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '600',
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 6,
  },
  callButton: {
    backgroundColor: '#16a34a',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    backgroundColor: '#fee2e2',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ContactCard;

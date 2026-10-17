import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Switch,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '../components/CustomButton';
import ContactCard from '../components/ContactCard';
import {
  addContactThunk,
  deleteContactThunk,
} from '../../business/slices/contactSlice';
import { updateSafetyStatusThunk } from '../../business/slices/safetySlice';

export const ContactsScreen = ({ onBack }) => {
  const dispatch = useDispatch();
  const contacts = useSelector((state) => state.contacts.list);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relationship, setRelationship] = useState('');
  const [isPrimary, setIsPrimary] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddContact = () => {
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Please enter contact name.');
      return;
    }
    if (!phone.trim()) {
      Alert.alert('Validation Error', 'Please enter a valid phone number.');
      return;
    }

    dispatch(
      addContactThunk({
        name: name.trim(),
        phone: phone.trim(),
        relationship: relationship.trim() || 'Emergency Contact',
        isPrimary,
      })
    );

    dispatch(
      updateSafetyStatusThunk({
        status: 'SAFE',
        reason: `Added Emergency Contact: ${name.trim()} (${phone.trim()})`,
      })
    );

    setName('');
    setPhone('');
    setRelationship('');
    setIsPrimary(false);
    setShowAddForm(false);
    Alert.alert('Saved', 'Emergency contact saved securely to device storage.');
  };

  const handleDelete = (id) => {
    Alert.alert('Delete Contact', 'Are you sure you want to remove this contact?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => dispatch(deleteContactThunk(id)),
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        {onBack && (
          <CustomButton
            title="Back"
            icon="arrow-back"
            variant="outline"
            onPress={onBack}
            style={styles.backBtn}
          />
        )}
        <Text style={styles.screenTitle}>Emergency Contacts</Text>
      </View>
      <Text style={styles.screenSubtitle}>
        Contacts notified during SOS broadcasts. Saved locally via AsyncStorage.
      </Text>

      {/* Toggle Add Contact Form */}
      <CustomButton
        title={showAddForm ? 'Hide Contact Form' : '＋ Add Emergency Contact'}
        icon={showAddForm ? 'chevron-up' : 'person-add'}
        variant={showAddForm ? 'secondary' : 'primary'}
        onPress={() => setShowAddForm(!showAddForm)}
        style={{ marginBottom: 10 }}
      />

      {showAddForm && (
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>New Emergency Contact</Text>

          <Text style={styles.inputLabel}>Full Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Maria Santos / Police Precinct"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.inputLabel}>Phone / Hotline Number *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 09171234567 or 911"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <Text style={styles.inputLabel}>Relationship / Role</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Parent, Guardian, Police, Hospital"
            value={relationship}
            onChangeText={setRelationship}
          />

          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Set as Primary Contact</Text>
            <Switch
              value={isPrimary}
              onValueChange={setIsPrimary}
              trackColor={{ false: '#cbd5e1', true: '#f87171' }}
              thumbColor={isPrimary ? '#dc2626' : '#f1f5f9'}
            />
          </View>

          <CustomButton
            title="Save Contact to Storage"
            icon="save"
            variant="primary"
            onPress={handleAddContact}
            style={{ marginTop: 12 }}
          />
        </View>
      )}

      {/* Contact Cards List */}
      <Text style={styles.listHeading}>Saved Contacts ({contacts.length})</Text>

      {contacts.length === 0 ? (
        <View style={styles.emptyCard}>
          <Ionicons name="people-outline" size={36} color="#94a3b8" />
          <Text style={styles.emptyTitle}>No Contacts Configured</Text>
          <Text style={styles.emptySubtitle}>
            Add emergency numbers such as 911, Red Cross, or family members.
          </Text>
        </View>
      ) : (
        contacts.map((contact) => (
          <ContactCard
            key={contact.id}
            id={contact.id}
            name={contact.name}
            phone={contact.phone}
            relationship={contact.relationship}
            isPrimary={contact.isPrimary}
            onDelete={handleDelete}
          />
        ))
      )}
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4,
  },
  backBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginVertical: 0,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
  },
  screenSubtitle: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 12,
    lineHeight: 18,
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    marginTop: 8,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0f172a',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingVertical: 6,
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  listHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    marginVertical: 10,
  },
  emptyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#475569',
    marginTop: 8,
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 4,
  },
});

export default ContactsScreen;

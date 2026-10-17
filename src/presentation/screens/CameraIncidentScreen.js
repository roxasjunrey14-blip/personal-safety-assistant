import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Image,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '../components/CustomButton';
import IncidentCard from '../components/IncidentCard';
import {
  saveIncidentThunk,
  deleteIncidentThunk,
  setSelectedImageUri,
  clearSelectedImageUri,
} from '../../business/slices/incidentSlice';
import { updateSafetyStatusThunk } from '../../business/slices/safetySlice';

export const CameraIncidentScreen = ({ onBack }) => {
  const dispatch = useDispatch();
  const incidents = useSelector((state) => state.incidents.list);
  const selectedImageUri = useSelector((state) => state.incidents.selectedImageUri);
  const location = useSelector((state) => state.location);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState('Medium');
  const [permissionError, setPermissionError] = useState(null);

  // 1. Capture Photo with Device Camera
  const handleTakePhoto = async () => {
    try {
      setPermissionError(null);
      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      if (status !== 'granted') {
        const errorMsg = 'Camera permission was denied. Please allow camera access in your device settings.';
        setPermissionError(errorMsg);
        Alert.alert('Permission Denied', errorMsg);
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        dispatch(setSelectedImageUri(result.assets[0].uri));
      }
    } catch (err) {
      console.error('Camera error:', err);
      Alert.alert('Camera Error', err.message || 'Unable to open camera');
    }
  };

  // 2. Select Photo from Media Library
  const handleSelectFromGallery = async () => {
    try {
      setPermissionError(null);
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        const errorMsg = 'Gallery permission was denied. Please allow photo library access.';
        setPermissionError(errorMsg);
        Alert.alert('Permission Denied', errorMsg);
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        dispatch(setSelectedImageUri(result.assets[0].uri));
      }
    } catch (err) {
      console.error('Gallery error:', err);
      Alert.alert('Gallery Error', err.message || 'Unable to access photo library');
    }
  };

  // 3. Save Incident Report
  const handleSubmitReport = () => {
    if (!title.trim()) {
      Alert.alert('Validation Error', 'Please provide a title for the incident report.');
      return;
    }

    dispatch(
      saveIncidentThunk({
        title: title.trim(),
        description: description.trim(),
        severity,
        imageUri: selectedImageUri,
        latitude: location.latitude,
        longitude: location.longitude,
        address: location.address,
      })
    );

    // Update safety log
    dispatch(
      updateSafetyStatusThunk({
        status: severity === 'High' ? 'WARNING' : 'SAFE',
        reason: `New Incident Logged: ${title.trim()} (${severity} severity)`,
      })
    );

    // Reset form
    setTitle('');
    setDescription('');
    setSeverity('Medium');
    dispatch(clearSelectedImageUri());
    Alert.alert('Success', 'Incident report has been stored securely with geotagged GPS data.');
  };

  const handleDeleteIncident = (id) => {
    Alert.alert('Delete Report', 'Are you sure you want to delete this incident report?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => dispatch(deleteIncidentThunk(id)),
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
        <Text style={styles.screenTitle}>Incident & Evidence Camera</Text>
      </View>
      <Text style={styles.screenSubtitle}>
        Capture or select photographic evidence. Handled permissions and automatic GPS geotagging.
      </Text>

      {/* Permission Denied Notice if triggered */}
      {permissionError && (
        <View style={styles.errorBanner}>
          <Ionicons name="alert-circle" size={20} color="#b91c1c" />
          <Text style={styles.errorBannerText}>{permissionError}</Text>
        </View>
      )}

      {/* Incident Input Form */}
      <View style={styles.formCard}>
        <Text style={styles.formHeading}>Record Incident Report</Text>

        <Text style={styles.inputLabel}>Incident Title *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Suspicious Person / Road Hazard / Medical Event"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.inputLabel}>Severity Level</Text>
        <View style={styles.severityRow}>
          {['Low', 'Medium', 'High'].map((lvl) => {
            const isSelected = severity === lvl;
            return (
              <TouchableOpacity
                key={lvl}
                style={[
                  styles.severityPill,
                  isSelected && styles.severityPillSelected,
                  isSelected && lvl === 'High' && { backgroundColor: '#dc2626' },
                  isSelected && lvl === 'Medium' && { backgroundColor: '#d97706' },
                  isSelected && lvl === 'Low' && { backgroundColor: '#0284c7' },
                ]}
                onPress={() => setSeverity(lvl)}
              >
                <Text
                  style={[
                    styles.severityText,
                    isSelected && { color: '#ffffff', fontWeight: '800' },
                  ]}
                >
                  {lvl}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.inputLabel}>Description & Notes</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Provide context, observations, or emergency notes..."
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
        />

        {/* Camera / Photo Evidence Section */}
        <Text style={styles.inputLabel}>Photo Evidence (Camera / Gallery)</Text>
        {selectedImageUri ? (
          <View style={styles.previewContainer}>
            <Image source={{ uri: selectedImageUri }} style={styles.previewImage} />
            <TouchableOpacity
              style={styles.removePhotoBtn}
              onPress={() => dispatch(clearSelectedImageUri())}
            >
              <Ionicons name="close-circle" size={26} color="#ef4444" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.cameraBtnRow}>
            <CustomButton
              title="Take Photo"
              icon="camera"
              variant="primary"
              onPress={handleTakePhoto}
              style={{ flex: 1, marginRight: 6 }}
            />
            <CustomButton
              title="Choose Photo"
              icon="images"
              variant="outline"
              onPress={handleSelectFromGallery}
              style={{ flex: 1, marginLeft: 6 }}
            />
          </View>
        )}

        {/* GPS Geotag Indicator */}
        <View style={styles.geoBox}>
          <Ionicons name="location" size={16} color="#2563eb" />
          <Text style={styles.geoLabel}>
            Geotag:{' '}
            {location.latitude !== null
              ? `${location.latitude}, ${location.longitude}`
              : 'GPS pending (Will save without coords if offline)'}
          </Text>
        </View>

        <CustomButton
          title="Save & Submit Incident Report"
          icon="save-outline"
          variant="primary"
          style={{ marginTop: 14 }}
          onPress={handleSubmitReport}
        />
      </View>

      {/* History of Incidents */}
      <Text style={styles.sectionHeading}>
        Logged Incidents ({incidents.length})
      </Text>

      {incidents.length === 0 ? (
        <View style={styles.emptyCard}>
          <Ionicons name="shield-checkmark-outline" size={36} color="#94a3b8" />
          <Text style={styles.emptyTitle}>No Incidents Recorded</Text>
          <Text style={styles.emptySubtitle}>
            Use the camera and form above to report security incidents or attach evidence.
          </Text>
        </View>
      ) : (
        incidents.map((incident) => (
          <IncidentCard
            key={incident.id}
            id={incident.id}
            title={incident.title}
            description={incident.description}
            severity={incident.severity}
            timestamp={incident.timestamp}
            imageUri={incident.imageUri}
            latitude={incident.latitude}
            longitude={incident.longitude}
            address={incident.address}
            onDelete={handleDeleteIncident}
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
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fee2e2',
    borderColor: '#fca5a5',
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  errorBannerText: {
    fontSize: 12,
    color: '#b91c1c',
    flex: 1,
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  formHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 12,
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
  textArea: {
    height: 70,
    textAlignVertical: 'top',
  },
  severityRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 4,
  },
  severityPill: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
  },
  severityPillSelected: {
    borderColor: 'transparent',
  },
  severityText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  cameraBtnRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  previewContainer: {
    position: 'relative',
    height: 180,
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 6,
    backgroundColor: '#000',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  removePhotoBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#ffffff',
    borderRadius: 14,
  },
  geoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#eff6ff',
    padding: 8,
    borderRadius: 8,
    marginTop: 12,
  },
  geoLabel: {
    fontSize: 12,
    color: '#1e40af',
    fontWeight: '600',
  },
  sectionHeading: {
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

export default CameraIncidentScreen;

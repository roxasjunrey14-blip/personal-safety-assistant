import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * Reusable Component 1: CustomButton
 * Receives Props: title, onPress, variant, icon, loading, disabled, style, textStyle
 */
export const CustomButton = ({
  title,
  onPress,
  variant = 'primary', // 'primary' | 'danger' | 'warning' | 'secondary' | 'outline'
  icon,
  loading = false,
  disabled = false,
  style,
  textStyle,
}) => {
  const getBackgroundColor = () => {
    if (disabled) return '#94a3b8';
    switch (variant) {
      case 'danger':
        return '#dc2626';
      case 'warning':
        return '#d97706';
      case 'secondary':
        return '#475569';
      case 'outline':
        return 'transparent';
      case 'primary':
      default:
        return '#2563eb';
    }
  };

  const getTextColor = () => {
    if (variant === 'outline') return '#2563eb';
    return '#ffffff';
  };

  const isOutline = variant === 'outline';

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      style={[
        styles.button,
        { backgroundColor: getBackgroundColor() },
        isOutline && styles.outlineBorder,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <View style={styles.contentRow}>
          {icon && (
            <Ionicons
              name={icon}
              size={18}
              color={getTextColor()}
              style={styles.icon}
            />
          )}
          <Text style={[styles.text, { color: getTextColor() }, textStyle]}>
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  outlineBorder: {
    borderWidth: 1.5,
    borderColor: '#2563eb',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 8,
  },
  text: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  disabled: {
    opacity: 0.65,
    elevation: 0,
  },
});

export default CustomButton;

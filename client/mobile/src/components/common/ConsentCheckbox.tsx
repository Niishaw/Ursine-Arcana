import React from "react";
import { View, Text, TouchableOpacity, Linking } from "react-native";

interface ConsentCheckboxProps {
  checked: boolean;
  onToggle: () => void;
  label: string;
  linkText?: string;
  linkUrl?: string;
}

/**
 * Consent checkbox component with optional link
 * Used for Terms of Service, Privacy Policy, etc.
 */
export default function ConsentCheckbox({
  checked,
  onToggle,
  label,
  linkText,
  linkUrl,
}: ConsentCheckboxProps) {
  const handleLinkPress = () => {
    if (linkUrl) {
      Linking.openURL(linkUrl);
    }
  };

  return (
    <TouchableOpacity
      onPress={onToggle}
      className="flex-row items-start py-3"
      activeOpacity={0.7}
    >
      {/* Checkbox */}
      <View
        className={`w-6 h-6 rounded-md border-2 mr-3 items-center justify-center ${
          checked
            ? "bg-accent-500 border-accent-500"
            : "bg-transparent border-border-default"
        }`}
      >
        {checked && <Text className="text-white text-sm font-bold">✓</Text>}
      </View>

      {/* Label */}
      <View className="flex-1">
        <Text className="text-text-secondary text-base">
          {label.replace(linkText || "", "").trim()}{" "}
          {linkText && linkUrl && (
            <Text
              className="text-accent-500 underline"
              onPress={handleLinkPress}
            >
              {linkText}
            </Text>
          )}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

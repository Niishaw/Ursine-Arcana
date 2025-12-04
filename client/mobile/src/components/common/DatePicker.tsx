import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, Platform } from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

interface DatePickerProps {
  visible: boolean;
  date: Date;
  onConfirm: (date: Date) => void;
  onCancel: () => void;
  minimumDate?: Date;
  maximumDate?: Date;
}

/**
 * Cross-platform date picker component
 */
export default function DatePicker({
  visible,
  date,
  onConfirm,
  onCancel,
  minimumDate,
  maximumDate,
}: DatePickerProps) {
  const [selectedDate, setSelectedDate] = useState(date);

  const handleChange = (event: DateTimePickerEvent, newDate?: Date) => {
    if (Platform.OS === "android") {
      if (event.type === "dismissed") {
        onCancel();
      } else if (newDate) {
        onConfirm(newDate);
      }
    } else if (newDate) {
      setSelectedDate(newDate);
    }
  };

  const handleConfirm = () => {
    onConfirm(selectedDate);
  };

  // Android shows inline picker
  if (Platform.OS === "android") {
    if (!visible) return null;

    return (
      <DateTimePicker
        value={date}
        mode="date"
        display="default"
        onChange={handleChange}
        minimumDate={minimumDate}
        maximumDate={maximumDate}
      />
    );
  }

  // iOS shows modal picker
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-surface-primary rounded-t-3xl">
          {/* Header */}
          <View className="flex-row justify-between items-center px-4 py-3 border-b border-border-light">
            <TouchableOpacity onPress={onCancel}>
              <Text className="text-text-secondary text-lg">Cancel</Text>
            </TouchableOpacity>
            <Text className="text-text-primary font-semibold text-lg">
              Select Date
            </Text>
            <TouchableOpacity onPress={handleConfirm}>
              <Text className="text-accent-500 font-semibold text-lg">
                Done
              </Text>
            </TouchableOpacity>
          </View>

          {/* Picker */}
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="spinner"
            onChange={handleChange}
            minimumDate={minimumDate}
            maximumDate={maximumDate}
            textColor="#F9FAFB"
            style={{ height: 200 }}
          />
        </View>
      </View>
    </Modal>
  );
}

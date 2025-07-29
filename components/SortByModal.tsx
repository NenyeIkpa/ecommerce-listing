import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SortOption, SortOrder } from "@/types";

interface SortByModalProps {
  visible: boolean;
  onClose: () => void;
  selected: SortOption;
  onSelect: (value: SortOption) => void;
  order: SortOrder;
  onOrderSelect: (value: SortOrder) => void;
}

const sortOptions: {
  label: string;
  value: SortOption;
  order: "asc" | "desc";
}[] = [
  { label: "Title", value: "title", order: "asc" },
  //   { label: "Rating", value: "rating", order: "desc" },
  { label: "Lowest Price", value: "lowest-price", order: "asc" },
  { label: "Highest Price", value: "highest-price", order: "desc" },
];

export const SortByModal: React.FC<SortByModalProps> = ({
  visible,
  onClose,
  selected,
  onSelect,
  order,
  onOrderSelect,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Sort by</Text>
          {sortOptions.map((option) => (
            <Pressable
              key={option.label}
              style={styles.option}
              onPress={() => {
                onSelect(option.value);
                onOrderSelect(option.order);
                onClose();
              }}
            >
              <Text style={styles.optionLabel}>{option.label}</Text>
              <View
                style={{
                  ...styles.radioCircle,
                  borderColor: selected ? "orange" : "#000",
                }}
              >
                {selected === option.value && (
                  <View style={styles.selectedCircle} />
                )}
              </View>
            </Pressable>
          ))}
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  selectedCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "orange",
  },
  optionLabel: {
    fontSize: 16,
    color: "#000",
  },
});

// components/RatingStars.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

interface RatingStarsProps {
  rating: number; // e.g., 4.3
  size?: number; // default: 16
  color?: string; // default: '#facc15' (amber-400)
  maxStars?: number; // default: 5
}

export const RatingStars = ({
  rating,
  size = 16,
  color = "#facc15",
  maxStars = 5,
}: RatingStarsProps) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.25 && rating - fullStars < 0.75;
  const emptyStars = maxStars - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <View style={styles.container}>
      {[...Array(fullStars)].map((_, i) => (
        <FontAwesome key={`full-${i}`} name="star" size={size} color={color} />
      ))}

      {hasHalfStar && (
        <FontAwesome name="star-half-full" size={size} color={color} />
      )}

      {[...Array(emptyStars)].map((_, i) => (
        <FontAwesome
          key={`empty-${i}`}
          name="star-o"
          size={size}
          color={color}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
});

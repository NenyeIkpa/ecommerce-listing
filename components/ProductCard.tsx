import {
  StyleSheet,
  Text,
  Pressable,
  Image,
  useWindowDimensions,
  Dimensions,
} from "react-native";
import React from "react";
import { IProduct } from "@/types";
import { RatingStars } from "./RatingStars";
import { useRouter } from "expo-router";

const WIDTH = Dimensions.get("screen").width;

const ProductCard = ({ product }: { product: IProduct }) => {
  const router = useRouter();
  const handlePress = () => {
    router.push(`/${product.id}`);
  };
  return (
    <Pressable onPress={handlePress} style={styles.container}>
      <Image
        source={{ uri: product.thumbnail }}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.text}>{product.brand}</Text>
      <Text numberOfLines={1} style={styles.title}>
        {product.title}
      </Text>
      <Text style={styles.text}>${product.price}</Text>
      <RatingStars rating={product.rating} />
    </Pressable>
  );
};

export default React.memo(ProductCard);

const styles = StyleSheet.create({
  container: {
    width: WIDTH / 2 - 10,
    height: 200,
    backgroundColor: "white",
    margin: 10,
    borderRadius: 10,
    overflow: "hidden",
    padding: 10,
  },
  image: {
    width: "100%",
    height: 100,
    borderRadius: 10,
    paddingBottom: 8,
    flex: 1,
  },
  title: { fontSize: 16, fontWeight: "bold" },
  text: { color: "#666" },
});

import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { RatingStars } from "@/components/RatingStars";
import { IProduct } from "@/types";
import { Entypo } from "@expo/vector-icons";
import { fetchProductDetails } from "@/api/api";

const Product = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const { productId } = useLocalSearchParams<{ productId: string }>();
  const [product, setProduct] = useState<IProduct | undefined>(undefined);
  const [showReviews, setShowReviews] = useState<boolean>(false);
  const [imageIndex, setImageIndex] = useState<number>(0);
  const canGoBack = product && imageIndex > 0;
  const canGoForward = product && imageIndex < product?.images?.length - 1;

  const fetchProduct = async () => {
    setLoading(true);
    try {
      let product = await fetchProductDetails(Number(productId));
      setProduct(product.data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProduct();
    setImageIndex(0);
  }, []);

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#01031B"
        style={[StyleSheet.absoluteFillObject]}
      />
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Entypo
        name={"chevron-left"}
        size={24}
        color="black"
        style={{ padding: 10 }}
        onPress={() => router.back()}
      />
      <ScrollView
        bounces={false}
        style={styles.container}
        contentContainerStyle={{ justifyContent: "flex-end" }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageContainer}>
          {canGoBack && (
            <Entypo
              name={"chevron-left"}
              size={24}
              color="black"
              style={[styles.chevron, styles.chevronLeft]}
              onPress={() => setImageIndex(imageIndex - 1)}
            />
          )}
          <Image
            source={{ uri: product?.images[imageIndex] }}
            style={styles.image}
            resizeMode="contain"
          />
          {canGoForward && (
            <Entypo
              name={"chevron-right"}
              size={24}
              color="black"
              style={[styles.chevron, styles.chevronRight]}
              onPress={() => setImageIndex(imageIndex + 1)}
            />
          )}
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{product?.title}</Text>
          <View style={styles.priceRatingContainer}>
            <Text style={styles.price}>${product?.price}</Text>
            {product?.rating && <RatingStars rating={product?.rating} />}
          </View>
          <Text style={styles.description}>{product?.description}</Text>
          <Text style={styles.brand}>Brand: {product?.brand}</Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>Reviews</Text>
          <Entypo
            name={showReviews ? "chevron-down" : "chevron-right"}
            size={24}
            color="black"
            style={{ marginTop: 2 }}
            onPress={() => setShowReviews(!showReviews)}
          />
        </View>
        {showReviews
          ? product &&
            product?.reviews?.length > 0 &&
            product?.reviews.map((review, index) => (
              <View
                key={index}
                style={{
                  borderWidth: 0.25,
                  borderColor: "#000",
                  padding: 8,
                  borderRadius: 8,
                  marginBottom: 10,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontWeight: "bold" }}>
                    {review.reviewerName}
                  </Text>
                  <Text style={{ marginLeft: 5, color: "#888" }}>
                    {new Date(review.date).toLocaleDateString()}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text>{review.comment}</Text>
                  <RatingStars
                    rating={review.rating}
                    size={14}
                    color="#facc15"
                  />
                </View>
              </View>
            ))
          : null}

        {/* Add more details or components as needed */}
        {/* <Link href={"/"}>
          <Text style={styles.backButton}>Go Back to Home</Text>
        </Link> */}
      </ScrollView>
      <StatusBar style="dark" />
    </SafeAreaView>
  );
};

export default Product;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f9f9f9", // Light background color
  },
  container: {
    flex: 1,
    padding: 8,
  },
  imageContainer: {
    height: 300, // Fixed image height
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  title: { fontSize: 16, fontWeight: "bold" },
  detailsContainer: {
    padding: 8,
  },
  priceRatingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    color: "green",
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 10,
    textAlign: "justify",
  },
  brand: {
    fontSize: 14,
    color: "#888",
    marginBottom: 20,
  },
  backButton: {
    color: "blue",
    fontSize: 16,
    marginTop: 20,
    textAlign: "center",
  },
  chevron: {
    position: "absolute",
    top: "45%",
    padding: 10,
    zIndex: 1,
    borderRadius: 20,
  },
  chevronLeft: {
    left: 10,
  },
  chevronRight: {
    right: 10,
  },
});

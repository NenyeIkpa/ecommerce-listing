import {
  StyleSheet,
  SafeAreaView,
  TextInput,
  View,
  Image,
  Text,
  ActivityIndicator,
  useWindowDimensions,
  Pressable,
  FlatList,
} from "react-native";
import React, { useState } from "react";
import { Feather, Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useProductContext } from "@/context/ProductContext";
import { Product } from "@/types";
import { useRouter } from "expo-router";
import ProductCard from "@/components/ProductCard";

const Home = () => {
  const router = useRouter();

  const { products, error, appIsReady } = useProductContext();
  const [searchText, setSearchText] = useState<string>("");

  const _renderItem = ({ item }: { item: Product }) => (
    <ProductCard
      product={item}
      handlePress={() => router.push(`/${item.id}`)}
    />
  );

  if (!appIsReady)
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#01031B",
        }}
      >
        <Image
          source={require("@/assets/images/splash-icon.png")}
          style={{ width: 100, height: 100 }}
        />
      </View>
    );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <View style={styles.search}>
            <Ionicons
              name="search"
              size={20}
              color="#999"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Ask me anything"
              placeholderTextColor="#999"
              value={searchText}
              onChangeText={setSearchText}
              returnKeyType="search"
            />
          </View>
        </View>
        <View style={styles.cart}>
          <Feather name="shopping-cart" size={24} color="white" />
        </View>
      </View>
      <FlatList
        bounces={false}
        showsVerticalScrollIndicator={false}
        data={products}
        renderItem={_renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.content}
      />
      <StatusBar style="light" />
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#01031B",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#01031B",
    paddingTop: 20,
    marginBottom: 10,
  },
  searchContainer: {
    width: "85%",
    alignSelf: "center",
    backgroundColor: "#F0F2F5",
    borderRadius: 8,
    height: 50,
    paddingHorizontal: 4,
    shadowColor: "#00000080",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 2,
    shadowRadius: 2,
    elevation: 3,
  },
  search: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "#333",
    paddingStart: 4,
  },
  searchIcon: {
    marginLeft: 8,
  },
  cart: {
    backgroundColor: "orange",
    borderRadius: 24,
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    justifyContent: "center",
    alignItems: "center",
  },
});

import {
  StyleSheet,
  SafeAreaView,
  TextInput,
  View,
  Image,
  Text,
  ScrollView,
  ActivityIndicator,
  useWindowDimensions,
  Pressable,
  FlatList,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { Feather, Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

import { IProduct, SortOption, SortOrder } from "@/types";
import { useRouter } from "expo-router";
import { capitalizeFirstLetter } from "@/utils";
import ProductCard from "@/components/ProductCard";
import { useProductContext } from "@/context/ProductContext";
import { SortByModal } from "@/components/SortByModal";

const Home = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const { categories, products, error, appIsReady } = useProductContext();
  const [searchText, setSearchText] = useState<string>("");
  const [categoryOption, setCategoryOption] = useState<string>("");
  const [productList, setProductList] = useState<IProduct[]>(products);
  const [modalVisible, setModalVisible] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("title");
  const [order, setOrder] = useState<SortOrder>("asc");

  useEffect(() => {
    setProductList(products);
    setCategoryOption("");
  }, [appIsReady]);

  useEffect(() => {
    if (sortBy !== "title") {
      sortBySelection();
    } else {
      setProductList(products);
    }
  }, [sortBy]);

  const onCategoryPressed = (selected: string) => {
    if (categoryOption === selected) {
      setCategoryOption("");
      setProductList(products);
    } else {
      setCategoryOption(selected);
      fetchProductsByCategory(selected);
    }
  };

  const sortBySelection = async () => {
    const sortFinal =
      sortBy === "lowest-price" || "highest-price" ? "price" : sortBy;

    try {
      const data = await fetch(
        `https://dummyjson.com/products?sortBy=${sortFinal}&order=${order}?limit=20`
      ).then((res) => res.json());
      setCategoryOption("");
      setProductList(data.products);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchProductsByCategory = useCallback(
    async (category: string) => {
      console.log("fetchProductsByCategory", category);
      setLoading(true);
      try {
        let data = await fetch(
          `https://dummyjson.com/products/category/${category}`
        ).then((res) => {
          return res.json();
        });
        console.log(
          "fetchProductsByCategory res",
          JSON.stringify(data, null, 2)
        );
        setProductList(data.products);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    },
    [categoryOption]
  );

  const _renderItem = ({ item }: { item: IProduct }) => (
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
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        bounces={false}
        style={{
          paddingVertical: 10,
          backgroundColor: "white",
        }}
      >
        {categories.length > 0 &&
          categories.map((category) => {
            let isSelected = categoryOption === category;
            return (
              <Pressable
                key={category}
                onPress={() => onCategoryPressed(category)}
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  backgroundColor: isSelected ? "white " : "#01031B",
                  marginHorizontal: 8,
                  borderRadius: 16,
                  height: 30,
                  borderWidth: isSelected ? 1 : 0,
                  borderColor: "#01031B",
                }}
              >
                <Text
                  style={{
                    color: isSelected ? "#01031B" : "white",
                    fontWeight: "bold",
                  }}
                >
                  {capitalizeFirstLetter(category)}
                </Text>
              </Pressable>
            );
          })}
        {loading && <ActivityIndicator size="large" color="#01031B" />}
      </ScrollView>
      <FlatList
        bounces={false}
        showsVerticalScrollIndicator={false}
        data={productList}
        renderItem={_renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.content}
        style={{ backgroundColor: "white" }}
      />
      <View
        style={{
          // width: "40%",
          height: 40,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#000",
          paddingHorizontal: 20,
          borderRadius: 20,
          alignSelf: "center",
          position: "absolute",
          bottom: 60,
        }}
      >
        <Text onPress={() => setModalVisible(true)} style={styles.text}>
          Sort
        </Text>
        {/* <View style={{ height: 10, width: 0.5, backgroundColor: "white" }} />
        <Text style={styles.text}>Filter</Text> */}
      </View>
      <SortByModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        selected={sortBy}
        onSelect={(value) => setSortBy(value)}
        order={order}
        onOrderSelect={setOrder}
      />
      <StatusBar style="light" backgroundColor="#01031B" />
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
  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

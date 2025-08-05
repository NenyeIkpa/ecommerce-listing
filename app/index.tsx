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
import {
  fetchProductsByCategory,
  fetchSortedProducts,
  searchProducts,
} from "@/api/api";

const Home = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const { categories, products, page, setPage, error, setError, appIsReady } =
    useProductContext();
  const [searchText, setSearchText] = useState<string>("");
  const [categoryOption, setCategoryOption] = useState<string>("");
  const [productList, setProductList] = useState<IProduct[]>(products);
  const [modalVisible, setModalVisible] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("title");
  const [order, setOrder] = useState<SortOrder>("asc");
  const [noResultFound, setNoResultFound] = useState(false);

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

  const search = useCallback(
    async (searchString: string) => {
      if (searchString.trim() === "") {
        return;
      }
      try {
        setCategoryOption("");
        let response = await searchProducts(searchString);
        if (response.data && response.data.products.length > 0) {
          setProductList(response.data.products);
          setNoResultFound(false);
        } else {
          setNoResultFound(true);
        }
        if (response.error) {
          setError(response.error);
        }
      } catch (error: any) {
        setError(error.message || "Failed to search products");
      }
    },
    [searchText]
  );
  const onCategoryPressed = (selected: string) => {
    setSearchText("");
    if (categoryOption === selected) {
      setCategoryOption("");
      setProductList(products);
    } else {
      setCategoryOption(selected);
      getProductsByCategory(selected);
    }
  };

  const sortBySelection = useCallback(async () => {
    const sortFinal =
      sortBy === "lowest-price" || "highest-price" ? "price" : sortBy;

    try {
      const response = await fetchSortedProducts(sortFinal, order);
      setCategoryOption("");
      if (response.data) setProductList(response.data.products);
      if (response.error) setError(response.error);
    } catch (error) {
      console.log(error);
    }
  }, [page]);

  const getProductsByCategory = useCallback(
    async (category: string) => {
      setLoading(true);
      try {
        let response = await fetchProductsByCategory(category);
        setProductList(response.data.products);
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
              onPress={() => search(searchText)}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Ask me anything"
              placeholderTextColor="#999"
              value={searchText}
              onChangeText={setSearchText}
              returnKeyType="search"
              onSubmitEditing={(e) => search(e.nativeEvent.text)}
            />
            {searchText && (
              <Ionicons
                name="close-circle-outline"
                size={24}
                color="#999"
                style={styles.searchIcon}
                onPress={() => {
                  setSearchText("");
                  setNoResultFound(false);
                  setProductList(products);
                }}
              />
            )}
          </View>
        </View>
        <View style={styles.cart}>
          <Feather name="shopping-cart" size={24} color="white" />
        </View>
      </View>
      {noResultFound && (
        <Text
          style={styles.noResultsFound}
        >{`No Results Found for ${searchText}`}</Text>
      )}
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
        onEndReached={() => setPage(page + 1)}
        onEndReachedThreshold={0.5}
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
  noResultsFound: {
    color: "#fff",
    fontSize: 16,
    fontStyle: "italic",
    fontWeight: "bold",
    paddingVertical: 10,
  },
});

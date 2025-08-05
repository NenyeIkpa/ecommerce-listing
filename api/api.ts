import { Filters } from "@/types";

const fetchFromApi = async (endpoint: string) => {
  try {
    const res = await fetch(endpoint);
    if (!res.ok) throw new Error("API request failed");
    const data = await res.json();
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message || "Something went wrong" };
  }
};

export const fetchProducts = async (page: number = 0, limit: number = 20) =>
  fetchFromApi(
    `https://dummyjson.com/products?limit=${limit}&skip=${page * limit}`
  );

export const fetchProductCategories = async () =>
  fetchFromApi("https://dummyjson.com/products/category-list");

export const fetchProductsByCategory = async (category: string) =>
  fetchFromApi(`https://dummyjson.com/products/category/${category}`);

export const searchProducts = async (query: string) =>
  fetchFromApi(
    `https://dummyjson.com/products/search?q=${encodeURIComponent(query)}`
  );

export const fetchSortedProducts = async (
  sortBy: string,
  order: string,
  page: number = 0,
  limit: number = 20
) =>
  fetchFromApi(
    `https://dummyjson.com/products?sortBy=${sortBy}&order=${order}&limit=${limit}&skip=${
      page * limit
    }`
  );

export const fetchProductDetails = async (id: number) =>
  fetchFromApi(`https://dummyjson.com/products/${id}`);

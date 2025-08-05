import { fetchProductCategories, fetchProducts } from "@/api/api";
import { Filters, IProduct } from "@/types";
import { SplashScreen } from "expo-router";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface ProductContextType {
  error: string | null;
  setError: (error: string | null) => void;
  categories: string[];
  products: IProduct[];
  setProducts: (product: IProduct[]) => void;
  page: number;
  setPage: (page: number) => void;
  appIsReady: boolean;
}

const ProductContext = createContext<ProductContextType | null>(null);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [page, setPage] = useState<number>(0);
  const [appIsReady, setAppIsReady] = useState<boolean>(false);

  const getProductCategories = async () => {
    try {
      const productCategories = await fetchProductCategories();
      if (productCategories.error) {
        setError(productCategories.error);
        return;
      }
      if (productCategories.data)
        setCategories(productCategories.data.toReversed());
    } catch {
      (e: Error) => {
        console.log(e);
        setError(e.message || "Failed to fetch product categories");
      };
    }
  };

  useEffect(() => {
    const prepareApp = async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
        const response = await fetchProducts(page);
        if (response.data) {
          setProducts((prev) => [...prev, ...response.data.products]);
        }
        if (response.error) setError(response.error);
        await SplashScreen.hideAsync();
      } catch (error: any) {
        console.error("Error fetching products:", error);
        setError(error.message || "Failed to load products");
      } finally {
        setAppIsReady(true);
      }
    };

    getProductCategories();
    prepareApp();
  }, [page]);

  return (
    <ProductContext
      value={{
        error,
        setError,
        categories,
        products,
        setProducts,
        page,
        setPage,
        appIsReady,
      }}
    >
      {children}
    </ProductContext>
  );
};

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context)
    throw new Error("useProductContext must be used within ProductProvider");
  return context;
};

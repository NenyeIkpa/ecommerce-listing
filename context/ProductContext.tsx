import { Filters, Product } from "@/types";
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
  products: Product[];
  setProducts: (product: Product[]) => void;
  page: number;
  setPage: (page: number) => void;
  filters: Filters;
  setFilters: (filter: Filters) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  appIsReady: boolean;
}

const ProductContext = createContext<ProductContextType | null>(null);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState<number>(0);
  const [filters, setFilters] = useState<Filters>({
    category: "",
    brand: "",
    priceRange: { min: 0, max: 0 },
  });
  const [sortBy, setSortBy] = useState<string>("");
  const [appIsReady, setAppIsReady] = useState<boolean>(false);

  useEffect(() => {
    const prepareApp = async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
        const data = await fetch(
          `https://dummyjson.com/products?limit=20&skip=${page * 20}`
        )
          .then((response) => {
            return response.json();
          })
          .catch((e) => {
            console.log(e);
            setError(e.message || "Failed to fetch products");
          });

        setProducts(data.products);
        await SplashScreen.hideAsync();
      } catch (error: any) {
        console.error("Error fetching products:", error);
        setError(error.message || "Failed to load products");
      } finally {
        setAppIsReady(true);
      }
    };

    prepareApp();
  }, []);

  return (
    <ProductContext
      value={{
        error,
        products,
        setProducts,
        page,
        setPage,
        filters,
        setFilters,
        sortBy,
        setSortBy,
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

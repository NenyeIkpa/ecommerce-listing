export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand: string;
  sku: string;
  weight: number;

  dimensions: {
    width: number;
    height: number;
    depth: number;
  };

  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;

  reviews: Review[];

  returnPolicy: string;
  minimumOrderQuantity: number;

  meta: {
    createdAt: string; // ISO string
    updatedAt: string;
    barcode: string;
    qrCode: string;
  };

  images: string[];
  thumbnail: string;
}

export interface Review {
  rating: number;
  comment: string;
  date: string; // ISO string
  reviewerName: string;
  reviewerEmail: string;
}

export interface Filters {
  search?: string;
  category?: string;
  brand?: string;
  priceRange?: { min: number; max: number };
  discountRange?: { min: number; max: number };
  ratingAbove?: number;
  tags?: string[];
  availabilityStatus?: "In Stock" | "Out of Stock" | "Limited Stock";
  minimumOrderQuantity?: number;
  shippingSpeed?: string;
}

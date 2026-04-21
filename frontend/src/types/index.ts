// Schema-exact TypeScript types for KisanMitra
// Mirrors the database schema exactly — swap mock calls for real API later

export type UserRole = 'farmer' | 'buyer' | 'seller';
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type ProductType = 'fresh_produce' | 'grain' | 'dairy' | 'processed' | 'seeds' | 'fertilizer';

export interface User {
  user_id: number;
  full_name: string;
  phone_number: string;
  email?: string;
  role: UserRole;
  is_verified: boolean;
  created_at: string;
  // Extended profile fields
  location?: string;          // city/state from Addresses.is_default
  farm_size?: string;         // farmer-specific
  crop_type?: string;         // farmer-specific
  business_name?: string;     // buyer/seller-specific
  business_type?: string;     // buyer/seller-specific
  preferred_language?: string;
  addresses?: Address[];
}

export interface Address {
  address_id: number;
  user_id: number;
  address_type: string; // 'home' | 'farm' | 'business'
  street_address: string;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
}

export interface Category {
  category_id: number;
  name: string;
  parent_category_id?: number;
  children?: Category[];
}

export interface Product {
  product_id: number;
  seller_id: number;
  category_id: number;
  type: ProductType;
  name: string;
  description?: string;
  price_per_unit: number;
  unit_of_measure: string; // 'kg' | 'quintal' | 'ton' | 'litre' | 'piece'
  stock_quantity: number;
  harvest_date?: string;
  shelf_life_days?: number;
  farming_method?: string; // 'organic' | 'conventional' | 'natural'
  created_at: string;
  is_active: boolean;
  // Joined / computed fields
  seller?: Partial<User>;
  category?: Category;
  avg_rating?: number;
  review_count?: number;
}

export interface CartItem {
  cart_item_id: number;
  buyer_id: number;
  product_id: number;
  quantity: number;
  added_at: string;
  product?: Product;
}

export interface Order {
  order_id: number;
  buyer_id: number;
  total_amount: number;
  shipping_address_id: number;
  current_status: OrderStatus;
  created_at: string;
  items?: OrderItem[];
  payment?: Payment;
  status_history?: OrderStatusHistory[];
}

export interface OrderItem {
  order_item_id: number;
  order_id: number;
  product_id: number;
  seller_id: number;
  quantity: number;
  price_at_purchase: number;
  product?: Product;
}

export interface Payment {
  payment_id: number;
  order_id: number;
  transaction_id?: string;
  amount: number;
  payment_method?: string;
  status: PaymentStatus;
  created_at: string;
}

export interface Review {
  review_id: number;
  product_id: number;
  reviewer_id: number;
  rating: number;
  comment?: string;
  created_at: string;
  reviewer?: Partial<User>;
}

export interface OrderStatusHistory {
  history_id: number;
  order_id: number;
  status: OrderStatus;
  updated_by: number;
  comments?: string;
  created_at: string;
}

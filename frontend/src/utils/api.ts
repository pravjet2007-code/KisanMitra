const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// ── Helpers ────────────────────────────────────────────────────────
async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(
      Array.isArray(err.detail)
        ? err.detail.map((d: { msg: string }) => d.msg).join(", ")
        : err.detail ?? "Request failed"
    );
  }
  return res.json() as Promise<T>;
}

// ── Auth ───────────────────────────────────────────────────────────
export interface VerifyOtpResponse {
    access_token: string;
    token_type: string;
    is_new_user: boolean;
}

export const authApi = {
    sendOtp: async (phone: string): Promise<void> => {
        const res = await fetch(`${BASE_URL}/api/auth/send-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone }),
        });
        await handleResponse<string>(res);
    },

    verifyOtp: async (
        phone: string,
        otp: string,
        full_name: string,
        password: string
    ): Promise<VerifyOtpResponse> => {
        const res = await fetch(`${BASE_URL}/api/auth/verify-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone, otp, full_name, password }),
        });
        return handleResponse<VerifyOtpResponse>(res);
    },
};

// ── Helpers ────────────────────────────────────────────────────────
function getToken(): string | null {
    return localStorage.getItem('km_token');
}

function authHeaders(customToken?: string): Record<string, string> {
    const token = customToken || getToken();
    return {
        'Content-Type': 'application/json',
        ...(token ? { authorization: token.startsWith('Bearer ') ? token : `Bearer ${token}` } : {}),
    };
}

// ── Products ───────────────────────────────────────────────────────
import type { Product, Address, AddressCreate, AddressUpdate, Review, CreateReviewPayload, FarmerAnalytics } from '../types';

export type ApiProductType = 'PRODUCE' | 'INPUT';

export interface ApiProduct {
    product_id: number;
    product_uuid: string;
    seller_id: number;
    category_id: number;
    type: ApiProductType;
    name: string;
    description?: string;
    price_per_unit: string;
    unit_of_measure: string;
    stock_quantity: string;
    harvest_date?: string;
    shelf_life_days?: number;
    farming_method?: string;
    image_url?: string;
    average_rating: number;
    review_count: number;
    created_at: string;
    is_active: boolean;
}

export interface ProductsResponse {
    total: number;
    page: number;
    limit: number;
    pages: number;
    items: ApiProduct[];
}

export interface ProductsQuery {
    skip?: number;
    limit?: number;
    q?: string;
    category_id?: number;
    min_price?: number;
    max_price?: number;
    min_rating?: number;
    sort_by?: 'newest' | 'price_asc' | 'price_desc';
}

export interface CreateProductPayload {
    name: string;
    category_id: number;
    type: ApiProductType;
    description?: string;
    price_per_unit: number;
    unit_of_measure: string;
    stock_quantity: number;
    harvest_date?: string;
    shelf_life_days?: number;
    farming_method?: string;
    image_url?: string;
    seller_id: number;
    average_rating?: number;
    review_count?: number;
}

export interface UpdateProductPayload {
    name?: string;
    category_id?: number;
    type?: ApiProductType;
    description?: string;
    price_per_unit?: number;
    unit_of_measure?: string;
    stock_quantity?: number;
    harvest_date?: string;
    shelf_life_days?: number;
    farming_method?: string;
    image_url?: string;
    is_active?: boolean;
}

export const productsApi = {
    list: async (query: ProductsQuery = {}): Promise<ProductsResponse> => {
        const params = new URLSearchParams();
        if (query.skip !== undefined) params.set('skip', String(query.skip));
        if (query.limit !== undefined) params.set('limit', String(query.limit));
        if (query.q) params.set('q', query.q);
        if (query.category_id) params.set('category_id', String(query.category_id));
        if (query.min_price !== undefined) params.set('min_price', String(query.min_price));
        if (query.max_price !== undefined) params.set('max_price', String(query.max_price));
        if (query.min_rating !== undefined) params.set('min_rating', String(query.min_rating));
        if (query.sort_by) params.set('sort_by', query.sort_by);

        const res = await fetch(`${BASE_URL}/api/v1/products/?${params}`);
        return handleResponse<ProductsResponse>(res);
    },

    get: async (product_id: number): Promise<ApiProduct> => {
        const res = await fetch(`${BASE_URL}/api/v1/products/${product_id}`);
        return handleResponse<ApiProduct>(res);
    },

    getByUuid: async (uuid: string): Promise<ApiProduct> => {
        const res = await fetch(`${BASE_URL}/api/v1/products/uuid/${uuid}`);
        return handleResponse<ApiProduct>(res);
    },

    create: async (payload: CreateProductPayload): Promise<ApiProduct> => {
        const res = await fetch(`${BASE_URL}/api/v1/products/`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify(payload),
        });
        return handleResponse<ApiProduct>(res);
    },

    update: async (product_id: number, payload: UpdateProductPayload): Promise<ApiProduct> => {
        const res = await fetch(`${BASE_URL}/api/v1/products/${product_id}`, {
            method: 'PUT',
            headers: authHeaders(),
            body: JSON.stringify(payload),
        });
        return handleResponse<ApiProduct>(res);
    },

    delete: async (product_id: number): Promise<void> => {
        const res = await fetch(`${BASE_URL}/api/v1/products/${product_id}`, {
            method: 'DELETE',
            headers: authHeaders(),
        });
        await handleResponse<string>(res);
    },

    processImage: async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch(`${BASE_URL}/api/v1/products/process-image`, {
            method: 'POST',
            body: formData,
        });
        const data = await handleResponse<{ image_data: string }>(res);
        return data.image_data;
    },

    getCategories: async (): Promise<{ category_id: number; name: string; parent_category_id?: number }[]> => {
        const res = await fetch(`${BASE_URL}/api/v1/products/categories`);
        return handleResponse<{ category_id: number; name: string; parent_category_id?: number }[]>(res);
    },
};

// ── Type mappers ───────────────────────────────────────────────────
const typeMap: Record<ApiProductType, Product['type']> = {
    PRODUCE: 'fresh_produce',
    INPUT: 'seeds',
};

export const typeMapReverse: Record<Product['type'], ApiProductType> = {
    fresh_produce: 'PRODUCE',
    grain: 'PRODUCE',
    dairy: 'PRODUCE',
    processed: 'PRODUCE',
    seeds: 'INPUT',
    fertilizer: 'INPUT',
};

export function toLocalProduct(p: ApiProduct): Product {
    return {
        product_id: p.product_id,
        seller_id: p.seller_id,
        category_id: p.category_id,
        type: typeMap[p.type] ?? 'fresh_produce',
        name: p.name,
        description: p.description,
        price_per_unit: parseFloat(p.price_per_unit),
        unit_of_measure: p.unit_of_measure,
        stock_quantity: parseFloat(p.stock_quantity),
        harvest_date: p.harvest_date,
        shelf_life_days: p.shelf_life_days,
        farming_method: p.farming_method,
        created_at: p.created_at,
        is_active: p.is_active,
        avg_rating: p.average_rating,
        review_count: p.review_count,
    };
}

// ── Orders ─────────────────────────────────────────────────────────
export type OrderStatus =
    | 'PENDING'
    | 'CONFIRMED'
    | 'PROCESSING'
    | 'SHIPPED'
    | 'OUT_FOR_DELIVERY'
    | 'DELIVERED'
    | 'CANCELLED';

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export interface OrderItem {
    product_id: number;
    quantity: string;
    order_item_id: number;
    seller_id: number;
    price_at_purchase: string;
}

export interface OrderStatusHistory {
    status: OrderStatus;
    comments: string;
    history_id: number;
    updated_by: number;
    created_at: string;
}

export interface OrderPayment {
    transaction_id: string;
    amount: string;
    payment_method: string;
    status: PaymentStatus;
    payment_id: number;
    created_at: string;
}

export interface ApiOrder {
    buyer_id: number;
    shipping_address_id: number;
    order_id: number;
    order_uuid: string;
    total_amount: string;         // decimal as string, same pattern as price_per_unit
    current_status: OrderStatus;
    created_at: string;
    items: OrderItem[];
    status_history: OrderStatusHistory[];
    payment: OrderPayment;
}

export interface CreateOrderItemPayload {
    product_id: number;
    quantity: number;
}

export interface CreateOrderPayload {
    buyer_id: number;
    shipping_address_id: number;
    items: CreateOrderItemPayload[];
}

export const ordersApi = {
    /** POST /api/v1/orders/ — Create order manually */
    create: async (payload: CreateOrderPayload): Promise<ApiOrder> => {
        const res = await fetch(`${BASE_URL}/api/v1/orders/`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify(payload),
        });
        return handleResponse<ApiOrder>(res);
    },

    /** GET /api/v1/orders/{order_id} */
    get: async (order_id: number): Promise<ApiOrder> => {
        const res = await fetch(`${BASE_URL}/api/v1/orders/${order_id}`, {
            headers: authHeaders(),
        });
        return handleResponse<ApiOrder>(res);
    },

    /** GET /api/v1/orders/uuid/{order_uuid} — for public tracking links */
    getByUuid: async (order_uuid: string): Promise<ApiOrder> => {
        const res = await fetch(`${BASE_URL}/api/v1/orders/uuid/${order_uuid}`, {
            headers: authHeaders(),
        });
        return handleResponse<ApiOrder>(res);
    },

    /** GET /api/v1/orders/buyer/{buyer_id} — all orders for a buyer */
    listByBuyer: async (buyer_id: number): Promise<ApiOrder[]> => {
        const res = await fetch(`${BASE_URL}/api/v1/orders/buyer/${buyer_id}`, {
            headers: authHeaders(),
        });
        return handleResponse<ApiOrder[]>(res);
    },

    /** GET /api/v1/orders/seller/{seller_id} — all orders containing products from this seller */
    listBySeller: async (seller_id: number): Promise<ApiOrder[]> => {
        const res = await fetch(`${BASE_URL}/api/v1/orders/seller/${seller_id}`, {
            headers: authHeaders(),
        });
        return handleResponse<ApiOrder[]>(res);
    },

    /** PATCH /api/v1/orders/{order_id}/status */
    updateStatus: async (order_id: number, status: OrderStatus): Promise<ApiOrder> => {
        const res = await fetch(
            `${BASE_URL}/api/v1/orders/${order_id}/status?status=${status}`,
            {
                method: 'PATCH',
                headers: authHeaders(),
            }
        );
        return handleResponse<ApiOrder>(res);
    },

    /** DELETE /api/v1/orders/{order_id} */
    delete: async (order_id: number): Promise<void> => {
        const res = await fetch(`${BASE_URL}/api/v1/orders/${order_id}`, {
            method: 'DELETE',
            headers: authHeaders(),
        });
        await handleResponse<string>(res);
    },

    /** POST /api/v1/orders/checkout — convert cart → order */
    checkout: async (shipping_address_id: number): Promise<ApiOrder> => {
        const res = await fetch(
            `${BASE_URL}/api/v1/orders/checkout?shipping_address_id=${shipping_address_id}`,
            {
                method: 'POST',
                headers: authHeaders(),
            }
        );
        return handleResponse<ApiOrder>(res);
    },
};

// ── Order helpers ──────────────────────────────────────────────────

/** Parse the decimal string the API returns into a plain JS number */
export function parseOrderAmount(amount: string): number {
    return parseFloat(amount) || 0;
}

/** Human-readable label for each status (add i18n keys here if needed) */
export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
    PENDING:          'Pending',
    CONFIRMED:        'Confirmed',
    PROCESSING:       'Processing',
    SHIPPED:          'Shipped',
    OUT_FOR_DELIVERY: 'Out for Delivery',
    DELIVERED:        'Delivered',
    CANCELLED:        'Cancelled',
};

// ─── Address API ───────────────────────────────────────────────
export const addressAPI = {
  // GET all addresses for a user
  getUserAddresses: async (userId: number): Promise<Address[]> => {
    const response = await fetch(`${BASE_URL}/api/v1/addresses/user/${userId}`, {
      headers: authHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch addresses");
    return response.json();
  },

  // POST create a new address
  createAddress: async (data: AddressCreate): Promise<Address> => {
    const response = await fetch(`${BASE_URL}/api/v1/addresses/`, {
      method: "POST",
      headers: { ...authHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create address");
    return response.json();
  },

  // PUT update an existing address
  updateAddress: async (addressId: number, data: AddressUpdate): Promise<Address> => {
    const response = await fetch(`${BASE_URL}/api/v1/addresses/${addressId}`, {
      method: "PUT",
      headers: { ...authHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update address");
    return response.json();
  },

  // DELETE an address
  deleteAddress: async (addressId: number): Promise<void> => {
    const response = await fetch(`${BASE_URL}/api/v1/addresses/${addressId}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    if (!response.ok) throw new Error("Failed to delete address");
  },
};

// ── Cart ───────────────────────────────────────────────────────────

export interface CartProduct {
    name: string;
    category_id: number;
    type: ApiProductType;
    description?: string;
    price_per_unit: string;
    unit_of_measure: string;
    stock_quantity: string;
    harvest_date?: string;
    shelf_life_days?: number;
    farming_method?: string;
    image_url?: string;
    average_rating: number;
    review_count: number;
    product_id: number;
    product_uuid: string;
    seller_id: number;
    created_at: string;
    is_active: boolean;
}

export interface CartItem {
    cart_item_id: number;
    buyer_id: number;
    product_id: number;
    quantity: string;
    added_at: string;
    product: CartProduct;
}

export interface AddToCartPayload {
    product_id: number;
    quantity: number;
    buyer_id: number;
}

export const cartApi = {
    /** GET /api/v1/cart/{buyer_id} — fetch all cart items for a buyer */
    getCart: async (buyer_id: number): Promise<CartItem[]> => {
        const res = await fetch(`${BASE_URL}/api/v1/cart/${buyer_id}`, {
            headers: authHeaders(),
        });
        return handleResponse<CartItem[]>(res);
    },

    /** POST /api/v1/cart/ — add a product to cart */
    addItem: async (payload: AddToCartPayload): Promise<CartItem> => {
        const res = await fetch(`${BASE_URL}/api/v1/cart/`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify(payload),
        });
        return handleResponse<CartItem>(res);
    },

    /** DELETE /api/v1/cart/{cart_item_id} — remove a cart item */
    removeItem: async (cart_item_id: number): Promise<void> => {
        const res = await fetch(`${BASE_URL}/api/v1/cart/${cart_item_id}`, {
            method: 'DELETE',
            headers: authHeaders(),
        });
        await handleResponse<string>(res);
    },
};

 

// ── Reviews ──────────────────────────────────────────────────────────────────
 
/**
 * Fetch all reviews for a product.
 * GET /api/v1/reviews/product/{product_id}
 */
export async function getProductReviews(productId: number): Promise<Review[]> {
  const res = await fetch(
    `${BASE_URL}/api/v1/reviews/product/${productId}`
  );
  return handleResponse<Review[]>(res);
}
 
/**
 * Submit a new review.
 * POST /api/v1/reviews/
 */
export async function createReview(
  payload: CreateReviewPayload,
  token?: string
): Promise<Review> {
  const res = await fetch(`${BASE_URL}/api/v1/reviews/`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });
  return handleResponse<Review>(res);
}
 
// ── Analytics ─────────────────────────────────────────────────────────────────
 
/**
 * Get farmer dashboard analytics.
 * GET /api/v1/analytics/farmer/dashboard
 * Requires Authorization header.
 */
export async function getFarmerAnalytics(
  token: string
): Promise<FarmerAnalytics> {
  const res = await fetch(`${BASE_URL}/api/v1/analytics/farmer/dashboard`, {
    headers: authHeaders(token),
  });
  // API says it returns "string" — try to parse as JSON, fall back to raw text
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail ?? "Failed to fetch analytics");
  }
  const raw = await res.text();
  try {
    return JSON.parse(raw) as FarmerAnalytics;
  } catch {
    // If it really is just a plain string, wrap it
    return { raw } as unknown as FarmerAnalytics;
  }
}

// Add this interface to your types or api.ts
interface PaymentCaptureParams {
  order_id: number;
  transaction_id: string;
  payment_method: string;
}

interface PaymentCaptureResponse {
  message: string;
  order_id: number;
  transaction_id: string;
  status: string;
}

// Add this function to your API utilities
export const capturePayment = async (
  params: PaymentCaptureParams
): Promise<PaymentCaptureResponse> => {
  const token = localStorage.getItem('authToken'); // Adjust based on your auth implementation
  
  const queryParams = new URLSearchParams({
    order_id: params.order_id.toString(),
    transaction_id: params.transaction_id,
    payment_method: params.payment_method,
  });

  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/v1/payments/capture?${queryParams}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Payment capture failed');
  }

  return response.json();
};

// ── Schemes API ───────────────────────────────────────────────────────────
export interface Scheme {
  id: string;
  name: string;
  description: string;
  category: string;
  benefits: string[];
  official_url: string;
  criteria: {
    min_farm_size: number;
    max_farm_size: number | null;
    crops: string[];
    states: string[];
  };
}

export const schemesApi = {
  list: async (category?: string): Promise<Scheme[]> => {
    try {
      const url = category && category.toLowerCase() !== 'all'
        ? `${BASE_URL}/api/v1/schemes?category=${encodeURIComponent(category)}`
        : `${BASE_URL}/api/v1/schemes`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('API failed');
      return await handleResponse<Scheme[]>(res);
    } catch (e) {
      console.warn("Schemes API failed, falling back to static offline backup.", e);
      const mockDb: Scheme[] = [
        {
          id: "pm-kisan",
          name: "PM Kisan Samman Nidhi",
          description: "Direct income support of ₹6,000 per year in three equal installments to all landholding farmer families across India.",
          category: "Income Support",
          benefits: [
            "₹6,000 per year paid in three equal installments of ₹2,000 directly into the bank accounts of farmers.",
            "100% funding from the Central Government of India.",
            "Helps meet financial requirements for agriculture inputs and household needs."
          ],
          official_url: "https://pmkisan.gov.in/",
          criteria: { min_farm_size: 0.01, max_farm_size: null, crops: ["all"], states: ["all"] }
        },
        {
          id: "kcc",
          name: "Kisan Credit Card (KCC)",
          description: "Concessional and timely credit for farmers to meet their cultivation, post-harvest, and household consumption needs.",
          category: "Credit",
          benefits: [
            "Concessional interest rate of 4% per annum upon timely repayment of loans.",
            "Flexible credit limit based on landholding size, soil quality, and cropping pattern.",
            "Coverage for crop insurance and low-cost personal accident insurance.",
            "No collateral required for loans up to ₹1.6 Lakhs."
          ],
          official_url: "https://www.myscheme.gov.in/schemes/kcc",
          criteria: { min_farm_size: 0, max_farm_size: null, crops: ["all"], states: ["all"] }
        },
        {
          id: "pmfby",
          name: "PM Fasal Bima Yojana",
          description: "Comprehensive crop insurance scheme protecting farmers against crop losses from natural calamities, pests, and diseases.",
          category: "Insurance",
          benefits: [
            "Extremely low premium rates: 1.5% for Rabi crops, 2.0% for Kharif crops, and 5% for commercial/horticultural crops.",
            "Full claim payout against verified yield losses based on weather and crop-cutting experiments.",
            "Covers post-harvest losses and localized calamities like hailstorms and landslides."
          ],
          official_url: "https://pmfby.gov.in/",
          criteria: { min_farm_size: 0, max_farm_size: null, crops: ["Wheat", "Rice", "Mustard", "Soybean", "Chickpea", "Cotton", "Sugarcane"], states: ["all"] }
        },
        {
          id: "soil-health",
          name: "Soil Health Card",
          description: "Provides crop-wise fertilizer recommendations based on scientific soil testing, helping farmers optimize crop yields.",
          category: "Soil",
          benefits: [
            "Free detailed report of soil nutrient status (12 parameters: N, P, K, pH, etc.).",
            "Customized dosage recommendations for chemical and organic fertilizers.",
            "Improves soil fertility and reduces input cost by avoiding over-fertilization."
          ],
          official_url: "https://www.soilhealth.dac.gov.in/",
          criteria: { min_farm_size: 0, max_farm_size: null, crops: ["all"], states: ["all"] }
        },
        {
          id: "enam",
          name: "eNAM (National Agriculture Market)",
          description: "A pan-India electronic trading portal networking existing APMC mandis to create a unified national market for agricultural commodities.",
          category: "Marketplace",
          benefits: [
            "Direct access to online buyers across the country, cutting middle-men margins.",
            "Real-time transparent price discovery based on local and national demand.",
            "Immediate digital payment settlement directly into bank accounts."
          ],
          official_url: "https://www.enam.gov.in/",
          criteria: { min_farm_size: 0, max_farm_size: null, crops: ["all"], states: ["all"] }
        },
        {
          id: "fertilizer-subsidy",
          name: "Fertilizer Subsidy (PM-PRANAM)",
          description: "Statutory controlled chemical fertilizers like Urea and nutrient-based fertilizers like DAP are provided at heavily subsidized rates.",
          category: "Subsidies",
          benefits: [
            "Urea and DAP available at a fraction of their global market prices.",
            "Ensures uninterrupted supply of essential nutrients for crop growth.",
            "Promotes balanced fertilizer usage through PM-PRANAM alternative incentives."
          ],
          official_url: "https://www.myscheme.gov.in",
          criteria: { min_farm_size: 0, max_farm_size: null, crops: ["all"], states: ["all"] }
        },
        {
          id: "pmksy",
          name: "Pradhan Mantri Krishi Sinchayee Yojana",
          description: "Focuses on developing irrigation infrastructure, water harvesting, and extending high-efficiency micro-irrigation systems to every farm.",
          category: "Irrigation",
          benefits: [
            "Subsidy up to 55% for Small/Marginal farmers and 45% for others on drip and sprinkler irrigation installations.",
            "Enhances water utilization efficiency ('More crop per drop').",
            "Reduces weeding costs and power consumption through precise water feeding."
          ],
          official_url: "https://pmksy.gov.in/",
          criteria: { min_farm_size: 0.1, max_farm_size: null, crops: ["all"], states: ["all"] }
        }
      ];
      if (category && category.toLowerCase() !== 'all') {
        return mockDb.filter(s => s.category.toLowerCase() === category.toLowerCase());
      }
      return mockDb;
    }
  }
};

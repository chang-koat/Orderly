// src/api.ts
const BASE_URL =
  (import.meta as any).env?.VITE_API_BASE_URL ?? "http://localhost:8000";

type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

function getAuthToken(): string | null {
  return localStorage.getItem("authToken");
}

async function request<T>(
  path: string,
  method: HttpMethod = "GET",
  body?: unknown
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const token = getAuthToken();
  if (token) {
    headers["Authorization"] = `Token ${token}`;
  }

  const urlPath = normalizePath(path);

  const res = await fetch(`${BASE_URL}${urlPath}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `Request failed ${res.status} ${res.statusText}: ${text || "No body"}`
    );
  }

  return (await res.json()) as T;
}

function normalizePath(path: string): string {
  // allow full URLs like "http://localhost:8000/api/..."
  if (path.startsWith("http://") || path.startsWith("https://")) {
    try {
      const url = new URL(path);
      return url.pathname + url.search;
    } catch {
      // fall through
    }
  }

  if (!path.startsWith("/")) {
    path = "/" + path;
  }

  return path;
}

export async function get<T>(path: string): Promise<T> {
  return request<T>(path, "GET");
}

export async function post<T>(path: string, body?: unknown): Promise<T> {
  return request<T>(path, "POST", body);
}

export async function patch<T>(path: string, body?: unknown): Promise<T> {
  return request<T>(path, "PATCH", body);
}

export async function del<T>(path: string): Promise<T> {
  return request<T>(path, "DELETE");
}

/* =========
  Types
   ========= */

export interface Store {
  UUID: string;
  Name: string | null;
  Description: string | null;
  Address: string | null;
  Items: string | null;
  name: string; // extra lowercase name we added
}

export interface Product {
  id: number;
  store: string; // Store UUID
  name: string;
  description: string;
  price: string; // DRF DecimalField comes back as string
  is_available: boolean;
  image_url: string;
}

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
}

export interface Cart {
  id: number;
  items: CartItem[];
  total?: number | string; // used by Cart page for subtotal
}

export interface OrderItem {
  id: number;
  product: Product;
  quantity: number;
  price: string;
}

export interface Order {
  id: number;
  total_amount: string;
  created_at: string;
  items: OrderItem[];
}

export interface AuthResponse {
  token: string;
}

export interface PaymentMethod {
  id: number;
  name_on_card: string;
  card_last4: string;
  expiry: string;
  zip: string | null;
  created_at: string;
}

/* =========
  Auth APIs  (hit /auth/..., not /api/...)
   ========= */

export async function registerUser(data: {
  username: string;
  password: string;
  email?: string;
}): Promise<AuthResponse> {
  const res = await request<AuthResponse>("/auth/register/", "POST", data);
  localStorage.setItem("authToken", res.token);
  return res;
}

export async function loginUser(data: {
  username: string;
  password: string;
}): Promise<AuthResponse> {
  const res = await request<AuthResponse>("/auth/login/", "POST", data);
  localStorage.setItem("authToken", res.token);
  return res;
}

export function logoutUser() {
  localStorage.removeItem("authToken");
}

/* =========
  Store & Product APIs  (under /api/)
   ========= */

export async function fetchStores(): Promise<Store[]> {
  return await request<Store[]>("/api/stores/");
}

export async function fetchProducts(storeUUID?: string): Promise<Product[]> {
  const qs = storeUUID ? `?store=${encodeURIComponent(storeUUID)}` : "";
  return await request<Product[]>(`/api/products/${qs}`);
}

/* =========
  Cart APIs  (under /api/)
   ========= */

export async function fetchCart(): Promise<Cart> {
  return await request<Cart>("/api/cart/");
}

export async function addToCart(options: {
  productId: number;
  quantity: number;
}): Promise<Cart> {
  return await request<Cart>("/api/cart/add/", "POST", {
    product_id: options.productId,
    quantity: options.quantity,
  });
}

export async function removeFromCart(itemId: number): Promise<Cart> {
  return await request<Cart>("/api/cart/remove/", "POST", {
    item_id: itemId,
  });
}

export async function clearCart(): Promise<Cart> {
  return await request<Cart>("/api/cart/clear/", "POST");
}

/* =========
  Order APIs  (under /api/)
   ========= */

export async function createOrder(): Promise<Order> {
  return await request<Order>("/api/orders/", "POST", {});
}

export async function fetchOrders(): Promise<Order[]> {
  return await request<Order[]>("/api/orders/");
}

/* =========
  Payment Method APIs  (under /api/payment-methods/)
   ========= */

export async function fetchPaymentMethods(): Promise<PaymentMethod[]> {
  return await request<PaymentMethod[]>("/api/payment-methods/");
}

export async function addPaymentMethod(data: {
  name_on_card: string;
  card_number: string;
  expiry: string;
  cvv?: string;
  zip?: string;
}): Promise<PaymentMethod> {
  return await request<PaymentMethod>("/api/payment-methods/", "POST", data);
}

export async function deletePaymentMethod(id: number): Promise<void> {
  await request<unknown>(`/api/payment-methods/${id}/`, "DELETE");
}

export async function createPaymentMethod(input: {
  nameOnCard: string;
  cardNumber: string;
  expiry: string;
  cvv?: string;
  zip?: string;
}): Promise<PaymentMethod> {
  // IMPORTANT: map camelCase -> snake_case that DRF expects
  return await request<PaymentMethod>("/api/payment-methods/", "POST", {
    name_on_card: input.nameOnCard,
    card_number: input.cardNumber,
    expiry: input.expiry,
    cvv: input.cvv,
    zip: input.zip,
  });
}

/* =========
  Default export (for existing code using api.post, etc.)
   ========= */

const api = {
  get,
  post,
  patch,
  del,
  registerUser,
  loginUser,
  logoutUser,
  fetchStores,
  fetchProducts,
  fetchCart,
  addToCart,
  removeFromCart,
  clearCart,
  createOrder,
  fetchOrders,
  fetchPaymentMethods,
  addPaymentMethod,
  deletePaymentMethod,
  createPaymentMethod,
};

export default api;

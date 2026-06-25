export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  discountPrice?: number;
  image: string;
  images: string[]; // for gallery
  unit: string; // e.g., "1 kg", "500 ml", "1 pack"
  description: string;
  rating: number;
  reviewsCount: number;
  reviews: Review[];
  isFeatured: boolean;
  isBestSeller: boolean;
  stock: number;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string; // Lucide icon name
  slug: string;
}

export interface Address {
  id: string;
  title: string; // "Home", "Office", etc.
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: {
    productId: string;
    productName: string;
    image: string;
    price: number;
    quantity: number;
    unit: string;
  }[];
  subtotal: number;
  tax: number;
  deliveryCharge: number;
  discount: number;
  total: number;
  couponApplied?: string;
  address: Address;
  paymentMethod: 'COD' | 'Stripe' | 'Online';
  paymentStatus: 'Pending' | 'Paid' | 'Refunded';
  status: 'Pending' | 'Packed' | 'Shipped' | 'Delivered' | 'Cancelled';
  deliveryDate: string;
  deliveryTimeSlot: string;
  createdAt: string;
  customerName: string;
  customerEmail: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount: number;
  description: string;
  isActive: boolean;
  expiryDate: string;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  type: 'offer' | 'order' | 'delivery' | 'general';
  createdAt: string;
  isRead: boolean;
}

export interface Message {
  id: string;
  sender: 'user' | 'support' | 'ai';
  text: string;
  createdAt: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  avatar: string;
}

export type Language = 'en' | 'es' | 'fr' | 'ar' | 'hi';

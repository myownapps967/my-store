import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, Heart, ShoppingCart, MessageSquare, User, Search, Bell, 
  ChevronRight, ArrowLeft, Star, Plus, Minus, Trash2, MapPin, 
  CreditCard, Calendar, Truck, Clock, Check, AlertCircle, Sparkles,
  ChevronLeft, CheckCircle2, Globe, Moon, Sun, Send, ShieldCheck,
  ShoppingBag
} from 'lucide-react';
import { Product, Category, Coupon, Order, Address, Notification, CartItem, Language, UserProfile, Message } from '../types';
import { DICTIONARY } from '../data/mockData';

interface MobileAppProps {
  products: Product[];
  categories: Category[];
  coupons: Coupon[];
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  addresses: Address[];
  setAddresses: React.Dispatch<React.SetStateAction<Address[]>>;
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  wishlist: string[];
  setWishlist: React.Dispatch<React.SetStateAction<string[]>>;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  user: UserProfile | null;
  setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  currentLanguage: Language;
  setCurrentLanguage: (lang: Language) => void;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
}

export default function MobileApp({
  products,
  categories,
  coupons,
  orders,
  setOrders,
  addresses,
  setAddresses,
  notifications,
  setNotifications,
  wishlist,
  setWishlist,
  cart,
  setCart,
  user,
  setUser,
  currentLanguage,
  setCurrentLanguage,
  isDarkMode,
  setIsDarkMode
}: MobileAppProps) {
  
  // App navigation state
  const [currentScreen, setCurrentScreen] = useState<'welcome' | 'login' | 'register' | 'forgot_password' | 'home' | 'product_details' | 'cart' | 'checkout' | 'order_success' | 'orders_history' | 'profile' | 'addresses' | 'notifications' | 'support_chat'>('home');
  const [screenHistory, setScreenHistory] = useState<string[]>([]);
  
  // Selected product detail target
  const [selectedProductId, setSelectedProductId] = useState<string>('f1');
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);

  // Search filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategorySlug, setActiveCategorySlug] = useState('all');

  // Checkout states
  const [selectedAddressId, setSelectedAddressId] = useState<string>('add1');
  const [deliveryDate, setDeliveryDate] = useState('2026-06-26');
  const [deliverySlot, setDeliverySlot] = useState('09:00 AM - 12:00 PM');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'Stripe'>('Stripe');
  const [stripeCardName, setStripeCardName] = useState('Sarah Connor');
  const [stripeCardNum, setStripeCardNum] = useState('4242 4242 4242 4242');
  const [stripeExpiry, setStripeExpiry] = useState('12/28');
  const [stripeCVV, setStripeCVV] = useState('941');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [placedOrderRef, setPlacedOrderRef] = useState<Order | null>(null);

  // Coupon application state
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [activeAppliedCoupon, setActiveAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState('');

  // Support chat states
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: 'm1', sender: 'ai', text: 'Hi Sarah! I am the My Store Intelligent Assistant. Ask me anything about our organic red apples, fresh broccoli, or track your active orders!', createdAt: new Date().toISOString() }
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Address Form states
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addrTitle, setAddrTitle] = useState('Home');
  const [addrName, setAddrName] = useState('Sarah Connor');
  const [addrPhone, setAddrPhone] = useState('+1 (555) 019-2834');
  const [addrStreet, setAddrStreet] = useState('');
  const [addrCity, setAddrCity] = useState('');
  const [addrState, setAddrState] = useState('');
  const [addrZip, setAddrZip] = useState('');

  // Login Form states
  const [loginEmail, setLoginEmail] = useState('bintadam1000@gmail.com');
  const [loginPhone, setLoginPhone] = useState('+15550192834');
  const [loginPassword, setLoginPassword] = useState('••••••••');

  // Welcome / Register Form states
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');

  // Scroll support chat to bottom on updates
  useEffect(() => {
    if (currentScreen === 'support_chat') {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, currentScreen]);

  // Handle push alert toast
  const [activeToast, setActiveToast] = useState<{ id: string; title: string; body: string } | null>(null);

  // Poll for newest unread notifications and pop them as active screen toasts
  useEffect(() => {
    const unread = notifications.find(n => !n.isRead);
    if (unread) {
      setActiveToast({ id: unread.id, title: unread.title, body: unread.body });
      // Mark as read after presentation
      setNotifications(prev => prev.map(n => n.id === unread.id ? { ...n, isRead: true } : n));
      const t = setTimeout(() => {
        setActiveToast(null);
      }, 5000);
      return () => clearTimeout(t);
    }
  }, [notifications]);

  // Navigation history tracker helper
  const navigateTo = (screen: typeof currentScreen) => {
    setScreenHistory(prev => [...prev, currentScreen]);
    setCurrentScreen(screen);
  };

  const navigateBack = () => {
    if (screenHistory.length > 0) {
      const prev = screenHistory[screenHistory.length - 1] as typeof currentScreen;
      setScreenHistory(prevHistory => prevHistory.slice(0, -1));
      setCurrentScreen(prev);
    } else {
      setCurrentScreen('home');
    }
  };

  // Cart operations
  const handleAddToCart = (product: Product, qty: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id 
          ? { ...item, quantity: item.quantity + qty } 
          : item
        );
      }
      return [...prev, { product, quantity: qty }];
    });
  };

  const handleUpdateCartQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        const nextQty = item.quantity + delta;
        return nextQty > 0 ? { ...item, quantity: nextQty } : null;
      }
      return item;
    }).filter(Boolean) as CartItem[]);
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  // Toggle wishlist
  const handleToggleWishlist = (productId: string) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId) 
        : [...prev, productId]
    );
  };

  // Apply coupons
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const code = couponCodeInput.trim().toUpperCase();
    if (!code) return;

    const matched = coupons.find(c => c.code === code && c.isActive);
    if (!matched) {
      setCouponError('Invalid or expired coupon code.');
      return;
    }

    const sub = cartSubtotal;
    if (sub < matched.minOrderAmount) {
      setCouponError(`Min order value of Rs. ${matched.minOrderAmount.toFixed(2)} required for this coupon.`);
      return;
    }

    setActiveAppliedCoupon(matched);
    setCouponCodeInput('');
  };

  // Pricing calculations
  const cartSubtotal = cart.reduce((sum, item) => {
    const price = item.product.discountPrice || item.product.price;
    return sum + (price * item.quantity);
  }, 0);

  const deliveryCharge = cartSubtotal >= 3750 || cartSubtotal === 0 ? 0.00 : 875.00;
  const estimatedTax = cartSubtotal * 0.08; // 8% sales tax

  let discountAmount = 0;
  if (activeAppliedCoupon) {
    if (activeAppliedCoupon.discountType === 'percentage') {
      discountAmount = cartSubtotal * (activeAppliedCoupon.discountValue / 100);
    } else {
      discountAmount = activeAppliedCoupon.discountValue;
    }
  }

  const grandTotal = Math.max(0, cartSubtotal + estimatedTax + deliveryCharge - discountAmount);

  // Address operators
  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrStreet || !addrCity || !addrZip) return;

    const newAddr: Address = {
      id: 'add-' + Date.now(),
      title: addrTitle,
      name: addrName,
      phone: addrPhone,
      street: addrStreet,
      city: addrCity,
      state: addrState || 'IL',
      zipCode: addrZip,
      isDefault: addresses.length === 0
    };

    setAddresses(prev => [...prev, newAddr]);
    setSelectedAddressId(newAddr.id);
    setShowAddressForm(false);
    setAddrStreet('');
    setAddrCity('');
    setAddrZip('');
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses(prev => prev.filter(a => a.id !== id));
  };

  // Place order
  const handlePlaceOrder = () => {
    if (cart.length === 0) return;
    const selectedAddress = addresses.find(a => a.id === selectedAddressId) || addresses[0];
    if (!selectedAddress) {
      alert("Please configure a delivery address in the Address management section before placing your order!");
      navigateTo('addresses');
      return;
    }

    setIsProcessingPayment(true);
    
    // Simulate payment transaction loading (Stripe or COD clearance)
    setTimeout(() => {
      const newOrder: Order = {
        id: 'ord-' + Date.now(),
        orderNumber: 'MS-' + Math.floor(1000 + Math.random() * 9000),
        items: cart.map(item => ({
          productId: item.product.id,
          productName: item.product.name,
          image: item.product.image,
          price: item.product.discountPrice || item.product.price,
          quantity: item.quantity,
          unit: item.product.unit
        })),
        subtotal: cartSubtotal,
        tax: estimatedTax,
        deliveryCharge: deliveryCharge,
        discount: discountAmount,
        total: grandTotal,
        couponApplied: activeAppliedCoupon?.code,
        address: selectedAddress,
        paymentMethod: paymentMethod,
        paymentStatus: paymentMethod === 'Stripe' ? 'Paid' : 'Pending',
        status: 'Pending',
        deliveryDate: deliveryDate,
        deliveryTimeSlot: deliverySlot,
        createdAt: new Date().toISOString(),
        customerName: user ? user.name : 'Sarah Connor',
        customerEmail: user ? user.email : 'bintadam1000@gmail.com'
      };

      setOrders(prev => [newOrder, ...prev]);
      setPlacedOrderRef(newOrder);
      
      // Clear cart
      setCart([]);
      setActiveAppliedCoupon(null);
      setIsProcessingPayment(false);

      // Add placed order push notification
      const placeNotif: Notification = {
        id: 'n-place-' + Date.now(),
        title: '🎉 Order Placed!',
        body: `Your grocery order ${newOrder.orderNumber} is received. Total: $${newOrder.total.toFixed(2)}. Tracking status: Pending.`,
        type: 'order',
        createdAt: new Date().toISOString(),
        isRead: false
      };
      setNotifications(prev => [placeNotif, ...prev]);

      navigateTo('order_success');
    }, 2000);
  };

  // Support AI chat handler
  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    
    const userMsg: Message = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: chatInput,
      createdAt: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMsg]);
    const currentInput = chatInput;
    setChatInput('');
    setIsChatLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: currentInput,
          history: messages,
          products: products,
          orders: orders,
          user: user
        })
      });
      
      const data = await res.json();
      const aiReply: Message = {
        id: 'msg-reply-' + Date.now(),
        sender: 'ai',
        text: data.text || "I apologize, I'm having trouble analyzing our catalog right now.",
        createdAt: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiReply]);
    } catch (error) {
      console.error("AI Support API Error:", error);
      // fallback mock message
      const fallbackMsg: Message = {
        id: 'msg-fallback-' + Date.now(),
        sender: 'ai',
        text: "I couldn't contact my full-stack brain, but I'm operating in high-fidelity offline mode! Let me know if you need help with Organic Red Apples, Fresh Milk, or tracking your order.",
        createdAt: new Date().toISOString()
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Authentication Handlers
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({
      name: 'Sarah Connor',
      email: loginEmail,
      phone: loginPhone,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80'
    });
    navigateTo('home');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail) return;
    setUser({
      name: regName,
      email: regEmail,
      phone: regPhone || '+1 (555) 019-1234',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'
    });
    navigateTo('home');
  };

  const handleLogout = () => {
    setUser(null);
    navigateTo('welcome');
  };

  // Reorder Handler
  const handleReorder = (oldOrder: Order) => {
    setCart([]);
    oldOrder.items.forEach(it => {
      const prod = products.find(p => p.id === it.productId);
      if (prod) {
        handleAddToCart(prod, it.quantity);
      }
    });
    navigateTo('cart');
  };

  // Cancel Order Handler
  const handleCancelOrder = (orderId: string) => {
    if (confirm("Are you sure you want to cancel this order?")) {
      setOrders(prev => prev.map(o => {
        if (o.id === orderId) {
          const cancelNotif: Notification = {
            id: 'n-cancel-' + Date.now(),
            title: '❌ Order Cancelled',
            body: `Your order ${o.orderNumber} has been successfully cancelled and refunded if prepaid.`,
            type: 'order',
            createdAt: new Date().toISOString(),
            isRead: false
          };
          setNotifications(n => [cancelNotif, ...n]);
          return { ...o, status: 'Cancelled' as const };
        }
        return o;
      }));
    }
  };

  // Selection filters
  const selectedProduct = products.find(p => p.id === selectedProductId) || products[0];

  const filteredProducts = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = activeCategorySlug === 'all' || p.category.toLowerCase().replace(/[^a-z0-9]+/g, '-') === activeCategorySlug;
    return matchSearch && matchCat;
  });

  // Language dictionary helper
  const text = DICTIONARY[currentLanguage] || DICTIONARY['en'];

  return (
    <div className={`w-full h-full flex flex-col ${isDarkMode ? 'dark bg-neutral-950 text-neutral-100' : 'bg-white text-neutral-800'} overflow-hidden relative font-sans`}>
      
      {/* 🔔 Push Notification Banner Alert */}
      {activeToast && (
        <div className="absolute top-12 left-3.5 right-3.5 bg-neutral-900/95 dark:bg-neutral-800/95 backdrop-blur-md text-white border border-neutral-700/50 p-3.5 rounded-2xl z-50 shadow-2xl flex gap-3 animate-bounce select-none">
          <div className="bg-emerald-600 p-2 rounded-xl text-white h-fit mt-0.5">
            <Bell size={16} />
          </div>
          <div className="flex-1 text-left">
            <h5 className="font-bold text-[12px] leading-tight text-white">{activeToast.title}</h5>
            <p className="text-[10px] text-neutral-300 mt-0.5 leading-normal line-clamp-2">{activeToast.body}</p>
          </div>
        </div>
      )}

      {/* DYNAMIC SCROLL CONTAINER */}
      <div className="flex-1 w-full overflow-y-auto overflow-x-hidden flex flex-col pb-16">
        
        {/* ======================================= */}
        {/* A. WELCOME SCREEN                       */}
        {/* ======================================= */}
        {currentScreen === 'welcome' && (
          <div className="flex-1 flex flex-col justify-between p-6 bg-gradient-to-b from-emerald-500 to-emerald-800 text-white select-none">
            <div className="flex-1 flex flex-col justify-center items-center text-center space-y-4">
              <div className="bg-white p-5 rounded-3xl text-emerald-600 shadow-xl border border-white/20 animate-pulse">
                <ShoppingBag size={48} className="stroke-[2.5]" />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight leading-none text-white font-sans">My Store</h1>
                <p className="text-xs text-emerald-100 font-semibold mt-1 tracking-widest uppercase">Fresh organic grocer</p>
              </div>
              <p className="text-xs text-emerald-100/80 max-w-xs mt-3">
                Experience high-fidelity shopping, real-time analytics sync, and smart AI chat assistance.
              </p>
            </div>

            <div className="space-y-3">
              <button 
                id="welcome-btn-login"
                onClick={() => navigateTo('login')}
                className="w-full bg-white text-emerald-800 font-bold py-3.5 rounded-2xl text-xs transition-transform hover:scale-[1.02] shadow-lg"
              >
                Sign In with Credentials
              </button>
              <button 
                id="welcome-btn-register"
                onClick={() => navigateTo('register')}
                className="w-full bg-emerald-700/50 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-2xl text-xs border border-white/20 transition-transform hover:scale-[1.02]"
              >
                Create Shopper Account
              </button>
              
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-emerald-100/20"></div>
                <span className="flex-shrink mx-3 text-[10px] text-emerald-200 uppercase font-bold tracking-widest">or connect with</span>
                <div className="flex-grow border-t border-emerald-100/20"></div>
              </div>

              <button 
                onClick={() => {
                  setUser({
                    name: 'Sarah Connor',
                    email: 'bintadam1000@gmail.com',
                    phone: '+1 (555) 019-2834',
                    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80'
                  });
                  navigateTo('home');
                }}
                className="w-full bg-neutral-900 text-white font-bold py-3 rounded-2xl text-xs flex items-center justify-center gap-2.5 transition-transform hover:scale-[1.02] border border-neutral-800"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.24 10.285V13.4h6.887C18.2 15.614 15.645 18 12.24 18c-3.86 0-7-3.14-7-7s3.14-7 7-7c1.71 0 3.28.61 4.5 1.625l2.437-2.437C17.312 1.696 14.933 1 12.24 1 6.583 1 2 5.583 2 11.24s4.583 10.24 10.24 10.24c5.795 0 10.24-4.113 10.24-10.24 0-.568-.057-1.124-.16-1.655H12.24z" />
                </svg>
                Continue with Google Login
              </button>
            </div>
          </div>
        )}

        {/* ======================================= */}
        {/* B. LOGIN SCREEN                         */}
        {/* ======================================= */}
        {currentScreen === 'login' && (
          <div className="p-6 flex-1 flex flex-col justify-between text-left">
            <div>
              <button onClick={navigateBack} className="bg-neutral-100 dark:bg-neutral-900 p-2.5 rounded-xl text-neutral-600 dark:text-neutral-300 mb-6">
                <ArrowLeft size={16} />
              </button>
              
              <h2 className="text-2xl font-black tracking-tight">Welcome back!</h2>
              <p className="text-xs text-neutral-400 mt-1">Please log in to your My Store dashboard.</p>

              <form onSubmit={handleLogin} className="space-y-4 mt-8">
                <div>
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">Email address</label>
                  <input 
                    type="email" 
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    required
                    className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl py-3 px-4 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-neutral-800 dark:text-neutral-100"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">Phone Number</label>
                  <input 
                    type="text" 
                    value={loginPhone}
                    onChange={e => setLoginPhone(e.target.value)}
                    required
                    className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl py-3 px-4 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-neutral-800 dark:text-neutral-100"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Password</label>
                    <button type="button" onClick={() => navigateTo('forgot_password')} className="text-[10px] font-bold text-emerald-600 hover:underline">Forgot password?</button>
                  </div>
                  <input 
                    type="password" 
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    required
                    className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl py-3 px-4 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-neutral-800 dark:text-neutral-100"
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl text-xs transition-all shadow-md mt-4"
                >
                  Verify and Sign In
                </button>
              </form>
            </div>

            <p className="text-center text-xs text-neutral-400 mt-6">
              Don't have an account? <button onClick={() => navigateTo('register')} className="text-emerald-600 font-bold hover:underline">Sign up</button>
            </p>
          </div>
        )}

        {/* ======================================= */}
        {/* C. REGISTER SCREEN                      */}
        {/* ======================================= */}
        {currentScreen === 'register' && (
          <div className="p-6 flex-1 flex flex-col justify-between text-left">
            <div>
              <button onClick={navigateBack} className="bg-neutral-100 dark:bg-neutral-900 p-2.5 rounded-xl text-neutral-600 dark:text-neutral-300 mb-6">
                <ArrowLeft size={16} />
              </button>
              
              <h2 className="text-2xl font-black tracking-tight">Create Account</h2>
              <p className="text-xs text-neutral-400 mt-1">Join My Store to buy organic produce.</p>

              <form onSubmit={handleRegister} className="space-y-4 mt-8">
                <div>
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">Full Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Sarah Connor" 
                    value={regName}
                    onChange={e => setRegName(e.target.value)}
                    required
                    className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl py-3 px-4 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-neutral-800 dark:text-neutral-100"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">Email address</label>
                  <input 
                    type="email" 
                    placeholder="sarah@example.com" 
                    value={regEmail}
                    onChange={e => setRegEmail(e.target.value)}
                    required
                    className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl py-3 px-4 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-neutral-800 dark:text-neutral-100"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">Phone Number</label>
                  <input 
                    type="tel" 
                    placeholder="+1 (555) 019-1234" 
                    value={regPhone}
                    onChange={e => setRegPhone(e.target.value)}
                    className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl py-3 px-4 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-neutral-800 dark:text-neutral-100"
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl text-xs transition-all shadow-md mt-4"
                >
                  Register Shopper Account
                </button>
              </form>
            </div>

            <p className="text-center text-xs text-neutral-400 mt-6">
              Already have an account? <button onClick={() => navigateTo('login')} className="text-emerald-600 font-bold hover:underline">Log in</button>
            </p>
          </div>
        )}

        {/* ======================================= */}
        {/* D. FORGOT PASSWORD                      */}
        {/* ======================================= */}
        {currentScreen === 'forgot_password' && (
          <div className="p-6 flex-1 text-left">
            <button onClick={navigateBack} className="bg-neutral-100 dark:bg-neutral-900 p-2.5 rounded-xl text-neutral-600 dark:text-neutral-300 mb-6">
              <ArrowLeft size={16} />
            </button>
            
            <h2 className="text-2xl font-black tracking-tight">Reset Password</h2>
            <p className="text-xs text-neutral-400 mt-1">We will send a reset password token link to your email.</p>

            <form onSubmit={(e) => { e.preventDefault(); alert("A password reset link has been dispatched to your email address!"); navigateTo('login'); }} className="space-y-4 mt-8">
              <div>
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">Your Registered Email</label>
                <input 
                  type="email" 
                  required 
                  placeholder="e.g. sarah@example.com"
                  className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl py-3 px-4 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-neutral-800 dark:text-neutral-100"
                />
              </div>

              <button 
                type="submit" 
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl text-xs transition-all shadow-md mt-4"
              >
                Send Password Reset Link
              </button>
            </form>
          </div>
        )}

        {/* ======================================= */}
        {/* E. MAIN STOREFRONT / HOME               */}
        {/* ======================================= */}
        {currentScreen === 'home' && (
          <div className="space-y-5 text-left select-none">
            
            {/* Top Bar Banner Greeting */}
            <div className="px-4 pt-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest font-mono">My Store Grocery</span>
                <h3 className="text-lg font-black tracking-tight mt-0.5 leading-none">
                  Hi, {user ? user.name.split(' ')[0] : 'Guest'} 👋
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => navigateTo('notifications')}
                  className="bg-neutral-100 dark:bg-neutral-900 p-2.5 rounded-xl text-neutral-700 dark:text-neutral-300 relative"
                >
                  <Bell size={16} />
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white dark:border-neutral-950 rounded-full"></span>
                </button>
                <img 
                  onClick={() => navigateTo('profile')}
                  referrerPolicy="no-referrer"
                  src={user ? user.avatar : "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"} 
                  alt="Avatar" 
                  className="w-9 h-9 rounded-xl object-cover border border-neutral-100 dark:border-neutral-800 cursor-pointer shadow-sm" 
                />
              </div>
            </div>

            {/* Instant Search Bar */}
            <div className="px-4">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder={text.searchPlaceholder} 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/20 dark:border-neutral-800/20 rounded-xl py-3.5 pl-10 pr-4 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 text-neutral-800 dark:text-neutral-100 transition-all"
                />
              </div>
            </div>

            {/* Attractive Promo Banner Slider */}
            <div className="px-4">
              <div className="bg-emerald-600 dark:bg-emerald-800 rounded-2xl p-4 text-white relative overflow-hidden flex justify-between items-center shadow-lg shadow-emerald-700/10">
                {/* Background design element */}
                <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-emerald-500 rounded-full opacity-20 blur-xl"></div>
                <div className="absolute right-12 top-2 w-16 h-16 bg-white/10 rounded-full blur-lg"></div>

                <div className="space-y-1.5 z-10 flex-1 pr-2">
                  <span className="bg-white/20 text-white font-black text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Flash Discount Deal
                  </span>
                  <h4 className="text-base font-black tracking-tight leading-tight">20% OFF Grocery Order</h4>
                  <p className="text-[10px] text-emerald-100/90 leading-tight">Apply active code **FRESH20** on cart value over Rs. 5000.</p>
                </div>

                <div className="w-20 h-20 bg-emerald-500/30 rounded-2xl flex items-center justify-center p-2 border border-white/10 z-10">
                  <Sparkles size={24} className="text-emerald-100 animate-spin" />
                </div>
              </div>
            </div>

            {/* Product Category Pills */}
            <div className="space-y-2">
              <div className="px-4 flex justify-between items-center">
                <h4 className="font-extrabold text-xs text-neutral-400 uppercase tracking-widest">{text.categories}</h4>
              </div>
              
              <div className="flex gap-2 px-4 overflow-x-auto no-scrollbar py-1">
                <button
                  onClick={() => setActiveCategorySlug('all')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    activeCategorySlug === 'all' 
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/10' 
                      : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200'
                  }`}
                >
                  All Products
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategorySlug(cat.slug)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      activeCategorySlug === cat.slug 
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/10' 
                        : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Featured Section Grid */}
            <div className="px-4 space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="font-extrabold text-xs text-neutral-400 uppercase tracking-widest">{text.featured}</h4>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                {filteredProducts.filter(p => p.isFeatured).map((p) => (
                  <div 
                    key={p.id} 
                    className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-900 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between hover:scale-[1.01] transition-transform"
                  >
                    <div className="relative h-28 bg-neutral-50 dark:bg-neutral-950 cursor-pointer" onClick={() => { setSelectedProductId(p.id); navigateTo('product_details'); }}>
                      <img referrerPolicy="no-referrer" src={p.image} alt={p.name} className="w-full h-full object-cover" />
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleToggleWishlist(p.id); }}
                        className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all ${
                          wishlist.includes(p.id) ? 'bg-red-50 text-red-500' : 'bg-black/40 text-white hover:text-red-400'
                        }`}
                      >
                        <Heart size={12} fill={wishlist.includes(p.id) ? "currentColor" : "none"} />
                      </button>
                      {p.discountPrice && (
                        <span className="absolute bottom-2 left-2 bg-red-500 text-white font-black text-[8px] px-1.5 py-0.5 rounded leading-none uppercase tracking-wider">
                          Sale
                        </span>
                      )}
                    </div>

                    <div className="p-3 text-left space-y-2">
                      <div>
                        <h5 className="font-bold text-neutral-800 dark:text-neutral-100 text-[11px] leading-tight line-clamp-1">{p.name}</h5>
                        <span className="text-[10px] text-neutral-400 mt-0.5 block">{p.unit}</span>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-neutral-50 dark:border-neutral-800">
                        <div>
                          {p.discountPrice ? (
                            <div className="flex flex-col">
                              <span className="font-black text-emerald-700 dark:text-emerald-500 text-xs">Rs. {p.discountPrice}</span>
                              <span className="line-through text-neutral-400 text-[9px]">Rs. {p.price}</span>
                            </div>
                          ) : (
                            <span className="font-black text-neutral-800 dark:text-neutral-100 text-xs">Rs. {p.price}</span>
                          )}
                        </div>
                        
                        <button 
                          onClick={() => { handleAddToCart(p, 1); alert(`${p.name} added to cart!`); }}
                          className="bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-600 hover:text-white p-2 rounded-xl transition-all"
                        >
                          <Plus size={12} strokeWidth={3} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Best Sellers Section */}
            <div className="px-4 space-y-3 pb-8">
              <h4 className="font-extrabold text-xs text-neutral-400 uppercase tracking-widest">{text.bestSelling}</h4>
              
              <div className="space-y-3">
                {filteredProducts.filter(p => p.isBestSeller).map((p) => (
                  <div 
                    key={p.id}
                    onClick={() => { setSelectedProductId(p.id); navigateTo('product_details'); }}
                    className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-900 rounded-2xl p-2.5 shadow-sm flex gap-3 cursor-pointer hover:border-emerald-500/20 transition-all text-left"
                  >
                    <div className="w-16 h-16 bg-neutral-50 dark:bg-neutral-950 rounded-xl overflow-hidden flex-shrink-0">
                      <img referrerPolicy="no-referrer" src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h5 className="font-bold text-neutral-800 dark:text-neutral-100 text-[11px] leading-tight">{p.name}</h5>
                        <p className="text-[10px] text-neutral-400 mt-0.5">{p.unit} • In stock</p>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="font-black text-emerald-700 dark:text-emerald-500 text-xs">Rs. {p.discountPrice || p.price}</span>
                        <div className="flex items-center gap-0.5 text-amber-500 text-[10px] font-bold">
                          <Star size={10} fill="currentColor" /> {p.rating}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ======================================= */}
        {/* F. PRODUCT DETAILS SCREEN               */}
        {/* ======================================= */}
        {currentScreen === 'product_details' && (
          <div className="text-left select-none">
            
            {/* Gallery Image zoom area */}
            <div className="relative h-64 bg-neutral-100 dark:bg-neutral-950">
              <img referrerPolicy="no-referrer" src={selectedProduct.images[activeGalleryIndex] || selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
              
              <div className="absolute top-4 left-4 right-4 flex justify-between">
                <button onClick={navigateBack} className="bg-white/95 dark:bg-neutral-900/95 p-2.5 rounded-xl text-neutral-700 dark:text-neutral-300 shadow-md">
                  <ArrowLeft size={16} />
                </button>
                <button 
                  onClick={() => handleToggleWishlist(selectedProduct.id)}
                  className={`bg-white/95 dark:bg-neutral-900/95 p-2.5 rounded-xl shadow-md transition-all ${
                    wishlist.includes(selectedProduct.id) ? 'text-red-500' : 'text-neutral-600 hover:text-red-400'
                  }`}
                >
                  <Heart size={16} fill={wishlist.includes(selectedProduct.id) ? "currentColor" : "none"} />
                </button>
              </div>

              {/* Dots representation for carousel image gallery */}
              {selectedProduct.images.length > 1 && (
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
                  {selectedProduct.images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveGalleryIndex(idx)}
                      className={`w-2 h-2 rounded-full transition-all ${activeGalleryIndex === idx ? 'bg-emerald-600 w-4' : 'bg-neutral-300'}`}
                    ></button>
                  ))}
                </div>
              )}
            </div>

            {/* Product description detail pane */}
            <div className="p-5 space-y-4">
              <div>
                <span className="text-[9px] font-extrabold text-neutral-400 uppercase tracking-widest">{selectedProduct.category}</span>
                <h3 className="text-lg font-black tracking-tight text-neutral-900 dark:text-white leading-tight mt-0.5">{selectedProduct.name}</h3>
                <span className="text-xs text-neutral-400 block mt-1">{selectedProduct.unit} • fresh, clean produce</span>
              </div>

              {/* Pricing, review stars */}
              <div className="flex justify-between items-center py-2.5 border-y border-neutral-100 dark:border-neutral-900">
                <div>
                  {selectedProduct.discountPrice ? (
                    <div className="flex items-center gap-2">
                      <span className="font-black text-emerald-700 dark:text-emerald-400 text-lg">Rs. {selectedProduct.discountPrice}</span>
                      <span className="line-through text-neutral-400 text-xs">Rs. {selectedProduct.price}</span>
                    </div>
                  ) : (
                    <span className="font-black text-neutral-900 dark:text-white text-lg">Rs. {selectedProduct.price}</span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <div className="flex text-amber-500">
                    <Star size={12} fill="currentColor" />
                    <Star size={12} fill="currentColor" />
                    <Star size={12} fill="currentColor" />
                    <Star size={12} fill="currentColor" />
                    <Star size={12} fill="currentColor" className="opacity-40" />
                  </div>
                  <span className="text-[10px] text-neutral-400 font-bold ml-1">({selectedProduct.reviewsCount || 12} reviews)</span>
                </div>
              </div>

              {/* Detailed specs */}
              <div className="space-y-1.5">
                <h4 className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest">Product Description</h4>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-medium">
                  {selectedProduct.description}
                </p>
              </div>

              {/* Review details */}
              <div className="space-y-2 pt-1">
                <h4 className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest">Customer Reviews</h4>
                {selectedProduct.reviews.length === 0 ? (
                  <p className="text-[10px] text-neutral-400 italic">No reviews yet for this batch. High-quality standards guaranteed!</p>
                ) : (
                  <div className="space-y-2">
                    {selectedProduct.reviews.map((r) => (
                      <div key={r.id} className="bg-neutral-50 dark:bg-neutral-900 p-3 rounded-xl space-y-1 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-neutral-800 dark:text-neutral-100">{r.userName}</span>
                          <span className="text-[9px] text-neutral-400">{r.date}</span>
                        </div>
                        <p className="text-neutral-500 dark:text-neutral-400 italic">"{r.comment}"</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* AI smart recommendations overlay */}
              <div className="bg-emerald-50 dark:bg-emerald-950/40 p-4 rounded-2xl border border-emerald-500/10 space-y-2 mt-4 text-left">
                <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-400 font-bold text-xs">
                  <Sparkles size={14} className="text-emerald-600" />
                  <span>Smart AI Recommendations</span>
                </div>
                <p className="text-[10px] text-emerald-700/80 dark:text-emerald-400/80 leading-normal">
                  Shoppers who bought **{selectedProduct.name}** also love adding **Organic Whole Milk** and **Fresh Green Broccoli** to their breakfast meals!
                </p>
              </div>

              {/* Action buttons footer */}
              <div className="pt-4 flex gap-3">
                <button 
                  onClick={() => { handleAddToCart(selectedProduct, 1); alert(`${selectedProduct.name} added to cart!`); }}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-2xl text-xs shadow-md transition-all"
                >
                  Add to Cart
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ======================================= */}
        {/* G. CART SCREEN                          */}
        {/* ======================================= */}
        {currentScreen === 'cart' && (
          <div className="p-4 space-y-4 text-left select-none">
            
            {/* Screen Header */}
            <div className="flex items-center gap-3">
              <button onClick={navigateBack} className="bg-neutral-100 dark:bg-neutral-900 p-2.5 rounded-xl text-neutral-600 dark:text-neutral-300">
                <ArrowLeft size={16} />
              </button>
              <h3 className="text-lg font-black tracking-tight">{text.cart}</h3>
            </div>

            {cart.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-16 h-16 bg-neutral-50 dark:bg-neutral-900 rounded-full flex items-center justify-center mx-auto text-neutral-400">
                  <ShoppingCart size={24} />
                </div>
                <div>
                  <p className="font-bold text-neutral-800 dark:text-neutral-100">{text.emptyCart}</p>
                  <p className="text-xs text-neutral-400 mt-1">Start adding fresh grocery items to checkout!</p>
                </div>
                <button 
                  onClick={() => navigateTo('home')}
                  className="bg-emerald-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-md"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                
                {/* Cart Items stack */}
                <div className="space-y-2.5">
                  {cart.map((item) => {
                    const finalPrice = item.product.discountPrice || item.product.price;
                    return (
                      <div key={item.product.id} className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-900 p-3 rounded-2xl flex gap-3 shadow-sm relative">
                        <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-950 rounded-xl overflow-hidden flex-shrink-0">
                          <img referrerPolicy="no-referrer" src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                        </div>
                        
                        <div className="flex-1 flex flex-col justify-between py-0.5">
                          <div>
                            <h5 className="font-bold text-neutral-800 dark:text-neutral-100 text-[11px] leading-tight pr-5">{item.product.name}</h5>
                            <span className="text-[10px] text-neutral-400 mt-0.5 block">{item.product.unit} • Rs. {finalPrice.toFixed(2)}</span>
                          </div>

                          <div className="flex justify-between items-center mt-1">
                            <span className="font-black text-emerald-700 dark:text-emerald-500 text-xs">Rs. {(finalPrice * item.quantity).toFixed(2)}</span>
                            
                            {/* Quantity buttons */}
                            <div className="flex items-center bg-neutral-100 dark:bg-neutral-800 rounded-xl px-1.5 py-1">
                              <button 
                                onClick={() => handleUpdateCartQuantity(item.product.id, -1)}
                                className="text-neutral-500 dark:text-neutral-400 p-1"
                              >
                                <Minus size={10} strokeWidth={2.5} />
                              </button>
                              <span className="px-2 text-[10px] font-black">{item.quantity}</span>
                              <button 
                                onClick={() => handleUpdateCartQuantity(item.product.id, 1)}
                                className="text-neutral-500 dark:text-neutral-400 p-1"
                              >
                                <Plus size={10} strokeWidth={2.5} />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Remove item */}
                        <button 
                          onClick={() => handleRemoveFromCart(item.product.id)}
                          className="absolute top-3 right-3 text-neutral-400 hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Free shipping dynamic progress indicator */}
                <div className="bg-emerald-50/50 dark:bg-emerald-950/20 p-4 rounded-2xl border border-emerald-500/10 text-left space-y-2">
                  <div className="flex justify-between text-[10px] font-bold">
                    <span className="text-emerald-800 dark:text-emerald-400 flex items-center gap-1">
                      <Truck size={12} />
                      {cartSubtotal >= 3750 ? 'Free Delivery Achieved!' : text.freeDeliveryText}
                    </span>
                    <span className="text-emerald-600 font-black">Rs. {Math.min(3750, cartSubtotal).toFixed(2)} / Rs. 3,750.00</span>
                  </div>
                  <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-emerald-600 h-full rounded-full transition-all duration-300" 
                      style={{ width: `${Math.min(100, (cartSubtotal / 3750) * 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Coupon application panel */}
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder={text.couponPlaceholder}
                    value={couponCodeInput}
                    onChange={e => setCouponCodeInput(e.target.value)}
                    className="flex-1 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl py-2.5 px-4 text-xs font-semibold uppercase focus:outline-none focus:ring-2 focus:ring-emerald-500 text-neutral-800 dark:text-neutral-100"
                  />
                  <button 
                    type="submit" 
                    className="bg-neutral-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all"
                  >
                    Apply
                  </button>
                </form>
                {couponError && <p className="text-[10px] text-red-500 font-bold">{couponError}</p>}
                
                {activeAppliedCoupon && (
                  <div className="flex justify-between items-center bg-emerald-50 dark:bg-emerald-950/40 px-3.5 py-2.5 rounded-xl border border-emerald-500/20 text-xs">
                    <span className="text-emerald-800 dark:text-emerald-400 font-black">
                      🎟️ Promo Code Applied: {activeAppliedCoupon.code}
                    </span>
                    <button 
                      onClick={() => setActiveAppliedCoupon(null)}
                      className="text-neutral-400 hover:text-red-500"
                    >
                      Remove
                    </button>
                  </div>
                )}

                {/* Cart summary table */}
                <div className="bg-neutral-50 dark:bg-neutral-900/40 rounded-2xl p-4 space-y-2 text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                  <div className="flex justify-between">
                    <span>{text.subtotal}</span>
                    <span className="text-neutral-900 dark:text-neutral-100">Rs. {cartSubtotal.toFixed(2)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-red-500">
                      <span>{text.discount}</span>
                      <span>-Rs. {discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>{text.tax}</span>
                    <span className="text-neutral-900 dark:text-neutral-100">Rs. {estimatedTax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{text.delivery}</span>
                    <span className="text-neutral-900 dark:text-neutral-100">
                      {deliveryCharge === 0 ? 'FREE' : `Rs. ${deliveryCharge.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between font-black text-sm text-neutral-950 dark:text-white border-t border-neutral-100 dark:border-neutral-800 pt-2.5 mt-2.5">
                    <span>{text.total}</span>
                    <span className="text-emerald-700 dark:text-emerald-400">Rs. {grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                <button 
                  id="cart-btn-checkout"
                  onClick={() => navigateTo('checkout')}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-2xl text-xs transition-all shadow-md shadow-emerald-600/10"
                >
                  {text.checkout}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ======================================= */}
        {/* H. CHECKOUT SCREEN                      */}
        {/* ======================================= */}
        {currentScreen === 'checkout' && (
          <div className="p-4 space-y-4 text-left select-none">
            
            {/* Screen Header */}
            <div className="flex items-center gap-3">
              <button onClick={navigateBack} className="bg-neutral-100 dark:bg-neutral-900 p-2.5 rounded-xl text-neutral-600 dark:text-neutral-300">
                <ArrowLeft size={16} />
              </button>
              <h3 className="text-lg font-black tracking-tight">{text.checkoutTitle}</h3>
            </div>

            {/* Address Selection list */}
            <div className="space-y-2.5">
              <div className="flex justify-between items-center">
                <h4 className="font-extrabold text-[10px] text-neutral-400 uppercase tracking-widest">{text.selectAddress}</h4>
                <button onClick={() => navigateTo('addresses')} className="text-emerald-600 font-bold text-[10px] flex items-center gap-0.5">
                  Manage <ChevronRight size={12} />
                </button>
              </div>

              {addresses.length === 0 ? (
                <div className="p-4 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl text-center space-y-2">
                  <p className="text-xs text-neutral-400 italic">No address found. Configure a shipping location.</p>
                  <button 
                    onClick={() => navigateTo('addresses')}
                    className="bg-emerald-600 text-white font-bold text-[10px] px-3.5 py-1.5 rounded-xl"
                  >
                    Add Address Now
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {addresses.map((addr) => (
                    <div 
                      key={addr.id}
                      onClick={() => setSelectedAddressId(addr.id)}
                      className={`border p-3 rounded-2xl cursor-pointer text-xs flex justify-between items-start transition-all ${
                        selectedAddressId === addr.id 
                          ? 'border-emerald-500 bg-emerald-50/20' 
                          : 'border-neutral-100 dark:border-neutral-900 hover:border-neutral-200'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <strong className="text-neutral-900 dark:text-neutral-100 font-bold flex items-center gap-1">
                          <MapPin size={12} className="text-emerald-600" />
                          {addr.title} ({addr.name})
                        </strong>
                        <p className="text-neutral-500 dark:text-neutral-400 text-[11px] font-medium">{addr.street}, {addr.city}</p>
                        <p className="text-neutral-400 text-[10px] font-mono">{addr.phone}</p>
                      </div>

                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        selectedAddressId === addr.id ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-neutral-300'
                      }`}>
                        {selectedAddressId === addr.id && <Check size={10} strokeWidth={3} />}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Delivery Schedule Picker */}
            <div className="space-y-2.5 pt-1">
              <h4 className="font-extrabold text-[10px] text-neutral-400 uppercase tracking-widest">{text.deliverySchedule}</h4>
              
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">Target Date</label>
                  <select 
                    value={deliveryDate} 
                    onChange={e => setDeliveryDate(e.target.value)}
                    className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl py-2.5 px-3 text-xs font-semibold focus:outline-none text-neutral-800 dark:text-neutral-100"
                  >
                    <option value="2026-06-25">June 25 (Today)</option>
                    <option value="2026-06-26">June 26 (Tomorrow)</option>
                    <option value="2026-06-27">June 27 (Saturday)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">Time Window</label>
                  <select 
                    value={deliverySlot} 
                    onChange={e => setDeliverySlot(e.target.value)}
                    className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl py-2.5 px-3 text-xs font-semibold focus:outline-none text-neutral-800 dark:text-neutral-100"
                  >
                    <option value="09:00 AM - 12:00 PM">09 AM - 12 PM</option>
                    <option value="01:00 PM - 04:00 PM">01 PM - 04 PM</option>
                    <option value="04:00 PM - 06:00 PM">04 PM - 06 PM</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Payment Method Picker */}
            <div className="space-y-2.5 pt-1">
              <h4 className="font-extrabold text-[10px] text-neutral-400 uppercase tracking-widest">{text.paymentMethod}</h4>
              
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('COD')}
                  className={`border p-3.5 rounded-2xl text-xs font-bold text-left flex justify-between items-center transition-all ${
                    paymentMethod === 'COD' ? 'border-emerald-500 bg-emerald-50/20' : 'border-neutral-100 dark:border-neutral-900'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Truck size={14} className="text-emerald-600" />
                    Cash on Delivery
                  </span>
                  <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === 'COD' ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-neutral-300'
                  }`}>
                    {paymentMethod === 'COD' && <Check size={8} strokeWidth={3} />}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('Stripe')}
                  className={`border p-3.5 rounded-2xl text-xs font-bold text-left flex justify-between items-center transition-all ${
                    paymentMethod === 'Stripe' ? 'border-emerald-500 bg-emerald-50/20' : 'border-neutral-100 dark:border-neutral-900'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <CreditCard size={14} className="text-emerald-600" />
                    Credit Card (Stripe)
                  </span>
                  <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === 'Stripe' ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-neutral-300'
                  }`}>
                    {paymentMethod === 'Stripe' && <Check size={8} strokeWidth={3} />}
                  </div>
                </button>
              </div>

              {/* Stripe Payment Simulator Card Inputs */}
              {paymentMethod === 'Stripe' && (
                <div className="bg-neutral-900 text-neutral-100 rounded-2xl p-4 space-y-3 shadow-inner mt-2 border border-neutral-800 text-xs font-medium">
                  <div className="flex justify-between items-center border-b border-neutral-800 pb-2 mb-1">
                    <span className="font-extrabold text-[10px] tracking-widest text-emerald-500 flex items-center gap-1 uppercase">
                      <ShieldCheck size={12} />
                      Stripe Secured Payment Gateway
                    </span>
                    <span className="font-mono font-bold text-[9px] bg-emerald-600/20 text-emerald-400 px-1.5 py-0.5 rounded uppercase">Sandbox</span>
                  </div>

                  <div>
                    <label className="text-[9px] font-bold text-neutral-500 uppercase block mb-1">Cardholder Name</label>
                    <input 
                      type="text" 
                      value={stripeCardName}
                      onChange={e => setStripeCardName(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-2 px-3 focus:outline-none text-neutral-100 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] font-bold text-neutral-500 uppercase block mb-1">Card Number</label>
                    <input 
                      type="text" 
                      value={stripeCardNum}
                      onChange={e => setStripeCardNum(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-2 px-3 focus:outline-none text-neutral-100 font-semibold font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[9px] font-bold text-neutral-500 uppercase block mb-1">Expiry</label>
                      <input 
                        type="text" 
                        value={stripeExpiry}
                        onChange={e => setStripeExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-2 px-3 focus:outline-none text-neutral-100 font-semibold font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-neutral-500 uppercase block mb-1">CVC / CVV</label>
                      <input 
                        type="password" 
                        value={stripeCVV}
                        onChange={e => setStripeCVV(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-2 px-3 focus:outline-none text-neutral-100 font-semibold font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Total Order Summary breakdown */}
            <div className="bg-neutral-50 dark:bg-neutral-900/40 p-4 rounded-2xl border border-neutral-100 dark:border-neutral-900 text-xs text-neutral-600 dark:text-neutral-400 space-y-1.5 font-semibold">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="text-neutral-950 dark:text-neutral-100">Rs. {cartSubtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-red-500">
                  <span>Applied Promo Discount</span>
                  <span>-Rs. {discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-black text-sm text-neutral-950 dark:text-white pt-2 border-t border-neutral-100 dark:border-neutral-800 mt-2">
                <span>Grand Total</span>
                <span className="text-emerald-700 dark:text-emerald-400">Rs. {grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Order dispatch loader */}
            <button
              id="checkout-btn-place-order"
              onClick={handlePlaceOrder}
              disabled={isProcessingPayment}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-2xl text-xs transition-all shadow-md flex items-center justify-center gap-2"
            >
              {isProcessingPayment ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing Secure Payment...
                </>
              ) : (
                <>
                  {paymentMethod === 'Stripe' ? `Pay Rs. ${grandTotal.toFixed(2)} with Stripe` : text.placeOrder}
                </>
              )}
            </button>
          </div>
        )}

        {/* ======================================= */}
        {/* I. ORDER SUCCESS SCREEN                  */}
        {/* ======================================= */}
        {currentScreen === 'order_success' && (
          <div className="p-6 flex-1 flex flex-col justify-center items-center text-center space-y-5 select-none">
            <div className="bg-green-100 dark:bg-emerald-950/50 p-5 rounded-full text-green-600 dark:text-emerald-400 animate-bounce shadow-lg">
              <CheckCircle2 size={56} className="stroke-[2.5]" />
            </div>

            <div className="space-y-1.5 max-w-xs">
              <h2 className="text-xl font-black text-neutral-950 dark:text-white tracking-tight">{text.orderSuccess}</h2>
              <p className="text-[11px] text-neutral-400 leading-normal">{text.orderSuccessSub}</p>
            </div>

            {placedOrderRef && (
              <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-900 p-4 rounded-2xl w-full text-xs text-left space-y-1.5 font-medium">
                <div className="flex justify-between border-b border-neutral-100 dark:border-neutral-800 pb-1.5 font-bold text-neutral-900 dark:text-neutral-100">
                  <span>{text.orderNo}</span>
                  <span className="font-mono font-black text-emerald-800 dark:text-emerald-400">{placedOrderRef.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Date</span>
                  <span>{placedOrderRef.deliveryDate}</span>
                </div>
                <div className="flex justify-between">
                  <span>Scheduled Time</span>
                  <span>{placedOrderRef.deliveryTimeSlot}</span>
                </div>
                <div className="flex justify-between font-bold text-neutral-900 dark:text-neutral-100 pt-1.5 border-t border-neutral-100 dark:border-neutral-800 mt-1.5">
                  <span>Total Charges</span>
                  <span>Rs. {placedOrderRef.total.toFixed(2)}</span>
                </div>
              </div>
            )}

            <div className="w-full space-y-2 pt-4">
              <button
                id="success-btn-track"
                onClick={() => navigateTo('orders_history')}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-2xl text-xs shadow-md transition-all"
              >
                Track Order Status
              </button>
              <button
                onClick={() => navigateTo('home')}
                className="w-full bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 text-neutral-700 dark:text-neutral-300 font-bold py-3.5 rounded-2xl text-xs transition-all"
              >
                Continue Grocery Shopping
              </button>
            </div>
          </div>
        )}

        {/* ======================================= */}
        {/* J. ORDERS HISTORY / TRACKING SCREEN      */}
        {/* ======================================= */}
        {currentScreen === 'orders_history' && (
          <div className="p-4 space-y-4 text-left select-none">
            
            {/* Screen Header */}
            <div className="flex items-center gap-3">
              <button onClick={navigateBack} className="bg-neutral-100 dark:bg-neutral-900 p-2.5 rounded-xl text-neutral-600 dark:text-neutral-300">
                <ArrowLeft size={16} />
              </button>
              <h3 className="text-lg font-black tracking-tight">{text.orders}</h3>
            </div>

            {orders.length === 0 ? (
              <div className="py-12 text-center space-y-2">
                <p className="text-sm text-neutral-400 italic">You haven't placed any grocery orders yet.</p>
                <button onClick={() => navigateTo('home')} className="bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl">Shop Organic</button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((o) => (
                  <div key={o.id} className="border border-neutral-100 dark:border-neutral-900 rounded-2xl p-4 bg-white dark:bg-neutral-900 shadow-sm space-y-3.5">
                    
                    {/* Header info */}
                    <div className="flex justify-between items-center border-b border-neutral-100 dark:border-neutral-800 pb-2">
                      <div>
                        <span className="font-mono font-black text-emerald-800 dark:text-emerald-400 text-xs block">{o.orderNumber}</span>
                        <span className="text-[9px] text-neutral-400 font-semibold">{o.createdAt ? new Date(o.createdAt).toLocaleDateString() : 'Just placed'}</span>
                      </div>

                      <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                        o.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                        o.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                        o.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-amber-100 text-amber-800 animate-pulse'
                      }`}>
                        {o.status}
                      </span>
                    </div>

                    {/* Timeline Tracker Graphic representation */}
                    {o.status !== 'Cancelled' && (
                      <div className="py-1 border-b border-neutral-50 dark:border-neutral-800/40 pb-3">
                        <div className="flex justify-between items-center relative text-[9px] text-neutral-400 font-bold px-1 select-none">
                          <div className="absolute top-2 left-4 right-4 h-[2px] bg-neutral-200 dark:bg-neutral-800 z-0"></div>
                          
                          {/* Live progression highlighting based on status */}
                          <div 
                            className="absolute top-2 left-4 h-[2px] bg-emerald-500 z-0 transition-all duration-500" 
                            style={{ 
                              width: o.status === 'Pending' ? '0%' :
                                     o.status === 'Packed' ? '33%' :
                                     o.status === 'Shipped' ? '66%' : '100%'
                            }}
                          ></div>

                          <div className="flex flex-col items-center z-10">
                            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold ${
                              o.status === 'Pending' || o.status === 'Packed' || o.status === 'Shipped' || o.status === 'Delivered'
                                ? 'bg-emerald-600 text-white' : 'bg-neutral-200 dark:bg-neutral-800'
                            }`}>1</span>
                            <span className="mt-1">Pending</span>
                          </div>

                          <div className="flex flex-col items-center z-10">
                            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold ${
                              o.status === 'Packed' || o.status === 'Shipped' || o.status === 'Delivered'
                                ? 'bg-emerald-600 text-white' : 'bg-neutral-200 dark:bg-neutral-800'
                            }`}>2</span>
                            <span className="mt-1">Packed</span>
                          </div>

                          <div className="flex flex-col items-center z-10">
                            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold ${
                              o.status === 'Shipped' || o.status === 'Delivered'
                                ? 'bg-emerald-600 text-white' : 'bg-neutral-200 dark:bg-neutral-800'
                            }`}>3</span>
                            <span className="mt-1">Shipped</span>
                          </div>

                          <div className="flex flex-col items-center z-10">
                            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold ${
                              o.status === 'Delivered' ? 'bg-emerald-600 text-white' : 'bg-neutral-200 dark:bg-neutral-800'
                            }`}>4</span>
                            <span className="mt-1">Arrived</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Ordered items inline summary */}
                    <div className="space-y-1.5 text-xs">
                      {o.items.map((it, idx) => (
                        <div key={idx} className="flex justify-between items-center text-neutral-600 dark:text-neutral-400">
                          <span className="font-medium">{it.productName} ({it.quantity} x {it.unit})</span>
                          <span className="font-bold text-neutral-800 dark:text-neutral-100">Rs. {(it.price * it.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center pt-2.5 border-t border-neutral-100 dark:border-neutral-800 text-xs">
                      <span className="font-bold text-neutral-900 dark:text-neutral-100">Paid Grand Total: <span className="text-emerald-700 dark:text-emerald-400">Rs. {o.total.toFixed(2)}</span></span>
                      
                      <div className="flex gap-2">
                        {/* Cancellation options on initial phases */}
                        {(o.status === 'Pending' || o.status === 'Packed') && (
                          <button
                            onClick={() => handleCancelOrder(o.id)}
                            className="bg-red-50 hover:bg-red-100 text-red-600 font-extrabold text-[10px] px-3 py-1.5 rounded-lg transition-all"
                          >
                            {text.cancelOrder}
                          </button>
                        )}
                        
                        <button
                          onClick={() => handleReorder(o)}
                          className="bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 font-extrabold text-[10px] px-3 py-1.5 rounded-lg transition-all"
                        >
                          {text.reorder}
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ======================================= */}
        {/* K. CUSTOMER PROFILE SCREEN              */}
        {/* ======================================= */}
        {currentScreen === 'profile' && (
          <div className="p-4 space-y-4 text-left select-none">
            
            {/* Screen Header */}
            <div className="flex items-center gap-3">
              <button onClick={navigateBack} className="bg-neutral-100 dark:bg-neutral-900 p-2.5 rounded-xl text-neutral-600 dark:text-neutral-300">
                <ArrowLeft size={16} />
              </button>
              <h3 className="text-lg font-black tracking-tight">{text.profile}</h3>
            </div>

            {/* Profile banner card */}
            <div className="bg-emerald-600 text-white rounded-3xl p-5 flex items-center gap-4 shadow-md">
              <img 
                referrerPolicy="no-referrer"
                src={user ? user.avatar : "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"} 
                alt="Sarah avatar" 
                className="w-16 h-16 rounded-full object-cover border-2 border-white/20" 
              />
              <div>
                <h4 className="font-black text-base leading-tight">{user ? user.name : 'Sarah Connor'}</h4>
                <p className="text-[10px] text-emerald-100 mt-1 font-medium">{user ? user.email : 'bintadam1000@gmail.com'}</p>
                <span className="inline-block bg-white/20 text-[8px] font-extrabold uppercase tracking-widest mt-1.5 px-2.5 py-0.5 rounded">Silver Shopper</span>
              </div>
            </div>

            {/* Navigation options list */}
            <div className="space-y-1.5 text-xs font-semibold">
              <button 
                id="profile-btn-orders"
                onClick={() => navigateTo('orders_history')}
                className="w-full bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-900 hover:border-neutral-200 p-3.5 rounded-2xl flex items-center justify-between text-neutral-700 dark:text-neutral-300 transition-colors"
              >
                <span className="flex items-center gap-3">
                  <ShoppingBag size={14} className="text-emerald-600" />
                  {text.orders}
                </span>
                <ChevronRight size={14} />
              </button>

              <button 
                id="profile-btn-addresses"
                onClick={() => navigateTo('addresses')}
                className="w-full bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-900 hover:border-neutral-200 p-3.5 rounded-2xl flex items-center justify-between text-neutral-700 dark:text-neutral-300 transition-colors"
              >
                <span className="flex items-center gap-3">
                  <MapPin size={14} className="text-emerald-600" />
                  {text.addresses}
                </span>
                <ChevronRight size={14} />
              </button>

              <button 
                id="profile-btn-notifications"
                onClick={() => navigateTo('notifications')}
                className="w-full bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-900 hover:border-neutral-200 p-3.5 rounded-2xl flex items-center justify-between text-neutral-700 dark:text-neutral-300 transition-colors"
              >
                <span className="flex items-center gap-3">
                  <Bell size={14} className="text-emerald-600" />
                  {text.notifications}
                </span>
                <ChevronRight size={14} />
              </button>
            </div>

            {/* Language & theme configuration */}
            <div className="bg-neutral-50 dark:bg-neutral-900 rounded-2xl p-4 space-y-4 mt-2">
              <h4 className="font-extrabold text-[10px] text-neutral-400 uppercase tracking-widest">{text.settings}</h4>
              
              {/* Language Selection */}
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                  <Globe size={14} className="text-emerald-600" />
                  {text.language}
                </span>
                <select 
                  value={currentLanguage} 
                  onChange={e => setCurrentLanguage(e.target.value as Language)}
                  className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl py-1.5 px-3 font-semibold focus:outline-none"
                >
                  <option value="en">English (US)</option>
                  <option value="es">Español (ES)</option>
                  <option value="fr">Français (FR)</option>
                  <option value="ar">العربية (AR)</option>
                  <option value="hi">हिन्दी (IN)</option>
                </select>
              </div>

              {/* Dark Mode toggle */}
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                  {isDarkMode ? <Moon size={14} className="text-emerald-500" /> : <Sun size={14} className="text-amber-500" />}
                  {text.darkMode}
                </span>
                
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className={`w-11 h-6 rounded-full transition-all relative p-0.5 ${
                    isDarkMode ? 'bg-emerald-600' : 'bg-neutral-300'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow transition-all ${
                    isDarkMode ? 'translate-x-5' : 'translate-x-0'
                  }`}></div>
                </button>
              </div>
            </div>

            <button 
              id="profile-btn-logout"
              onClick={handleLogout}
              className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-bold py-3 rounded-2xl text-xs transition-colors mt-4 block"
            >
              {text.logout}
            </button>
          </div>
        )}

        {/* ======================================= */}
        {/* L. ADDRESS MANAGEMENT SCREEN             */}
        {/* ======================================= */}
        {currentScreen === 'addresses' && (
          <div className="p-4 space-y-4 text-left select-none">
            
            {/* Screen Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button onClick={navigateBack} className="bg-neutral-100 dark:bg-neutral-900 p-2.5 rounded-xl text-neutral-600 dark:text-neutral-300">
                  <ArrowLeft size={16} />
                </button>
                <h3 className="text-lg font-black tracking-tight">{text.addresses}</h3>
              </div>

              <button 
                onClick={() => setShowAddressForm(!showAddressForm)}
                className="bg-emerald-50 dark:bg-emerald-950/40 p-2 rounded-xl text-emerald-600 dark:text-emerald-400"
              >
                <Plus size={16} strokeWidth={2.5} />
              </button>
            </div>

            {showAddressForm && (
              <form onSubmit={handleSaveAddress} className="bg-neutral-50 dark:bg-neutral-900 p-4 rounded-2xl border border-neutral-100 dark:border-neutral-800 space-y-3.5 text-xs font-semibold">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">Title Type</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Home, Office" 
                      value={addrTitle}
                      onChange={e => setAddrTitle(e.target.value)}
                      required
                      className="w-full bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl py-2 px-3 text-neutral-800 dark:text-neutral-100 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">Receiver Name</label>
                    <input 
                      type="text" 
                      value={addrName}
                      onChange={e => setAddrName(e.target.value)}
                      required
                      className="w-full bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl py-2 px-3 text-neutral-800 dark:text-neutral-100 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">Street Location</label>
                  <input 
                    type="text" 
                    placeholder="742 Evergreen Terrace" 
                    value={addrStreet}
                    onChange={e => setAddrStreet(e.target.value)}
                    required
                    className="w-full bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl py-2 px-3 text-neutral-800 dark:text-neutral-100 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">City</label>
                    <input 
                      type="text" 
                      placeholder="Springfield" 
                      value={addrCity}
                      onChange={e => setAddrCity(e.target.value)}
                      required
                      className="w-full bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl py-2 px-3 text-neutral-800 dark:text-neutral-100 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">Zip Code</label>
                    <input 
                      type="text" 
                      placeholder="62704" 
                      value={addrZip}
                      onChange={e => setAddrZip(e.target.value)}
                      required
                      className="w-full bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl py-2 px-3 text-neutral-800 dark:text-neutral-100 focus:outline-none"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-md"
                >
                  Save Delivery Address
                </button>
              </form>
            )}

            <div className="space-y-2">
              {addresses.map((a) => (
                <div key={a.id} className="border border-neutral-100 dark:border-neutral-900 p-4 rounded-2xl bg-white dark:bg-neutral-900 shadow-sm flex justify-between items-start text-xs font-semibold">
                  <div>
                    <h5 className="font-extrabold text-neutral-950 dark:text-white flex items-center gap-1.5">
                      <MapPin size={12} className="text-emerald-600" />
                      {a.title} {a.isDefault && <span className="bg-emerald-50 text-emerald-700 text-[8px] px-1.5 py-0.5 rounded uppercase font-bold">Default</span>}
                    </h5>
                    <p className="text-neutral-800 dark:text-neutral-200 font-medium mt-1">{a.name} ({a.phone})</p>
                    <p className="text-neutral-400 font-normal mt-0.5">{a.street}, {a.city}, {a.state} {a.zipCode}</p>
                  </div>
                  
                  <button 
                    onClick={() => handleDeleteAddress(a.id)}
                    className="text-neutral-400 hover:text-red-500 transition-colors p-1"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================= */}
        {/* M. NOTIFICATIONS INBOX SCREEN            */}
        {/* ======================================= */}
        {currentScreen === 'notifications' && (
          <div className="p-4 space-y-4 text-left select-none">
            
            {/* Screen Header */}
            <div className="flex items-center gap-3">
              <button onClick={navigateBack} className="bg-neutral-100 dark:bg-neutral-900 p-2.5 rounded-xl text-neutral-600 dark:text-neutral-300">
                <ArrowLeft size={16} />
              </button>
              <h3 className="text-lg font-black tracking-tight">{text.notifications}</h3>
            </div>

            <div className="space-y-2.5">
              {notifications.map((n) => (
                <div 
                  key={n.id} 
                  className={`p-4 rounded-2xl text-xs font-semibold flex gap-3 shadow-sm border transition-all ${
                    n.isRead 
                      ? 'bg-white dark:bg-neutral-900 border-neutral-100 dark:border-neutral-900 text-neutral-600 dark:text-neutral-400' 
                      : 'bg-emerald-50/20 dark:bg-emerald-950/20 border-emerald-500/20 text-neutral-900 dark:text-white'
                  }`}
                >
                  <div className="bg-emerald-600 text-white p-2.5 rounded-xl h-fit">
                    <Bell size={14} />
                  </div>
                  <div className="space-y-0.5 flex-1 text-left">
                    <h5 className="font-extrabold text-[11px] leading-tight text-neutral-900 dark:text-white">{n.title}</h5>
                    <p className="font-medium text-neutral-500 dark:text-neutral-400 leading-normal text-[10px] mt-0.5">{n.body}</p>
                    <span className="text-[9px] text-neutral-400 font-mono block pt-1">{n.createdAt ? new Date(n.createdAt).toLocaleTimeString() : 'Just now'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================= */}
        {/* N. CUSTOMER SUPPORT CHAT SCREEN          */}
        {/* ======================================= */}
        {currentScreen === 'support_chat' && (
          <div className="flex-1 flex flex-col justify-between overflow-hidden p-3.5 relative">
            
            {/* Top Bar Support Card */}
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-2.5 mb-2 flex-shrink-0">
              <div className="flex items-center gap-2.5 text-left">
                <div className="relative">
                  <div className="w-9 h-9 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                    MS
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-neutral-950 rounded-full animate-ping"></span>
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-neutral-900 dark:text-white tracking-tight leading-none">Support Assistant</h4>
                  <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider block mt-1">Smart AI Online</span>
                </div>
              </div>
              <button 
                onClick={() => setMessages([{ id: 'm1', sender: 'ai', text: 'Thread cleaned! Ask me about Red Apples, Dairy, or track orders.', createdAt: new Date().toISOString() }])}
                className="text-[9px] bg-neutral-100 dark:bg-neutral-900 text-neutral-500 px-2 py-1 rounded font-bold"
              >
                Clear Thread
              </button>
            </div>

            {/* Support Message Bubble Threads */}
            <div className="flex-1 overflow-y-auto space-y-3.5 p-1 flex flex-col">
              {messages.map((m) => {
                const isUser = m.sender === 'user';
                return (
                  <div 
                    key={m.id}
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-left leading-relaxed text-[11px] font-medium shadow-sm transition-all h-fit ${
                      isUser 
                        ? 'bg-emerald-600 text-white self-end rounded-tr-none' 
                        : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 self-start rounded-tl-none border border-neutral-200/10 dark:border-neutral-800/20'
                    }`}
                  >
                    {m.text}
                  </div>
                );
              })}

              {isChatLoading && (
                <div className="bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 self-start rounded-tl-none rounded-2xl px-3.5 py-2 shadow-sm border border-neutral-200/10 flex items-center gap-1.5 text-[11px] font-medium h-fit">
                  <div className="flex gap-0.5">
                    <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                  Smart AI is typing...
                </div>
              )}

              <div ref={chatBottomRef}></div>
            </div>

            {/* Message input bar */}
            <div className="flex gap-2 border-t border-neutral-100 dark:border-neutral-800 pt-3 flex-shrink-0">
              <input 
                type="text" 
                placeholder="Ask e.g., Where is order MS-1094?" 
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/20 dark:border-neutral-800/20 rounded-xl py-3 px-4 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 text-neutral-800 dark:text-neutral-100"
              />
              <button 
                onClick={handleSendMessage}
                className="bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-xl shadow-md transition-all flex items-center justify-center"
              >
                <Send size={14} />
              </button>
            </div>

          </div>
        )}

      </div>

      {/* FIXED BOTTOM NAVIGATION BAR */}
      {['home', 'product_details', 'cart', 'checkout', 'orders_history', 'profile', 'addresses', 'notifications', 'support_chat'].includes(currentScreen) && (
        <nav className="absolute bottom-0 left-0 right-0 h-16 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md border-t border-neutral-100 dark:border-neutral-900/50 flex items-center justify-around z-40 select-none pb-1 shadow-2xl">
          <button 
            id="app-nav-home"
            onClick={() => { setCurrentScreen('home'); setScreenHistory([]); }}
            className={`flex flex-col items-center gap-1 text-[10px] font-black tracking-wide ${currentScreen === 'home' ? 'text-emerald-600 dark:text-emerald-400' : 'text-neutral-400'}`}
          >
            <Home size={18} strokeWidth={currentScreen === 'home' ? 2.5 : 2} />
            Home
          </button>
          
          <button 
            id="app-nav-wishlist"
            onClick={() => { setSelectedProductId(products[0]?.id || 'f1'); navigateTo('product_details'); }}
            className={`flex flex-col items-center gap-1 text-[10px] font-black tracking-wide ${currentScreen === 'product_details' ? 'text-emerald-600 dark:text-emerald-400' : 'text-neutral-400'}`}
          >
            <Sparkles size={18} strokeWidth={currentScreen === 'product_details' ? 2.5 : 2} />
            Details
          </button>

          <button 
            id="app-nav-cart"
            onClick={() => navigateTo('cart')}
            className={`flex flex-col items-center gap-1 text-[10px] font-black tracking-wide relative ${currentScreen === 'cart' ? 'text-emerald-600 dark:text-emerald-400' : 'text-neutral-400'}`}
          >
            <ShoppingCart size={18} strokeWidth={currentScreen === 'cart' ? 2.5 : 2} />
            Cart
            {cart.length > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-emerald-600 text-white text-[8px] font-black w-4.5 h-4.5 rounded-full border-2 border-white dark:border-neutral-950 flex items-center justify-center">
                {cart.reduce((sum, i) => sum + i.quantity, 0)}
              </span>
            )}
          </button>

          <button 
            id="app-nav-chat"
            onClick={() => navigateTo('support_chat')}
            className={`flex flex-col items-center gap-1 text-[10px] font-black tracking-wide ${currentScreen === 'support_chat' ? 'text-emerald-600 dark:text-emerald-400' : 'text-neutral-400'}`}
          >
            <MessageSquare size={18} strokeWidth={currentScreen === 'support_chat' ? 2.5 : 2} />
            Support
          </button>

          <button 
            id="app-nav-profile"
            onClick={() => navigateTo('profile')}
            className={`flex flex-col items-center gap-1 text-[10px] font-black tracking-wide ${['profile', 'addresses', 'orders_history'].includes(currentScreen) ? 'text-emerald-600 dark:text-emerald-400' : 'text-neutral-400'}`}
          >
            <User size={18} strokeWidth={['profile', 'addresses', 'orders_history'].includes(currentScreen) ? 2.5 : 2} />
            Account
          </button>
        </nav>
      )}

    </div>
  );
}

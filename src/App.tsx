import React, { useState } from 'react';
import { 
  INITIAL_CATEGORIES, INITIAL_PRODUCTS, INITIAL_COUPONS, 
  INITIAL_ADDRESSES, INITIAL_ORDERS, INITIAL_NOTIFICATIONS 
} from './data/mockData';
import { Product, Category, Coupon, Order, Address, Notification, CartItem, Language, UserProfile } from './types';
import DeviceFrame from './components/DeviceFrame';
import MobileApp from './components/MobileApp';
import AdminPanel from './components/AdminPanel';
import { ShoppingBag, Laptop, Smartphone, LineChart, Sparkles, Check } from 'lucide-react';

export default function App() {
  // Shared States
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [addresses, setAddresses] = useState<Address[]>(INITIAL_ADDRESSES);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  
  // Mobile app state
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<UserProfile | null>({
    name: 'Sarah Connor',
    email: 'bintadam1000@gmail.com',
    phone: '+1 (555) 019-2834',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80'
  });
  
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Layout View mode for smaller screens or responsive customization
  const [viewMode, setViewMode] = useState<'both' | 'customer' | 'admin'>('both');

  // Helper to trigger alert broadcast from Admin Panel to Mobile app
  const addBroadcastNotification = (title: string, body: string, type: 'offer' | 'general') => {
    const newNotif: Notification = {
      id: 'n-broad-' + Date.now(),
      title,
      body,
      type,
      createdAt: new Date().toISOString(),
      isRead: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Live order calculation for left panel status widget
  const latestActiveOrder = orders.find(o => o.status !== 'Cancelled');

  return (
    <div className={`min-h-screen flex flex-col font-sans select-none antialiased transition-colors duration-200 ${
      isDarkMode ? 'bg-neutral-950 text-neutral-100' : 'bg-slate-100 text-slate-900'
    }`}>
      
      {/* Platform Header */}
      <header className={`border-b px-6 py-4 flex-shrink-0 z-10 shadow-sm transition-colors ${
        isDarkMode ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-slate-200 text-slate-800'
      }`}>
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-600 p-2.5 rounded-xl shadow-md text-white">
              <ShoppingBag className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="font-extrabold text-base tracking-tight leading-none text-emerald-600 dark:text-emerald-500">My Store</h1>
              <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-bold tracking-widest uppercase block mt-1">Multi-Platform Grocery Orchestration</span>
            </div>
          </div>

          {/* Quick Info Badge */}
          <div className={`hidden lg:flex items-center gap-2 text-xs border rounded-xl px-4 py-2 font-semibold transition-colors ${
            isDarkMode 
              ? 'bg-neutral-800 border-neutral-700 text-neutral-300' 
              : 'bg-emerald-50/50 border-emerald-100 text-emerald-800'
          }`}>
            <Sparkles size={14} className="text-emerald-500 animate-pulse" />
            <span>Interactive Workspace: Shop in the customer app on the left & watch the Admin dashboard update instantly!</span>
          </div>

          {/* Responsive Segment View Controls */}
          <div className={`border p-1 rounded-xl flex transition-colors ${
            isDarkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-slate-50 border-slate-200'
          }`}>
            <button
              onClick={() => setViewMode('both')}
              className={`hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'both' 
                  ? 'bg-emerald-600 text-white shadow-sm' 
                  : isDarkMode ? 'text-neutral-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Laptop size={14} />
              Full Workspace View
            </button>
            <button
              onClick={() => setViewMode('customer')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'customer' 
                  ? 'bg-emerald-600 text-white shadow-sm' 
                  : isDarkMode ? 'text-neutral-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Smartphone size={14} />
              Customer App
            </button>
            <button
              onClick={() => setViewMode('admin')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'admin' 
                  ? 'bg-emerald-600 text-white shadow-sm' 
                  : isDarkMode ? 'text-neutral-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <LineChart size={14} />
              Admin Portal
            </button>
          </div>
        </div>
      </header>

      {/* Main split-pane content view */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8 flex flex-col items-stretch overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch w-full h-full">
          
          {/* A. LEFT PANEL: BRAND & FEATURE HIGHLIGHTS */}
          {viewMode === 'both' && (
            <aside className="hidden xl:flex xl:col-span-3 bg-emerald-700 dark:bg-emerald-800 text-white p-8 flex-col justify-between rounded-3xl shadow-xl border border-emerald-800 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
              
              <div className="space-y-8 relative z-10 text-left">
                <div className="flex items-center gap-3">
                  <div className="bg-white p-2.5 rounded-xl text-emerald-700 shadow-md">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-black tracking-tight font-display">My Store</h3>
                </div>

                <div className="space-y-4">
                  <h2 className="text-3xl font-light leading-tight font-display">
                    The Future of <br />
                    <span className="font-extrabold text-white text-4xl block mt-1 tracking-tight">Fresh Groceries</span>
                  </h2>
                  <p className="text-emerald-100 text-sm leading-relaxed opacity-90 font-sans">
                    An intuitive, high-performance web and cloud ecosystem for modern retail grocery operations.
                  </p>
                </div>

                {/* Bullet Points */}
                <div className="space-y-3.5 pt-4 border-t border-emerald-600/50">
                  <div className="flex items-center gap-3">
                    <div className="bg-emerald-600/50 p-1.5 rounded-full text-emerald-100">
                      <Check size={14} strokeWidth={3} />
                    </div>
                    <span className="text-sm font-medium">Stripe Payments Integrated</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-emerald-600/50 p-1.5 rounded-full text-emerald-100">
                      <Check size={14} strokeWidth={3} />
                    </div>
                    <span className="text-sm font-medium">Real-time Order Tracking</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-emerald-600/50 p-1.5 rounded-full text-emerald-100">
                      <Check size={14} strokeWidth={3} />
                    </div>
                    <span className="text-sm font-medium">Cloud Inventory Management</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Live Feed Status Indicator */}
              <div className="bg-emerald-800/60 p-4 rounded-2xl border border-emerald-500/30 relative z-10 text-left mt-8">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[10px] uppercase tracking-widest text-emerald-300 font-bold font-mono">Admin Live Feed</p>
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                  </span>
                </div>
                
                {latestActiveOrder ? (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span>Order {latestActiveOrder.orderNumber}</span>
                      <span className="text-emerald-300">Rs. {latestActiveOrder.total.toFixed(2)}</span>
                    </div>
                    <p className="text-[10px] text-emerald-200/80">Status: <span className="font-bold underline uppercase">{latestActiveOrder.status}</span> • {latestActiveOrder.customerName}</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span>New Order #8842</span>
                      <span className="text-emerald-300">Rs. 10,625.00</span>
                    </div>
                    <p className="text-[10px] text-emerald-200/80">Status: En route • Sarah Connor</p>
                  </div>
                )}
              </div>
            </aside>
          )}

          {/* B. CUSTOMER MOBILE APP PREVIEW SIDE */}
          {(viewMode === 'customer' || viewMode === 'both') && (
            <div className={`flex flex-col justify-center items-center relative overflow-hidden rounded-3xl p-6 border transition-colors ${
              viewMode === 'customer' 
                ? 'col-span-12 max-w-lg mx-auto w-full bg-slate-200/50 dark:bg-neutral-900 border-slate-300/40 dark:border-neutral-800/80' 
                : viewMode === 'both' 
                  ? 'lg:col-span-5 xl:col-span-4 bg-slate-200/50 dark:bg-neutral-900 border-slate-200/60 dark:border-neutral-800/40' 
                  : 'hidden'
            }`}>
              
              {/* Dots grid background from Design HTML */}
              <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#10b981_1.5px,transparent_1.5px)] [background-size:20px_20px]"></div>

              <div className="w-full text-center mb-4 space-y-1 relative z-10">
                <span className="text-[10px] font-black tracking-widest text-emerald-600 dark:text-emerald-500 uppercase font-mono">Interactive Device</span>
                <h2 className={`text-sm font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>📱 Customer Smartphone Preview</h2>
                <p className="text-[11px] text-slate-500 dark:text-neutral-400">Interact to place orders, search items, & chat with support.</p>
              </div>

              {/* Smartphone device shell with internal MobileApp content */}
              <div className="relative z-10 w-full flex justify-center">
                <DeviceFrame>
                  <MobileApp
                    products={products}
                    categories={categories}
                    coupons={coupons}
                    orders={orders}
                    setOrders={setOrders}
                    addresses={addresses}
                    setAddresses={setAddresses}
                    notifications={notifications}
                    setNotifications={setNotifications}
                    wishlist={wishlist}
                    setWishlist={setWishlist}
                    cart={cart}
                    setCart={setCart}
                    user={user}
                    setUser={setUser}
                    currentLanguage={currentLanguage}
                    setCurrentLanguage={setCurrentLanguage}
                    isDarkMode={isDarkMode}
                    setIsDarkMode={setIsDarkMode}
                  />
                </DeviceFrame>
              </div>
            </div>
          )}

          {/* C. ADMIN PORTAL SIDE */}
          {(viewMode === 'admin' || viewMode === 'both') && (
            <div className={`rounded-3xl overflow-hidden shadow-xl flex flex-col border transition-colors ${
              viewMode === 'admin' 
                ? 'col-span-12 h-full' 
                : viewMode === 'both' 
                  ? 'lg:col-span-7 xl:col-span-5 h-full' 
                  : 'hidden'
            } ${
              isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-200'
            }`}>
              <AdminPanel
                products={products}
                setProducts={setProducts}
                categories={categories}
                setCategories={setCategories}
                coupons={coupons}
                setCoupons={setCoupons}
                orders={orders}
                setOrders={setOrders}
                notifications={notifications}
                setNotifications={setNotifications}
                addBroadcastNotification={addBroadcastNotification}
              />
            </div>
          )}

        </div>
      </main>

    </div>
  );
}

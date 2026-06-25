import React, { useState } from 'react';
import { 
  ShoppingBag, Users, Percent, Plus, Edit, Trash2, Check, Clock, 
  Truck, AlertTriangle, XCircle, X, Filter, Search, Image, Tag, 
  TrendingUp, BarChart3, Package, Users2, FileText, CheckCircle2, ChevronRight, Send
} from 'lucide-react';
import { Product, Category, Coupon, Order, UserProfile, Notification } from '../types';

interface AdminPanelProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  coupons: Coupon[];
  setCoupons: React.Dispatch<React.SetStateAction<Coupon[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  addBroadcastNotification: (title: string, body: string, type: 'offer' | 'general') => void;
}

export default function AdminPanel({
  products,
  setProducts,
  categories,
  setCategories,
  coupons,
  setCoupons,
  orders,
  setOrders,
  notifications,
  setNotifications,
  addBroadcastNotification
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'categories' | 'orders' | 'customers' | 'coupons' | 'broadcast'>('dashboard');

  // Product CRUD states
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [pSearch, setPSearch] = useState('');
  const [pCatFilter, setPCatFilter] = useState('All');
  
  // Product Form states
  const [pName, setPName] = useState('');
  const [pCategory, setPCategory] = useState('Fruits');
  const [pPrice, setPPrice] = useState(0);
  const [pDiscountPrice, setPDiscountPrice] = useState<number | undefined>(undefined);
  const [pUnit, setPUnit] = useState('1 kg');
  const [pDescription, setPDescription] = useState('');
  const [pStock, setPStock] = useState(50);
  const [pImage, setPImage] = useState('');

  // Category CRUD states
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('ShoppingBag');

  // Coupon CRUD states
  const [cCode, setCCode] = useState('');
  const [cType, setCType] = useState<'percentage' | 'fixed'>('percentage');
  const [cVal, setCVal] = useState(0);
  const [cMin, setCMin] = useState(0);
  const [cDesc, setCDesc] = useState('');
  const [showCouponModal, setShowCouponModal] = useState(false);

  // Broadcast Alert states
  const [bTitle, setBTitle] = useState('');
  const [bBody, setBBody] = useState('');
  const [bType, setBType] = useState<'offer' | 'general'>('offer');

  // Order status modification
  const handleUpdateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    let paymentStatusUpdate: Order['paymentStatus'] = 'Pending';
    if (newStatus === 'Delivered') {
      paymentStatusUpdate = 'Paid';
    }

    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        // Trigger a notification for user
        const statusPhrases = {
          Pending: 'is currently pending review.',
          Packed: 'has been packed and prepared with love!',
          Shipped: 'is on its way to you! Our delivery rider has departed.',
          Delivered: 'has been safely delivered! Enjoy your fresh groceries.',
          Cancelled: 'has been cancelled.'
        };
        
        const newNotif: Notification = {
          id: 'n-ord-' + Date.now(),
          title: newStatus === 'Delivered' ? '📦 Order Delivered!' : `📦 Order Update: ${newStatus}`,
          body: `Your order ${o.orderNumber} ${statusPhrases[newStatus]}`,
          type: newStatus === 'Delivered' ? 'delivery' : 'order',
          createdAt: new Date().toISOString(),
          isRead: false
        };
        setNotifications(prevNotifs => [newNotif, ...prevNotifs]);

        return { 
          ...o, 
          status: newStatus,
          paymentStatus: newStatus === 'Delivered' && o.paymentMethod === 'COD' ? 'Paid' : o.paymentStatus
        };
      }
      return o;
    }));
  };

  // KPI Calculations
  const totalSales = orders
    .filter(o => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const pendingCount = orders.filter(o => o.status === 'Pending').length;
  const activeCouponsCount = coupons.filter(c => c.isActive).length;
  const customersCount = 2; // Sarah Connor + John Doe

  // Custom SVG Chart calculations
  const dailyRevData = [
    { label: 'Jun 19', sales: 125 },
    { label: 'Jun 20', sales: 240 },
    { label: 'Jun 21', sales: 310 },
    { label: 'Jun 22', sales: 215 },
    { label: 'Jun 23', sales: 418 },
    { label: 'Jun 24', sales: 380 },
    { label: 'Today', sales: totalSales > 0 ? Math.round(totalSales) : 185 },
  ];

  const categoryBreakdown: { [key: string]: number } = {};
  orders.forEach(o => {
    if (o.status !== 'Cancelled') {
      o.items.forEach(i => {
        const prod = products.find(p => p.id === i.productId);
        const cat = prod ? prod.category : 'Others';
        categoryBreakdown[cat] = (categoryBreakdown[cat] || 0) + i.quantity;
      });
    }
  });

  const catChartData = Object.keys(categoryBreakdown).map(cat => ({
    category: cat,
    quantity: categoryBreakdown[cat]
  })).sort((a,b) => b.quantity - a.quantity);

  // SVG Chart Dimensions
  const lineChartWidth = 500;
  const lineChartHeight = 220;
  const maxSales = Math.max(...dailyRevData.map(d => d.sales), 500);

  const barChartWidth = 400;
  const barChartHeight = 220;
  const maxQty = catChartData.length > 0 ? Math.max(...catChartData.map(d => d.quantity), 5) : 10;

  // Product Handlers
  const handleOpenProductModal = (prod: Product | null) => {
    if (prod) {
      setEditingProduct(prod);
      setPName(prod.name);
      setPCategory(prod.category);
      setPPrice(prod.price);
      setPDiscountPrice(prod.discountPrice);
      setPUnit(prod.unit);
      setPDescription(prod.description);
      setPStock(prod.stock);
      setPImage(prod.image);
    } else {
      setEditingProduct(null);
      setPName('');
      setPCategory(categories[0]?.name || 'Fruits');
      setPPrice(1.99);
      setPDiscountPrice(undefined);
      setPUnit('1 kg');
      setPDescription('');
      setPStock(50);
      setPImage('https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80');
    }
    setShowProductModal(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pName || pPrice <= 0) return;

    if (editingProduct) {
      // Edit
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? {
        ...p,
        name: pName,
        category: pCategory,
        price: Number(pPrice),
        discountPrice: pDiscountPrice ? Number(pDiscountPrice) : undefined,
        unit: pUnit,
        description: pDescription,
        stock: Number(pStock),
        image: pImage || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80',
        images: [pImage || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80']
      } : p));
    } else {
      // Create
      const newProd: Product = {
        id: 'p-' + Date.now(),
        name: pName,
        category: pCategory,
        price: Number(pPrice),
        discountPrice: pDiscountPrice ? Number(pDiscountPrice) : undefined,
        unit: pUnit,
        description: pDescription,
        stock: Number(pStock),
        image: pImage || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80',
        images: [pImage || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80'],
        rating: 5.0,
        reviewsCount: 0,
        reviews: [],
        isFeatured: true,
        isBestSeller: false
      };
      setProducts(prev => [newProd, ...prev]);
    }
    setShowProductModal(false);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  // Add Category Handler
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName) return;
    const slug = newCatName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newCat: Category = {
      id: 'cat-' + Date.now(),
      name: newCatName,
      icon: newCatIcon,
      slug
    };
    setCategories(prev => [...prev, newCat]);
    setNewCatName('');
  };

  // Coupon handlers
  const handleSaveCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cCode || cVal <= 0) return;
    const newC: Coupon = {
      id: 'coupon-' + Date.now(),
      code: cCode.toUpperCase(),
      discountType: cType,
      discountValue: Number(cVal),
      minOrderAmount: Number(cMin),
      description: cDesc || `Save ${cType === 'percentage' ? cVal + '%' : 'Rs. ' + cVal} on orders!`,
      isActive: true,
      expiryDate: '2026-12-31'
    };
    setCoupons(prev => [newC, ...prev]);
    setCCode('');
    setCVal(0);
    setCMin(0);
    setCDesc('');
    setShowCouponModal(false);
  };

  // Broadcast Notification handler
  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bTitle || !bBody) return;
    addBroadcastNotification(bTitle, bBody, bType);
    setBTitle('');
    setBBody('');
    alert('Offer Alert broadcasted successfully to all devices!');
  };

  // Filtered Products
  const filteredProducts = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(pSearch.toLowerCase()) || p.category.toLowerCase().includes(pSearch.toLowerCase());
    const matchCat = pCatFilter === 'All' || p.category === pCatFilter;
    return matchSearch && matchCat;
  });

  return (
    <div id="admin-panel" className="bg-neutral-50 min-h-screen text-neutral-800 flex flex-col md:flex-row">
      
      {/* Sidebar navigation */}
      <aside className="w-full md:w-64 bg-emerald-950 text-white flex flex-col flex-shrink-0 shadow-lg border-r border-emerald-900">
        <div className="p-6 border-b border-emerald-900 flex items-center gap-3">
          <div className="bg-white p-2 rounded-xl text-emerald-600 shadow-md">
            <ShoppingBag className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="font-bold text-lg tracking-tight leading-none text-emerald-100">My Store</h2>
            <span className="text-xs text-emerald-400 font-semibold tracking-wider uppercase">Admin Portal</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <button 
            id="admin-nav-dashboard"
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'dashboard' ? 'bg-emerald-800 text-white shadow-md' : 'text-emerald-200 hover:bg-emerald-900/50 hover:text-white'}`}
          >
            <TrendingUp size={18} />
            Analytics Dashboard
          </button>
          <button 
            id="admin-nav-products"
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'products' ? 'bg-emerald-800 text-white shadow-md' : 'text-emerald-200 hover:bg-emerald-900/50 hover:text-white'}`}
          >
            <Package size={18} />
            Manage Products ({products.length})
          </button>
          <button 
            id="admin-nav-categories"
            onClick={() => setActiveTab('categories')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'categories' ? 'bg-emerald-800 text-white shadow-md' : 'text-emerald-200 hover:bg-emerald-900/50 hover:text-white'}`}
          >
            <Tag size={18} />
            Category Setup
          </button>
          <button 
            id="admin-nav-orders"
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'orders' ? 'bg-emerald-800 text-white shadow-md' : 'text-emerald-200 hover:bg-emerald-900/50 hover:text-white'}`}
          >
            <ShoppingBag size={18} />
            Dispatch Orders
            {pendingCount > 0 && (
              <span className="ml-auto bg-amber-500 text-white font-bold text-[10px] px-2 py-0.5 rounded-full animate-pulse">{pendingCount}</span>
            )}
          </button>
          <button 
            id="admin-nav-customers"
            onClick={() => setActiveTab('customers')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'customers' ? 'bg-emerald-800 text-white shadow-md' : 'text-emerald-200 hover:bg-emerald-900/50 hover:text-white'}`}
          >
            <Users2 size={18} />
            Customer List
          </button>
          <button 
            id="admin-nav-coupons"
            onClick={() => setActiveTab('coupons')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'coupons' ? 'bg-emerald-800 text-white shadow-md' : 'text-emerald-200 hover:bg-emerald-900/50 hover:text-white'}`}
          >
            <Percent size={18} />
            Coupon Marketing ({coupons.length})
          </button>
          <button 
            id="admin-nav-broadcast"
            onClick={() => setActiveTab('broadcast')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'broadcast' ? 'bg-emerald-800 text-white shadow-md' : 'text-emerald-200 hover:bg-emerald-900/50 hover:text-white'}`}
          >
            <Send size={18} />
            Push Broadcast Alert
          </button>
        </nav>
        
        {/* Footnote branding */}
        <div className="p-4 border-t border-emerald-900 text-xs text-emerald-400">
          <span>Active Session Admin:</span>
          <div className="font-semibold text-emerald-200 truncate mt-0.5">manager@mystore.com</div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto max-h-screen">
        
        {/* Content Header */}
        <header className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 capitalize">
              {activeTab === 'dashboard' ? 'Analytics Overview' : activeTab}
            </h1>
            <p className="text-sm text-neutral-500">Real-time control panel synchronization with mobile client.</p>
          </div>
          
          <div className="flex items-center gap-3 text-xs bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-xl px-4 py-2 font-medium shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Sync State Status: LIVE CONNECTED
          </div>
        </header>

        {/* 1. ANALYTICS DASHBOARD VIEW */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white rounded-2xl p-5 border border-neutral-100 shadow-sm flex items-center gap-4">
                <div className="bg-emerald-100 p-3 rounded-xl text-emerald-600">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-neutral-400 tracking-wider uppercase">Total Sales</span>
                  <h3 className="text-xl font-bold text-neutral-900 mt-0.5">Rs. {totalSales.toFixed(2)}</h3>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-neutral-100 shadow-sm flex items-center gap-4">
                <div className="bg-amber-100 p-3 rounded-xl text-amber-600">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-neutral-400 tracking-wider uppercase">Pending Orders</span>
                  <h3 className="text-xl font-bold text-neutral-900 mt-0.5">{pendingCount} orders</h3>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-neutral-100 shadow-sm flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-neutral-400 tracking-wider uppercase">Registered Shoppers</span>
                  <h3 className="text-xl font-bold text-neutral-900 mt-0.5">{customersCount} accounts</h3>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-neutral-100 shadow-sm flex items-center gap-4">
                <div className="bg-purple-100 p-3 rounded-xl text-purple-600">
                  <Percent className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-neutral-400 tracking-wider uppercase">Active Promo Codes</span>
                  <h3 className="text-xl font-bold text-neutral-900 mt-0.5">{activeCouponsCount} coupons</h3>
                </div>
              </div>
            </div>

            {/* Interactive Custom SVG Analytics Graphs */}
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
              
              {/* Daily Sales Trends (Line Chart) */}
              <div className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm xl:col-span-3">
                <h3 className="font-bold text-neutral-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="text-emerald-500 w-5 h-5" />
                  Daily Revenue trends (Rs.)
                </h3>
                
                <div className="w-full overflow-x-auto">
                  <svg width="100%" height={lineChartHeight} viewBox={`0 0 ${lineChartWidth} ${lineChartHeight}`} className="mx-auto overflow-visible">
                    {/* Gridlines */}
                    <line x1="40" y1="20" x2="480" y2="20" stroke="#f0f0f0" strokeDasharray="3,3" />
                    <line x1="40" y1="70" x2="480" y2="70" stroke="#f0f0f0" strokeDasharray="3,3" />
                    <line x1="40" y1="120" x2="480" y2="120" stroke="#f0f0f0" strokeDasharray="3,3" />
                    <line x1="40" y1="170" x2="480" y2="170" stroke="#e5e5e5" />

                    {/* Chart Gradient fill */}
                    <defs>
                      <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Area Polygon */}
                    <polygon
                      points={`
                        40,170 
                        ${dailyRevData.map((d, i) => {
                          const x = 40 + (i * 70);
                          const y = 170 - (d.sales / maxSales) * 140;
                          return `${x},${y}`;
                        }).join(' ')} 
                        460,170
                      `}
                      fill="url(#chart-grad)"
                    />

                    {/* Connected Line Path */}
                    <polyline
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={dailyRevData.map((d, i) => {
                        const x = 40 + (i * 70);
                        const y = 170 - (d.sales / maxSales) * 140;
                        return `${x},${y}`;
                      }).join(' ')}
                    />

                    {/* Circles & Labels */}
                    {dailyRevData.map((d, i) => {
                      const x = 40 + (i * 70);
                      const y = 170 - (d.sales / maxSales) * 140;
                      return (
                        <g key={i} className="group cursor-pointer">
                          <circle
                            cx={x}
                            cy={y}
                            r="5"
                            fill="#10b981"
                            stroke="white"
                            strokeWidth="2"
                            className="transition-all hover:scale-150"
                          />
                          <text x={x} y={y - 12} textAnchor="middle" className="text-[10px] font-bold fill-neutral-700">
                            ${d.sales}
                          </text>
                          <text x={x} y="192" textAnchor="middle" className="text-[11px] font-medium fill-neutral-400">
                            {d.label}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>

              {/* Order breakdown by category (Bar Chart) */}
              <div className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm xl:col-span-2">
                <h3 className="font-bold text-neutral-900 mb-4 flex items-center gap-2">
                  <BarChart3 className="text-emerald-500 w-5 h-5" />
                  Popular Categories (Qty Sold)
                </h3>
                
                {catChartData.length === 0 ? (
                  <div className="h-44 flex items-center justify-center text-neutral-400 text-sm italic">
                    Place orders in the Mobile App to populate this chart!
                  </div>
                ) : (
                  <div className="w-full overflow-x-auto">
                    <svg width="100%" height={barChartHeight} viewBox={`0 0 ${barChartWidth} ${barChartHeight}`} className="mx-auto overflow-visible">
                      {/* Gridlines */}
                      <line x1="10" y1="20" x2="380" y2="20" stroke="#f0f0f0" strokeDasharray="3,3" />
                      <line x1="10" y1="90" x2="380" y2="90" stroke="#f0f0f0" strokeDasharray="3,3" />
                      <line x1="10" y1="160" x2="380" y2="160" stroke="#e5e5e5" />

                      {catChartData.map((d, i) => {
                        const barWidth = 35;
                        const spacing = (370 / catChartData.length);
                        const x = 30 + (i * spacing);
                        const barHeight = (d.quantity / maxQty) * 130;
                        const y = 160 - barHeight;

                        return (
                          <g key={i}>
                            <rect
                              x={x}
                              y={y}
                              width={barWidth}
                              height={barHeight}
                              rx="4"
                              fill="#047857"
                              className="transition-all hover:fill-emerald-500 duration-200"
                            />
                            <text x={x + barWidth/2} y={y - 8} textAnchor="middle" className="text-[10px] font-bold fill-neutral-700">
                              {d.quantity}
                            </text>
                            <text 
                              x={x + barWidth/2} 
                              y="180" 
                              textAnchor="middle" 
                              className="text-[10px] font-medium fill-neutral-500 truncate max-w-[50px]"
                            >
                              {d.category.split(' ')[0]}
                            </text>
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-neutral-900">Recent Transactions Monitor</h3>
                <button 
                  onClick={() => setActiveTab('orders')}
                  className="text-emerald-600 hover:text-emerald-700 text-xs font-semibold flex items-center gap-1 transition-all"
                >
                  Go to Orders list <ChevronRight size={14} />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-100 text-neutral-400 text-xs font-semibold uppercase tracking-wider">
                      <th className="py-3 px-4">Order Code</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Delivery Date</th>
                      <th className="py-3 px-4">Method</th>
                      <th className="py-3 px-4 text-right">Total</th>
                      <th className="py-3 px-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-50 text-sm text-neutral-700">
                    {orders.slice(0, 4).map((o) => (
                      <tr key={o.id} className="hover:bg-neutral-50/50 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-emerald-800">{o.orderNumber}</td>
                        <td className="py-3.5 px-4 font-medium">{o.customerName}</td>
                        <td className="py-3.5 px-4">{o.deliveryDate}</td>
                        <td className="py-3.5 px-4 font-semibold text-xs">{o.paymentMethod}</td>
                        <td className="py-3.5 px-4 text-right font-bold text-neutral-900">Rs. {o.total.toFixed(2)}</td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold leading-none ${
                            o.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                            o.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                            o.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-amber-100 text-amber-800 animate-pulse'
                          }`}>
                            {o.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* 2. PRODUCT MANAGEMENT VIEW */}
        {activeTab === 'products' && (
          <div className="space-y-5 bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
            
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 border-b border-neutral-100 pb-5">
              <div className="flex flex-1 flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
                  <input 
                    type="text" 
                    placeholder="Search by name, ID..." 
                    value={pSearch} 
                    onChange={e => setPSearch(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  />
                </div>
                <div className="relative">
                  <select 
                    value={pCatFilter} 
                    onChange={e => setPCatFilter(e.target.value)}
                    className="bg-neutral-50 border border-neutral-200 rounded-xl py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  >
                    <option value="All">All Categories</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <button 
                id="admin-btn-add-product"
                onClick={() => handleOpenProductModal(null)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
              >
                <Plus size={16} strokeWidth={2.5} />
                Add New Product
              </button>
            </div>

            {/* Products grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredProducts.map(p => (
                <div key={p.id} className="border border-neutral-100 rounded-2xl overflow-hidden hover:shadow-md transition-shadow bg-white flex flex-col justify-between">
                  <div className="relative bg-neutral-100 h-40">
                    <img referrerPolicy="no-referrer" src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    {p.discountPrice && (
                      <span className="absolute top-3 left-3 bg-red-500 text-white font-black text-xs px-2.5 py-1 rounded-full uppercase tracking-wider">
                        Sale
                      </span>
                    )}
                    <span className="absolute bottom-3 right-3 bg-black/75 text-white text-xs font-bold px-2 py-0.5 rounded backdrop-blur">
                      {p.unit}
                    </span>
                  </div>
                  
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">{p.category}</span>
                      <h4 className="font-bold text-neutral-900 mt-1 leading-tight">{p.name}</h4>
                      <p className="text-xs text-neutral-500 mt-1.5 line-clamp-2">{p.description}</p>
                    </div>

                    <div className="mt-4 border-t border-neutral-100 pt-3 flex items-center justify-between">
                      <div>
                        {p.discountPrice ? (
                          <div className="flex items-center gap-2">
                            <span className="font-black text-emerald-700 text-base">Rs. {p.discountPrice}</span>
                            <span className="line-through text-neutral-400 text-xs">Rs. {p.price}</span>
                          </div>
                        ) : (
                          <span className="font-black text-neutral-900 text-base">Rs. {p.price}</span>
                        )}
                        <span className="text-[10px] text-neutral-500 font-semibold block mt-0.5">
                          In Stock: {p.stock} units
                        </span>
                      </div>

                      <div className="flex gap-1.5">
                        <button 
                          onClick={() => handleOpenProductModal(p)}
                          className="bg-neutral-100 hover:bg-emerald-100 hover:text-emerald-700 text-neutral-600 p-2 rounded-xl transition-colors"
                          title="Edit Product"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(p.id)}
                          className="bg-neutral-100 hover:bg-red-100 hover:text-red-700 text-neutral-600 p-2 rounded-xl transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12 text-neutral-400 italic">
                No products found matching your search. Try adjusting criteria or click "Add New Product" to populate!
              </div>
            )}
          </div>
        )}

        {/* 3. CATEGORY SETUP VIEW */}
        {activeTab === 'categories' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Left form */}
            <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm h-fit">
              <h3 className="font-bold text-neutral-900 mb-4 flex items-center gap-2 border-b border-neutral-100 pb-2">
                <Plus size={18} className="text-emerald-500" />
                Add New Category
              </h3>
              
              <form onSubmit={handleAddCategory} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-1">Category Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Baking Essentials" 
                    value={newCatName}
                    onChange={e => setNewCatName(e.target.value)}
                    required
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-1">Lucide Icon Name</label>
                  <select
                    value={newCatIcon}
                    onChange={e => setNewCatIcon(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  >
                    <option value="ShoppingBag">ShoppingBag (General)</option>
                    <option value="Apple">Apple (Fruits/Food)</option>
                    <option value="Salad">Salad (Veggies)</option>
                    <option value="Milk">Milk (Dairy/Eggs)</option>
                    <option value="GlassWater">GlassWater (Beverages)</option>
                    <option value="Cookie">Cookie (Snacks)</option>
                    <option value="Flame">Flame (Spicy/Hot)</option>
                    <option value="Utensils">Utensils (Kitchen)</option>
                  </select>
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-sm transition-all shadow-md"
                >
                  Create Category
                </button>
              </form>
            </div>

            {/* Right category listing */}
            <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm md:col-span-2">
              <h3 className="font-bold text-neutral-900 mb-4 border-b border-neutral-100 pb-2">Active Categories Setup</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {categories.map((c) => (
                  <div key={c.id} className="flex items-center justify-between border border-neutral-100 rounded-xl p-4 hover:border-emerald-500/50 transition-colors bg-white shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="bg-emerald-50 p-2.5 rounded-lg text-emerald-600">
                        <Tag size={18} />
                      </div>
                      <div>
                        <h4 className="font-bold text-neutral-900 text-sm">{c.name}</h4>
                        <span className="text-[10px] text-neutral-400 font-mono">slug: {c.slug}</span>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => setCategories(prev => prev.filter(x => x.id !== c.id))}
                      className="text-neutral-400 hover:text-red-500 transition-colors p-1"
                      title="Delete category"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* 4. DISPATCH ORDERS VIEW */}
        {activeTab === 'orders' && (
          <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm space-y-6">
            <h3 className="font-bold text-neutral-900 border-b border-neutral-100 pb-3">Active Order Processing Hub</h3>

            <div className="space-y-4">
              {orders.map((o) => (
                <div key={o.id} className="border border-neutral-100 rounded-2xl p-5 bg-white shadow-sm flex flex-col xl:flex-row justify-between gap-5 hover:border-emerald-500/30 transition-all">
                  
                  {/* Order info details */}
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-mono font-black text-emerald-800 text-base">{o.orderNumber}</span>
                      <span className="text-xs text-neutral-400 font-semibold">{o.createdAt ? new Date(o.createdAt).toLocaleString() : 'Just placed'}</span>
                      
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded leading-none ${
                        o.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {o.paymentStatus} via {o.paymentMethod}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mt-2 text-neutral-600">
                      <div>
                        <strong className="block text-neutral-900 font-bold mb-1">Customer & Destination:</strong>
                        <p className="font-medium text-neutral-800">{o.customerName} ({o.customerEmail})</p>
                        <p className="text-neutral-500">{o.address.street}, {o.address.city}, {o.address.state} {o.address.zipCode}</p>
                      </div>
                      <div>
                        <strong className="block text-neutral-900 font-bold mb-1">Delivery Target Scheduling:</strong>
                        <p className="font-medium text-neutral-800">{o.deliveryDate}</p>
                        <p className="text-neutral-500">{o.deliveryTimeSlot}</p>
                      </div>
                    </div>

                    {/* Ordered items listing */}
                    <div className="bg-neutral-50 rounded-xl p-3 mt-3">
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1.5">Purchased Grocery Items:</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {o.items.map((it, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs">
                            <img referrerPolicy="no-referrer" src={it.image} alt={it.productName} className="w-8 h-8 rounded object-cover" />
                            <div>
                              <span className="font-bold text-neutral-800">{it.productName}</span>
                              <span className="text-neutral-400 ml-1 font-mono">({it.quantity} x {it.unit})</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Pricing and dispatch status controls */}
                  <div className="xl:w-64 border-t xl:border-t-0 xl:border-l border-neutral-100 pt-4 xl:pt-0 xl:pl-5 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center text-xs text-neutral-500 mb-1">
                        <span>Cart Subtotal</span>
                        <span>Rs. {o.subtotal.toFixed(2)}</span>
                      </div>
                      {o.discount > 0 && (
                        <div className="flex justify-between items-center text-xs text-red-500 mb-1 font-semibold">
                          <span>Applied Coupon Discount</span>
                          <span>-Rs. {o.discount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center font-bold text-sm text-neutral-900 border-t border-neutral-100 pt-1.5">
                        <span>Grand Total</span>
                        <span>Rs. {o.total.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="mt-4 xl:mt-0 space-y-2">
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Modify Dispatch Status:</span>
                      
                      <div className="flex flex-wrap gap-1.5">
                        {(['Pending', 'Packed', 'Shipped', 'Delivered', 'Cancelled'] as Order['status'][]).map((st) => (
                          <button
                            key={st}
                            onClick={() => handleUpdateOrderStatus(o.id, st)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                              o.status === st 
                                ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-500/20' 
                                : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-600'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. CUSTOMER LIST VIEW */}
        {activeTab === 'customers' && (
          <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
            <h3 className="font-bold text-neutral-900 mb-4 border-b border-neutral-100 pb-2">Platform Registered Customers</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-neutral-100 text-neutral-400 text-xs font-semibold uppercase tracking-wider">
                    <th className="py-3 px-4">Customer Name</th>
                    <th className="py-3 px-4">Contact Detail</th>
                    <th className="py-3 px-4">Default Delivery Address</th>
                    <th className="py-3 px-4 text-center">Orders Placed</th>
                    <th className="py-3 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-50 text-sm text-neutral-700">
                  <tr className="hover:bg-neutral-50/50 transition-colors">
                    <td className="py-4 px-4 flex items-center gap-3">
                      <img referrerPolicy="no-referrer" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" alt="Sarah" className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <h4 className="font-bold text-neutral-900 leading-tight">Sarah Connor</h4>
                        <span className="text-xs text-neutral-400 font-mono">UID: usr_8091</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-medium text-neutral-800">bintadam1000@gmail.com</p>
                      <p className="text-xs text-neutral-400">+1 (555) 019-2834</p>
                    </td>
                    <td className="py-4 px-4 text-xs text-neutral-500">
                      742 Evergreen Terrace Springfield, IL 62704
                    </td>
                    <td className="py-4 px-4 text-center font-bold text-neutral-950">
                      {orders.length}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="bg-green-100 text-green-800 font-bold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider">
                        Active
                      </span>
                    </td>
                  </tr>

                  <tr className="hover:bg-neutral-50/50 transition-colors">
                    <td className="py-4 px-4 flex items-center gap-3">
                      <img referrerPolicy="no-referrer" src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80" alt="John" className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <h4 className="font-bold text-neutral-900 leading-tight">John Doe</h4>
                        <span className="text-xs text-neutral-400 font-mono">UID: usr_3321</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-medium text-neutral-800">john.doe@example.com</p>
                      <p className="text-xs text-neutral-400">+1 (555) 441-9988</p>
                    </td>
                    <td className="py-4 px-4 text-xs text-neutral-500 italic">No address configured</td>
                    <td className="py-4 px-4 text-center font-bold text-neutral-950">0</td>
                    <td className="py-4 px-4 text-center">
                      <span className="bg-green-100 text-green-800 font-bold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider">
                        Active
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 6. COUPON MANAGEMENT VIEW */}
        {activeTab === 'coupons' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Coupon Builder form */}
            <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm h-fit">
              <h3 className="font-bold text-neutral-900 mb-4 flex items-center gap-2 border-b border-neutral-100 pb-2">
                <Plus size={18} className="text-emerald-500" />
                Create Promo Coupon
              </h3>
              
              <form onSubmit={handleSaveCoupon} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-1">Coupon Code (Uppercase)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. FLASH50" 
                    value={cCode}
                    onChange={e => setCCode(e.target.value)}
                    required
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all uppercase"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-1">Discount Type</label>
                    <select
                      value={cType}
                      onChange={e => setCType(e.target.value as any)}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Cash (Rs.)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-1">Discount Value</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 15" 
                      value={cVal || ''}
                      onChange={e => setCVal(Number(e.target.value))}
                      required
                      min="1"
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-1">Min Order Amount (Rs.)</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 20" 
                    value={cMin || ''}
                    onChange={e => setCMin(Number(e.target.value))}
                    required
                    min="0"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-1">Short Description</label>
                  <textarea 
                    placeholder="e.g. Save 20% on orders above Rs. 5000!" 
                    value={cDesc}
                    onChange={e => setCDesc(e.target.value)}
                    rows={2}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-sm transition-all shadow-md"
                >
                  Launch Promo Code
                </button>
              </form>
            </div>

            {/* Coupons Display */}
            <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm md:col-span-2 space-y-4">
              <h3 className="font-bold text-neutral-900 border-b border-neutral-100 pb-2">Active Promo Campaigns</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {coupons.map((c) => (
                  <div key={c.id} className="border-2 border-dashed border-emerald-500/20 hover:border-emerald-500/50 rounded-2xl p-4 transition-colors bg-emerald-50/20 relative">
                    <div className="flex items-center gap-2">
                      <span className="bg-emerald-600 text-white font-black text-xs px-3 py-1 rounded-lg uppercase tracking-wider font-mono">
                        {c.code}
                      </span>
                      <span className="text-xs font-bold text-emerald-800">
                        {c.discountType === 'percentage' ? `${c.discountValue}% Off` : `Rs. ${c.discountValue} Off`}
                      </span>
                    </div>

                    <p className="text-xs font-bold text-neutral-700 mt-3">{c.description}</p>
                    <p className="text-[10px] text-neutral-400 mt-1">Min Purchase Required: Rs. {c.minOrderAmount.toFixed(2)}</p>
                    
                    <button 
                      onClick={() => setCoupons(prev => prev.filter(x => x.id !== c.id))}
                      className="absolute top-4 right-4 text-neutral-400 hover:text-red-500 transition-colors p-1"
                      title="Deactivate coupon"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* 7. BROADCAST ALERT VIEW */}
        {activeTab === 'broadcast' && (
          <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
            <h3 className="font-bold text-neutral-900 mb-4 border-b border-neutral-100 pb-2">Broadcast Push Alert Toast</h3>
            <p className="text-xs text-neutral-500 mb-5 leading-relaxed">
              Dispatching a broadcast push alert immediately pushes a real-time floating notification dialog onto the active smartphone interface of the customer! Excellent for flash deals, weekend discount notifications, or delivery announcements.
            </p>

            <form onSubmit={handleBroadcast} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-1">Push Alert Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. 🍓 Weekend Berry Special!" 
                  value={bTitle}
                  onChange={e => setBTitle(e.target.value)}
                  required
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-1">Notification Category</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-xs font-semibold text-neutral-700 cursor-pointer">
                    <input 
                      type="radio" 
                      name="bType" 
                      checked={bType === 'offer'}
                      onChange={() => setBType('offer')}
                      className="text-emerald-600 focus:ring-emerald-500" 
                    />
                    Promo Offer Deals
                  </label>
                  <label className="flex items-center gap-2 text-xs font-semibold text-neutral-700 cursor-pointer">
                    <input 
                      type="radio" 
                      name="bType" 
                      checked={bType === 'general'}
                      onChange={() => setBType('general')}
                      className="text-emerald-600 focus:ring-emerald-500" 
                    />
                    General Announcement
                  </label>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-1">Alert Body Text</label>
                <textarea 
                  placeholder="e.g. Get 30% off on fresh organic strawberries and blueberries today only! Discount applied automatically at checkout." 
                  value={bBody}
                  onChange={e => setBBody(e.target.value)}
                  required
                  rows={4}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                />
              </div>

              <button 
                type="submit" 
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <Send size={16} />
                Send Broadcast Push Alert
              </button>
            </form>
          </div>
        )}

      </main>

      {/* Product ADD/EDIT Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-neutral-100 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-neutral-100 flex justify-between items-center bg-neutral-50">
              <h3 className="font-bold text-neutral-900 text-lg">
                {editingProduct ? 'Edit Grocery Product' : 'Add Fresh Product'}
              </h3>
              <button 
                onClick={() => setShowProductModal(false)}
                className="text-neutral-400 hover:text-neutral-600 p-1"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 overflow-y-auto space-y-4 flex-1 text-sm">
              <div>
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-1">Product Name</label>
                <input 
                  type="text" 
                  value={pName} 
                  onChange={e => setPName(e.target.value)}
                  placeholder="e.g. Honeycrisp Red Apples"
                  required
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-1">Category</label>
                  <select
                    value={pCategory}
                    onChange={e => setPCategory(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-1">Unit Weight/Size</label>
                  <input 
                    type="text" 
                    value={pUnit} 
                    onChange={e => setPUnit(e.target.value)}
                    placeholder="e.g. 500g Pack"
                    required
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-1">Price (Rs.)</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    value={pPrice || ''} 
                    onChange={e => setPPrice(Number(e.target.value))}
                    required
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-1">Discount Price (Rs.)</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    value={pDiscountPrice || ''} 
                    onChange={e => setPDiscountPrice(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="None"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-1">Stock Qty</label>
                  <input 
                    type="number" 
                    value={pStock} 
                    onChange={e => setPStock(Number(e.target.value))}
                    required
                    min="0"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-1">Unsplash/Direct Image URL</label>
                <input 
                  type="url" 
                  value={pImage} 
                  onChange={e => setPImage(e.target.value)}
                  placeholder="Paste premium image link..."
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-1">Product Description</label>
                <textarea 
                  value={pDescription} 
                  onChange={e => setPDescription(e.target.value)}
                  placeholder="Write nutritional value and organic detailed breakdown..."
                  rows={3}
                  required
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                />
              </div>

              <div className="border-t border-neutral-100 pt-4 flex gap-3 justify-end bg-neutral-50 -mx-6 -mb-6 p-6">
                <button 
                  type="button" 
                  onClick={() => setShowProductModal(false)}
                  className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold px-4 py-2.5 rounded-xl text-sm transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all shadow-md"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

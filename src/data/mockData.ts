import { Product, Category, Coupon, Order, Address, Notification } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: '1', name: 'Fruits', icon: 'Apple', slug: 'fruits' },
  { id: '2', name: 'Vegetables', icon: 'Salad', slug: 'vegetables' },
  { id: '3', name: 'Dairy & Eggs', icon: 'Milk', slug: 'dairy' },
  { id: '4', name: 'Beverages', icon: 'GlassWater', slug: 'beverages' },
  { id: '5', name: 'Snacks', icon: 'Cookie', slug: 'snacks' },
  { id: '6', name: 'Grocery Items', icon: 'ShoppingBag', slug: 'grocery' },
];

const RAW_PRODUCTS: Product[] = [
  // Fruits
  {
    id: 'f1',
    name: 'Organic Red Apples',
    category: 'Fruits',
    price: 4.99,
    discountPrice: 3.99,
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=600&auto=format&fit=crop&q=80'
    ],
    unit: '1 kg',
    description: 'Fresh, crisp and hand-picked organic red gala apples. Perfect for healthy snacking, making home-baked pies, or juicing. Rich in vitamins and dietary fiber, they offer a naturally sweet, delicious flavor.',
    rating: 4.8,
    reviewsCount: 34,
    reviews: [
      { id: 'r1', userName: 'John Doe', rating: 5, comment: 'Incredibly sweet and crisp! Highly recommend.', date: '2026-06-20' },
      { id: 'r2', userName: 'Sarah Connor', rating: 4, comment: 'Very fresh, though a couple of apples had minor bruises.', date: '2026-06-18' }
    ],
    isFeatured: true,
    isBestSeller: true,
    stock: 85
  },
  {
    id: 'f2',
    name: 'Fresh Cavendish Bananas',
    category: 'Fruits',
    price: 1.99,
    discountPrice: 1.49,
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1481349518771-20055b2a7b24?w=600&auto=format&fit=crop&q=80'
    ],
    unit: '1 bunch (approx. 5-6 pcs)',
    description: 'Sweet, creamy, and ripe bananas. Ideal source of potassium, vitamins B6 and C. Perfect for smoothies, cereal toppings, or as a convenient on-the-go snack.',
    rating: 4.6,
    reviewsCount: 42,
    reviews: [
      { id: 'r3', userName: 'Alex Mercer', rating: 5, comment: 'Just the right ripeness. Great taste!', date: '2026-06-21' }
    ],
    isFeatured: true,
    isBestSeller: false,
    stock: 120
  },
  {
    id: 'f3',
    name: 'Fresh Blueberries',
    category: 'Fruits',
    price: 3.99,
    image: 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=600&auto=format&fit=crop&q=80'],
    unit: '125g Pack',
    description: 'Plump and juicy blueberries bursting with antioxidant goodness. Great for pancakes, morning oats, or eating raw as a superfood snack.',
    rating: 4.9,
    reviewsCount: 19,
    reviews: [],
    isFeatured: false,
    isBestSeller: true,
    stock: 45
  },

  // Vegetables
  {
    id: 'v1',
    name: 'Fresh Green Broccoli',
    category: 'Vegetables',
    price: 2.49,
    discountPrice: 1.99,
    image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&auto=format&fit=crop&q=80'
    ],
    unit: '1 head (approx. 400g)',
    description: 'Fresh green broccoli crowns, nutrient-dense and packed with dietary fiber, vitamin C, K, and folate. Perfect for roasting, steaming, stir-fries, or healthy soups.',
    rating: 4.7,
    reviewsCount: 28,
    reviews: [
      { id: 'r4', userName: 'Emily Watson', rating: 5, comment: 'So clean and fresh. Perfect for my keto meals!', date: '2026-06-19' }
    ],
    isFeatured: true,
    isBestSeller: true,
    stock: 90
  },
  {
    id: 'v2',
    name: 'Organic Vine Tomatoes',
    category: 'Vegetables',
    price: 3.49,
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop&q=80'],
    unit: '500g Pack',
    description: 'Juicy, vine-ripened organic tomatoes with a rich red color and deep, sweet taste. Excellent for salads, sandwiches, pasta sauces, and fresh salsas.',
    rating: 4.5,
    reviewsCount: 15,
    reviews: [],
    isFeatured: false,
    isBestSeller: false,
    stock: 60
  },
  {
    id: 'v3',
    name: 'Sweet Orange Carrots',
    category: 'Vegetables',
    price: 1.79,
    discountPrice: 1.29,
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600&auto=format&fit=crop&q=80'],
    unit: '1 kg bag',
    description: 'Crisp, sweet, and rich-colored carrots packed with Beta-carotene. Perfect for eating raw, juicing, baking, or stews.',
    rating: 4.4,
    reviewsCount: 22,
    reviews: [],
    isFeatured: true,
    isBestSeller: false,
    stock: 110
  },

  // Dairy & Eggs
  {
    id: 'd1',
    name: 'Organic Whole Milk 3.5%',
    category: 'Dairy & Eggs',
    price: 2.99,
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80'],
    unit: '1 Gallon',
    description: 'Pure, fresh, pasteurized organic whole milk from pasture-raised cows. Rich in calcium and fortified with Vitamin D. No synthetic hormones or antibiotics.',
    rating: 4.8,
    reviewsCount: 47,
    reviews: [
      { id: 'r5', userName: 'David Villa', rating: 5, comment: 'Tastes so rich and pure. Definitely the best milk!', date: '2026-06-22' }
    ],
    isFeatured: true,
    isBestSeller: true,
    stock: 50
  },
  {
    id: 'd2',
    name: 'Premium Cheddar Cheese Block',
    category: 'Dairy & Eggs',
    price: 5.49,
    discountPrice: 4.49,
    image: 'https://images.unsplash.com/photo-1486299267070-83823f5448dd?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1486299267070-83823f5448dd?w=600&auto=format&fit=crop&q=80'],
    unit: '250g Block',
    description: 'Aged premium sharp cheddar cheese block. Naturally aged, deep rich flavor with smooth texture. Great for grating on dishes, cheese boards, or gourmet sandwiches.',
    rating: 4.7,
    reviewsCount: 31,
    reviews: [],
    isFeatured: false,
    isBestSeller: true,
    stock: 40
  },
  {
    id: 'd3',
    name: 'Free Range Large Brown Eggs',
    category: 'Dairy & Eggs',
    price: 3.89,
    image: 'https://images.unsplash.com/photo-1516448620398-c5f44bf9f441?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1516448620398-c5f44bf9f441?w=600&auto=format&fit=crop&q=80'],
    unit: '12 Pieces',
    description: 'Grade A large, brown, free-range chicken eggs. Laid by free-roaming hens fed a premium organic grain diet. Rich yolks and high protein.',
    rating: 4.9,
    reviewsCount: 65,
    reviews: [
      { id: 'r6', userName: 'Marie C.', rating: 5, comment: 'Bright golden yolks, absolutely delicious eggs.', date: '2026-06-23' }
    ],
    isFeatured: true,
    isBestSeller: true,
    stock: 75
  },

  // Beverages
  {
    id: 'b1',
    name: 'Premium Arabica Coffee Beans',
    category: 'Beverages',
    price: 12.99,
    discountPrice: 10.99,
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&auto=format&fit=crop&q=80'
    ],
    unit: '500g Bag',
    description: '100% Organic single-origin Arabica medium roast coffee beans. Rich chocolatey undertones, smooth body, and low acidity. Freshly packed to preserve aroma.',
    rating: 4.9,
    reviewsCount: 52,
    reviews: [],
    isFeatured: true,
    isBestSeller: true,
    stock: 35
  },
  {
    id: 'b2',
    name: 'Freshly Squeezed Orange Juice',
    category: 'Beverages',
    price: 4.49,
    image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=600&auto=format&fit=crop&q=80'],
    unit: '1 Litre Bottle',
    description: '100% natural cold-pressed orange juice with zero added sugars, preservatives, or concentrates. Packed with vitamin C, sweet and zesty taste.',
    rating: 4.6,
    reviewsCount: 18,
    reviews: [],
    isFeatured: false,
    isBestSeller: false,
    stock: 45
  },

  // Snacks
  {
    id: 's1',
    name: 'Artisanal Chocolate Chip Cookies',
    category: 'Snacks',
    price: 3.99,
    discountPrice: 2.99,
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600&auto=format&fit=crop&q=80'],
    unit: '200g Pack',
    description: 'Freshly baked artisanal cookies with gourmet dark Belgian chocolate chips and a touch of sea salt. Crisp edges with soft, chewy centers.',
    rating: 4.8,
    reviewsCount: 39,
    reviews: [],
    isFeatured: true,
    isBestSeller: true,
    stock: 60
  },
  {
    id: 's2',
    name: 'Roasted & Salted Almonds',
    category: 'Snacks',
    price: 6.99,
    image: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=600&auto=format&fit=crop&q=80'],
    unit: '250g pack',
    description: 'Premium whole California almonds, lightly dry roasted and tossed in sea salt. High in healthy fats, vitamin E, protein, and dietary fiber.',
    rating: 4.7,
    reviewsCount: 26,
    reviews: [],
    isFeatured: false,
    isBestSeller: false,
    stock: 80
  },

  // Grocery Items
  {
    id: 'g1',
    name: 'Extra Virgin Olive Oil',
    category: 'Grocery Items',
    price: 14.99,
    discountPrice: 12.49,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80'],
    unit: '750ml Bottle',
    description: 'Cold-extracted Greek extra virgin olive oil. Rich, peppery flavor profile with fruity undertones. Ideal for salad dressings, sauteing, drizzling over pasta or roasted vegetables.',
    rating: 4.9,
    reviewsCount: 44,
    reviews: [],
    isFeatured: true,
    isBestSeller: true,
    stock: 40
  },
  {
    id: 'g2',
    name: 'Organic Basmati Rice',
    category: 'Grocery Items',
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80'],
    unit: '2 kg bag',
    description: 'Premium aged organic long-grain basmati rice. Naturally fragrant, fluffiest and non-sticky long grain texture. Perfectly pairs with curries and gravies.',
    rating: 4.7,
    reviewsCount: 33,
    reviews: [],
    isFeatured: false,
    isBestSeller: false,
    stock: 70
  }
];

const RAW_COUPONS: Coupon[] = [
  {
    id: 'c1',
    code: 'FRESH20',
    discountType: 'percentage',
    discountValue: 20,
    minOrderAmount: 20.00,
    description: 'Get 20% off on order values above $20!',
    isActive: true,
    expiryDate: '2026-12-31'
  },
  {
    id: 'c2',
    code: 'WELCOME5',
    discountType: 'fixed',
    discountValue: 5,
    minOrderAmount: 15.00,
    description: 'Flat $5 off on order values above $15!',
    isActive: true,
    expiryDate: '2026-10-31'
  },
  {
    id: 'c3',
    code: 'SUPERGREEN',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 10.00,
    description: 'Celebrate our green theme with 10% off any order!',
    isActive: true,
    expiryDate: '2026-08-31'
  }
];

export const INITIAL_ADDRESSES: Address[] = [
  {
    id: 'add1',
    title: 'Home',
    name: 'Sarah Connor',
    phone: '+1 (555) 019-2834',
    street: '742 Evergreen Terrace',
    city: 'Springfield',
    state: 'IL',
    zipCode: '62704',
    isDefault: true
  },
  {
    id: 'add2',
    title: 'Office',
    name: 'Sarah Connor',
    phone: '+1 (555) 019-9988',
    street: '100 Cyberdyne Systems Blvd',
    city: 'Sunnyvale',
    state: 'CA',
    zipCode: '94089',
    isDefault: false
  }
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    title: '🌿 Welcome to My Store!',
    body: 'Thank you for choosing us! Explore our wide range of organic and fresh groceries. Use coupon code FRESH20 to get 20% off!',
    type: 'offer',
    createdAt: '2026-06-25T06:00:00Z',
    isRead: false
  },
  {
    id: 'n2',
    title: '🚀 Big Fruit Sale!',
    body: 'Fresh Red Apples and Cavendish Bananas are now at discounted prices. Stock up while supplies last!',
    type: 'offer',
    createdAt: '2026-06-24T12:30:00Z',
    isRead: true
  },
  {
    id: 'n3',
    title: '📦 Order Delivered Successfully',
    body: 'Your grocery order #MS-1082 has been delivered to 742 Evergreen Terrace Springfield.',
    type: 'delivery',
    createdAt: '2026-06-23T15:45:00Z',
    isRead: true
  }
];

const RAW_ORDERS: Order[] = [
  {
    id: 'ord1',
    orderNumber: 'MS-1082',
    items: [
      {
        productId: 'f1',
        productName: 'Organic Red Apples',
        image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80',
        price: 3.99,
        quantity: 2,
        unit: '1 kg'
      },
      {
        productId: 'd1',
        productName: 'Organic Whole Milk 3.5%',
        image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80',
        price: 2.99,
        quantity: 1,
        unit: '1 Gallon'
      },
      {
        productId: 'v1',
        productName: 'Fresh Green Broccoli',
        image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&auto=format&fit=crop&q=80',
        price: 1.99,
        quantity: 3,
        unit: '1 head (approx. 400g)'
      }
    ],
    subtotal: 16.94,
    tax: 1.35,
    deliveryCharge: 3.50,
    discount: 0,
    total: 21.79,
    address: INITIAL_ADDRESSES[0],
    paymentMethod: 'Stripe',
    paymentStatus: 'Paid',
    status: 'Delivered',
    deliveryDate: '2026-06-23',
    deliveryTimeSlot: '04:00 PM - 06:00 PM',
    createdAt: '2026-06-23T14:15:00Z',
    customerName: 'Sarah Connor',
    customerEmail: 'bintadam1000@gmail.com'
  },
  {
    id: 'ord2',
    orderNumber: 'MS-1094',
    items: [
      {
        productId: 'g1',
        productName: 'Extra Virgin Olive Oil',
        image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80',
        price: 12.49,
        quantity: 1,
        unit: '750ml Bottle'
      },
      {
        productId: 's1',
        productName: 'Artisanal Chocolate Chip Cookies',
        image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600&auto=format&fit=crop&q=80',
        price: 2.99,
        quantity: 2,
        unit: '200g Pack'
      }
    ],
    subtotal: 18.47,
    tax: 1.48,
    deliveryCharge: 0.00,
    discount: 3.69,
    couponApplied: 'FRESH20',
    total: 16.26,
    address: INITIAL_ADDRESSES[0],
    paymentMethod: 'COD',
    paymentStatus: 'Pending',
    status: 'Shipped',
    deliveryDate: '2026-06-25',
    deliveryTimeSlot: '09:00 AM - 12:00 PM',
    createdAt: '2026-06-24T18:30:00Z',
    customerName: 'Sarah Connor',
    customerEmail: 'bintadam1000@gmail.com'
  },
  {
    id: 'ord3',
    orderNumber: 'MS-1102',
    items: [
      {
        productId: 'b1',
        productName: 'Premium Arabica Coffee Beans',
        image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&auto=format&fit=crop&q=80',
        price: 10.99,
        quantity: 1,
        unit: '500g Bag'
      },
      {
        productId: 'd3',
        productName: 'Free Range Large Brown Eggs',
        image: 'https://images.unsplash.com/photo-1516448620398-c5f44bf9f441?w=600&auto=format&fit=crop&q=80',
        price: 3.89,
        quantity: 2,
        unit: '12 Pieces'
      }
    ],
    subtotal: 18.77,
    tax: 1.50,
    deliveryCharge: 3.50,
    discount: 0,
    total: 23.77,
    address: INITIAL_ADDRESSES[1],
    paymentMethod: 'Stripe',
    paymentStatus: 'Paid',
    status: 'Pending',
    deliveryDate: '2026-06-26',
    deliveryTimeSlot: '01:00 PM - 04:00 PM',
    createdAt: '2026-06-25T07:10:00Z',
    customerName: 'Sarah Connor',
    customerEmail: 'bintadam1000@gmail.com'
  }
];

const RAW_DICTIONARY = {
  en: {
    welcome: 'Welcome to My Store',
    searchPlaceholder: 'Search fresh fruits, milk, vegetables...',
    categories: 'Categories',
    featured: 'Featured Products',
    bestSelling: 'Best Sellers',
    addCart: 'Add to Cart',
    cart: 'Shopping Cart',
    subtotal: 'Subtotal',
    tax: 'Estimated Tax',
    delivery: 'Delivery Fee',
    discount: 'Discount',
    total: 'Total',
    checkout: 'Checkout',
    profile: 'My Profile',
    wishlist: 'My Wishlist',
    orders: 'My Orders',
    addresses: 'My Addresses',
    notifications: 'Notifications',
    support: 'Customer Support',
    settings: 'Settings',
    language: 'Language',
    darkMode: 'Dark Mode',
    applyCoupon: 'Apply Promo Code',
    couponPlaceholder: 'Enter code e.g., FRESH20',
    checkoutTitle: 'Complete Your Order',
    selectAddress: 'Select Delivery Address',
    deliverySchedule: 'Select Delivery Schedule',
    paymentMethod: 'Select Payment Method',
    placeOrder: 'Place Order',
    orderSuccess: 'Order Placed Successfully!',
    orderSuccessSub: 'Thank you for shopping! You can track your order status below.',
    orderNo: 'Order Number',
    status: 'Status',
    reorder: 'Reorder Now',
    cancelOrder: 'Cancel Order',
    adminPanel: 'Admin Panel',
    allProducts: 'All Products',
    allOrders: 'All Orders',
    analytics: 'Analytics',
    logout: 'Sign Out',
    emptyCart: 'Your cart is empty',
    emptyWish: 'Your wishlist is empty',
    freeDeliveryText: 'Add $15.00 more for FREE delivery!',
    contactSupport: 'Ask us anything! Our AI support is online.'
  },
  es: {
    welcome: 'Bienvenido a Mi Tienda',
    searchPlaceholder: 'Buscar frutas frescas, leche, verduras...',
    categories: 'Categorías',
    featured: 'Productos Destacados',
    bestSelling: 'Más Vendidos',
    addCart: 'Añadir al Carrito',
    cart: 'Carrito de Compras',
    subtotal: 'Subtotal',
    tax: 'Impuesto Estimado',
    delivery: 'Costo de Envío',
    discount: 'Descuento',
    total: 'Total',
    checkout: 'Pagar',
    profile: 'Mi Perfil',
    wishlist: 'Lista de Deseos',
    orders: 'Mis Pedidos',
    addresses: 'Mis Direcciones',
    notifications: 'Notificaciones',
    support: 'Soporte al Cliente',
    settings: 'Ajustes',
    language: 'Idioma',
    darkMode: 'Modo Oscuro',
    applyCoupon: 'Aplicar Cupón',
    couponPlaceholder: 'Ingresa código ej. FRESH20',
    checkoutTitle: 'Completar tu Pedido',
    selectAddress: 'Seleccionar Dirección de Envío',
    deliverySchedule: 'Programar Entrega',
    paymentMethod: 'Método de Pago',
    placeOrder: 'Confirmar Pedido',
    orderSuccess: '¡Pedido Realizado con Éxito!',
    orderSuccessSub: '¡Gracias por su compra! Puede seguir el estado de su pedido a continuación.',
    orderNo: 'Número de Pedido',
    status: 'Estado',
    reorder: 'Pedir de Nuevo',
    cancelOrder: 'Cancelar Pedido',
    adminPanel: 'Panel de Admin',
    allProducts: 'Todos los Productos',
    allOrders: 'Todos los Pedidos',
    analytics: 'Análisis',
    logout: 'Cerrar Sesión',
    emptyCart: 'Tu carrito está vacío',
    emptyWish: 'Tu lista de deseos está vacía',
    freeDeliveryText: '¡Agrega $15.00 más para envío GRATIS!',
    contactSupport: '¡Pregúntanos lo que sea! Nuestro soporte de IA está en línea.'
  },
  fr: {
    welcome: 'Bienvenue chez Mon Magasin',
    searchPlaceholder: 'Rechercher des fruits, du lait, des légumes...',
    categories: 'Catégories',
    featured: 'Produits Vedettes',
    bestSelling: 'Meilleures Ventes',
    addCart: 'Ajouter au Panier',
    cart: 'Panier',
    subtotal: 'Sous-total',
    tax: 'Taxe Estimée',
    delivery: 'Frais de Livraison',
    discount: 'Remise',
    total: 'Total',
    checkout: 'Passer la Commande',
    profile: 'Mon Profil',
    wishlist: 'Liste d’envies',
    orders: 'Mes Commandes',
    addresses: 'Mes Adresses',
    notifications: 'Notifications',
    support: 'Support Client',
    settings: 'Paramètres',
    language: 'Langue',
    darkMode: 'Mode Sombre',
    applyCoupon: 'Appliquer le Code Promo',
    couponPlaceholder: 'Entrez le code ex. FRESH20',
    checkoutTitle: 'Finaliser la Commande',
    selectAddress: 'Adresse de Livraison',
    deliverySchedule: 'Planifier la Livraison',
    paymentMethod: 'Mode de Paiement',
    placeOrder: 'Commander',
    orderSuccess: 'Commande Réussie !',
    orderSuccessSub: 'Merci pour votre achat ! Vous pouvez suivre votre commande ci-dessous.',
    orderNo: 'Numéro de Commande',
    status: 'Statut',
    reorder: 'Recommander',
    cancelOrder: 'Annuler la Commande',
    adminPanel: 'Admin Panel',
    allProducts: 'Tous les Produits',
    allOrders: 'Toutes les Commandes',
    analytics: 'Analyses',
    logout: 'Déconnexion',
    emptyCart: 'Votre panier est vide',
    emptyWish: 'Votre liste est vide',
    freeDeliveryText: 'Ajoutez $15.00 pour livraison GRATUITE !',
    contactSupport: 'Posez vos questions ! Notre support IA est en ligne.'
  },
  ar: {
    welcome: 'مرحباً بك في متجري',
    searchPlaceholder: 'ابحث عن فواكه طازجة، حليب، خضروات...',
    categories: 'الأقسام',
    featured: 'منتجات مميزة',
    bestSelling: 'الأكثر مبيعاً',
    addCart: 'أضف إلى السلة',
    cart: 'سلة التسوق',
    subtotal: 'المجموع الفرعي',
    tax: 'الضريبة المقدرة',
    delivery: 'رسوم التوصيل',
    discount: 'الخصم',
    total: 'الإجمالي',
    checkout: 'الدفع والطلب',
    profile: 'الملف الشخصي',
    wishlist: 'قائمة الأمنيات',
    orders: 'طلباتي',
    addresses: 'عناويني',
    notifications: 'الإشعارات',
    support: 'الدعم الفني',
    settings: 'الإعدادات',
    language: 'اللغة',
    darkMode: 'الوضع الداكن',
    applyCoupon: 'تطبيق رمز الخصم',
    couponPlaceholder: 'أدخل الرمز مثلاً FRESH20',
    checkoutTitle: 'إكمال الطلب',
    selectAddress: 'اختر عنوان التوصيل',
    deliverySchedule: 'جدولة وقت التوصيل',
    paymentMethod: 'طريقة الدفع',
    placeOrder: 'تأكيد الطلب',
    orderSuccess: 'تم تقديم الطلب بنجاح!',
    orderSuccessSub: 'شكراً لتسوقك معنا! يمكنك تتبع حالة طلبك أدناه.',
    orderNo: 'رقم الطلب',
    status: 'الحالة',
    reorder: 'إعادة طلب',
    cancelOrder: 'إلغاء الطلب',
    adminPanel: 'لوحة التحكم',
    allProducts: 'جميع المنتجات',
    allOrders: 'جميع الطلبات',
    analytics: 'التحليلات',
    logout: 'تسجيل الخروج',
    emptyCart: 'سلة التسوق فارغة',
    emptyWish: 'قائمة الأمنيات فارغة',
    freeDeliveryText: 'أضف بقيمة $15.00 للحصول على توصيل مجاني!',
    contactSupport: 'اسألنا عن أي شيء! الدعم الذكي متاح للتحدث.'
  },
  hi: {
    welcome: 'माई स्टोर में आपका स्वागत है',
    searchPlaceholder: 'ताजे फल, दूध, सब्जियां खोजें...',
    categories: 'श्रेणियां',
    featured: 'विशेष उत्पाद',
    bestSelling: 'सबसे अधिक बिकने वाले',
    addCart: 'कार्ट में जोड़ें',
    cart: 'शॉपिंग कार्ट',
    subtotal: 'उप-योग',
    tax: 'अनुमानित कर',
    delivery: 'डिलिवरी शुल्क',
    discount: 'छूट',
    total: 'कुल राशि',
    checkout: 'चेकआउट',
    profile: 'मेरी प्रोफ़ाइल',
    wishlist: 'मेरी विशलिस्ट',
    orders: 'मेरे ऑर्डर',
    addresses: 'मेरे पते',
    notifications: 'सूचनाएं',
    support: 'ग्राहक सहायता',
    settings: 'सेटिंग्स',
    language: 'भाषा',
    darkMode: 'डार्क मोड',
    applyCoupon: 'कूपन लागू करें',
    couponPlaceholder: 'कोड डालें जैसे FRESH20',
    checkoutTitle: 'ऑर्डर पूरा करें',
    selectAddress: 'डिलिवरी पता चुनें',
    deliverySchedule: 'डिलिवरी शेड्यूल चुनें',
    paymentMethod: 'भुगतान का प्रकार',
    placeOrder: 'ऑर्डर दें',
    orderSuccess: 'ऑर्डर सफलतापूर्वक सबमिट हुआ!',
    orderSuccessSub: 'खरीदारी के लिए धन्यवाद! आप नीचे अपने ऑर्डर को ट्रैक कर सकते हैं।',
    orderNo: 'ऑर्डर संख्या',
    status: 'स्थिति',
    reorder: 'फिर से ऑर्डर करें',
    cancelOrder: 'ऑर्डर रद्द करें',
    adminPanel: 'एडमिन पैनल',
    allProducts: 'सभी उत्पाद',
    allOrders: 'सभी ऑर्डर',
    analytics: 'विश्लेषण',
    logout: 'लॉग आउट',
    emptyCart: 'आपका कार्ट खाली है',
    emptyWish: 'आपकी विशलिस्ट खाली है',
    freeDeliveryText: 'मुफ़्त डिलवरी के लिए $15.00 का सामान और जोड़ें!',
    contactSupport: 'हमसे कुछ भी पूछें! हमारा एआई सपोर्ट ऑनलाइन है।'
  }
};

const CONVERSION_RATE = 250;

export const INITIAL_PRODUCTS: Product[] = RAW_PRODUCTS.map(p => ({
  ...p,
  price: Math.round(p.price * CONVERSION_RATE),
  discountPrice: p.discountPrice ? Math.round(p.discountPrice * CONVERSION_RATE) : undefined
}));

export const INITIAL_COUPONS: Coupon[] = RAW_COUPONS.map(c => ({
  ...c,
  discountValue: c.discountType === 'fixed' ? Math.round(c.discountValue * CONVERSION_RATE) : c.discountValue,
  minOrderAmount: Math.round(c.minOrderAmount * CONVERSION_RATE),
  description: c.description.replace(/\$(\d+)/g, (_, val) => `Rs. ${parseInt(val) * CONVERSION_RATE}`)
}));

export const INITIAL_ORDERS: Order[] = RAW_ORDERS.map(o => ({
  ...o,
  subtotal: Math.round(o.subtotal * CONVERSION_RATE),
  tax: Math.round(o.tax * CONVERSION_RATE),
  deliveryCharge: Math.round(o.deliveryCharge * CONVERSION_RATE),
  discount: Math.round(o.discount * CONVERSION_RATE),
  total: Math.round(o.total * CONVERSION_RATE),
  items: o.items.map(it => ({
    ...it,
    price: Math.round(it.price * CONVERSION_RATE)
  }))
}));

// Function to format dictionary values
const formatDictionaryText = (text: string): string => {
  return text.replace(/\$15\.00/g, 'Rs. 3,750').replace(/\$20\.00/g, 'Rs. 5,000');
};

export const DICTIONARY = Object.keys(RAW_DICTIONARY).reduce((acc, langKey) => {
  const langData = RAW_DICTIONARY[langKey as keyof typeof RAW_DICTIONARY];
  const formattedData = Object.keys(langData).reduce((itemAcc, itemKey) => {
    const originalText = langData[itemKey as keyof typeof langData];
    itemAcc[itemKey] = formatDictionaryText(originalText);
    return itemAcc;
  }, {} as any);
  acc[langKey] = formattedData;
  return acc;
}, {} as any);

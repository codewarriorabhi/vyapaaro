export interface Shop {
  id: string;
  name: string;
  category: string;
  image: string;
  rating: number;
  reviewCount: number;
  distance: string;
  address: string;
  isOpen: boolean;
  tags: string[];
  phone?: string;
  whatsapp?: string;
  workingHours?: string;
  description?: string;
}

export interface Product {
  id: string;
  shopId: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;
  inStock: boolean;
  rating: number;
  reviewCount: number;
  description?: string;
  specifications?: Record<string, string>;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  count: number;
}

export interface Review {
  id: string;
  userName: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
}

export const categories: Category[] = [
  { id: "clothing", name: "Clothing", icon: "👕", color: "bg-primary/10", count: 156 },
  { id: "food", name: "Food & Dining", icon: "🍛", color: "bg-accent/10", count: 243 },
  { id: "electronics", name: "Electronics", icon: "📱", color: "bg-primary/10", count: 89 },
  { id: "furniture", name: "Furniture", icon: "🪑", color: "bg-accent/10", count: 67 },
  { id: "repair", name: "Repair Services", icon: "🔧", color: "bg-primary/10", count: 112 },
  { id: "grocery", name: "Grocery", icon: "🥬", color: "bg-accent/10", count: 198 },
  { id: "auto", name: "Auto Parts", icon: "🚗", color: "bg-primary/10", count: 45 },
  { id: "beauty", name: "Beauty & Salon", icon: "💇", color: "bg-accent/10", count: 134 },
];

export const shops: Shop[] = [
  {
    id: "1",
    name: "Sharma Textiles",
    category: "clothing",
    image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400&h=300&fit=crop",
    rating: 4.5,
    reviewCount: 128,
    distance: "0.5 km",
    address: "Shop 12, Main Market, Sector 22",
    isOpen: true,
    tags: ["Ethnic Wear", "Sarees", "Suits"],
    phone: "+91 98765 43210",
    whatsapp: "+919876543210",
    workingHours: "10:00 AM - 9:00 PM",
    description: "Premium ethnic wear collection with the finest fabrics from across India. Serving customers for over 25 years.",
  },
  {
    id: "2",
    name: "Gupta Electronics",
    category: "electronics",
    image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=400&h=300&fit=crop",
    rating: 4.2,
    reviewCount: 89,
    distance: "1.2 km",
    address: "45, Electronics Market, Nehru Place",
    isOpen: true,
    tags: ["Mobiles", "Laptops", "Accessories"],
    phone: "+91 98765 11111",
    whatsapp: "+919876511111",
    workingHours: "10:30 AM - 8:30 PM",
    description: "Your one-stop shop for all electronics needs. Authorized dealer for major brands.",
  },
  {
    id: "3",
    name: "Annapurna Restaurant",
    category: "food",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop",
    rating: 4.7,
    reviewCount: 312,
    distance: "0.3 km",
    address: "Near City Center, MG Road",
    isOpen: true,
    tags: ["North Indian", "Chinese", "Thali"],
    phone: "+91 98765 22222",
    whatsapp: "+919876522222",
    workingHours: "11:00 AM - 11:00 PM",
    description: "Authentic North Indian cuisine with a modern twist. Famous for our special Thali.",
  },
  {
    id: "4",
    name: "Royal Furniture House",
    category: "furniture",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop",
    rating: 4.3,
    reviewCount: 56,
    distance: "2.1 km",
    address: "Furniture Lane, Industrial Area",
    isOpen: false,
    tags: ["Sofa", "Beds", "Office Furniture"],
    phone: "+91 98765 33333",
    whatsapp: "+919876533333",
    workingHours: "10:00 AM - 7:00 PM",
    description: "Handcrafted furniture made with premium wood. Custom orders welcome.",
  },
  {
    id: "5",
    name: "Quick Fix Repairs",
    category: "repair",
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop",
    rating: 4.1,
    reviewCount: 201,
    distance: "0.8 km",
    address: "Service Center, Lajpat Nagar",
    isOpen: true,
    tags: ["Mobile Repair", "Laptop Repair", "TV Repair"],
    phone: "+91 98765 44444",
    whatsapp: "+919876544444",
    workingHours: "9:00 AM - 8:00 PM",
    description: "Expert repair services for all electronic devices. Same-day service available.",
  },
  {
    id: "6",
    name: "Fresh Mart Grocery",
    category: "grocery",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop",
    rating: 4.4,
    reviewCount: 167,
    distance: "0.2 km",
    address: "Corner Shop, Green Park",
    isOpen: true,
    tags: ["Vegetables", "Fruits", "Daily Essentials"],
    phone: "+91 98765 55555",
    whatsapp: "+919876555555",
    workingHours: "7:00 AM - 10:00 PM",
    description: "Fresh produce delivered daily. Best prices in the neighborhood.",
  },
];

export const products: Product[] = [
  {
    id: "p1",
    shopId: "1",
    name: "Banarasi Silk Saree",
    price: 3499,
    originalPrice: 5999,
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&h=800&fit=crop",
    ],
    category: "clothing",
    inStock: true,
    rating: 4.6,
    reviewCount: 42,
    description: "Beautiful Banarasi silk saree with intricate gold zari work. Perfect for weddings and festive occasions.",
    specifications: { "Fabric": "Pure Silk", "Length": "6.3 meters", "Blouse": "Included", "Wash Care": "Dry Clean Only" },
  },
  {
    id: "p2",
    shopId: "2",
    name: "Wireless Earbuds Pro",
    price: 1299,
    originalPrice: 2499,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=400&h=400&fit=crop",
    category: "electronics",
    inStock: true,
    rating: 4.3,
    reviewCount: 89,
    description: "Premium wireless earbuds with active noise cancellation and 24-hour battery life.",
    specifications: { "Battery": "24 hours", "Connectivity": "Bluetooth 5.3", "Water Resistance": "IPX5" },
  },
  {
    id: "p3",
    shopId: "3",
    name: "Special Thali",
    price: 249,
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=400&fit=crop",
    category: "food",
    inStock: true,
    rating: 4.8,
    reviewCount: 156,
    description: "Complete meal with 4 curries, dal, rice, 4 rotis, raita, salad, and dessert.",
  },
  {
    id: "p4",
    shopId: "1",
    name: "Cotton Kurta Set",
    price: 1299,
    originalPrice: 1899,
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=400&fit=crop",
    category: "clothing",
    inStock: true,
    rating: 4.4,
    reviewCount: 67,
    description: "Comfortable cotton kurta with palazzo set. Available in multiple colors.",
  },
  {
    id: "p5",
    shopId: "4",
    name: "L-Shape Sofa Set",
    price: 24999,
    originalPrice: 35000,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop",
    category: "furniture",
    inStock: true,
    rating: 4.5,
    reviewCount: 23,
    description: "Premium fabric L-shape sofa with 5-year warranty. Fits perfectly in modern living rooms.",
    specifications: { "Material": "Premium Fabric", "Seating": "6 persons", "Warranty": "5 years" },
  },
  {
    id: "p6",
    shopId: "6",
    name: "Organic Vegetable Basket",
    price: 399,
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=400&fit=crop",
    category: "grocery",
    inStock: true,
    rating: 4.6,
    reviewCount: 89,
    description: "Assorted organic vegetables basket - 5kg. Farm fresh, pesticide-free.",
  },
];

export const reviews: Review[] = [
  { id: "r1", userName: "Priya S.", avatar: "PS", rating: 5, comment: "Amazing quality sarees! Best collection in the area.", date: "2 days ago" },
  { id: "r2", userName: "Rahul K.", avatar: "RK", rating: 4, comment: "Good service and reasonable prices. Will visit again.", date: "1 week ago" },
  { id: "r3", userName: "Anita M.", avatar: "AM", rating: 5, comment: "Love the variety! Staff is very helpful and patient.", date: "2 weeks ago" },
  { id: "r4", userName: "Vikram P.", avatar: "VP", rating: 4, comment: "Decent products but parking is an issue.", date: "3 weeks ago" },
];

import React, { useState, useEffect } from 'react';
import { 
  Product, 
  CartItem, 
  KitchenOrder, 
  FleetVan, 
  PantryItem, 
  BespokeInquiry,
  BespokeCakeConfig,
  UserProfile
} from './types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_KITCHEN_ORDERS, 
  INITIAL_FLEET_VANS, 
  INITIAL_PANTRY_ITEMS, 
  INITIAL_BESPOKE_INQUIRIES 
} from './data/bakeryData';

import { 
  fetchProducts, 
  fetchOrders, 
  fetchFleetVans, 
  fetchPantryItems, 
  fetchBespokeInquiries, 
  createOrder, 
  createBespokeInquiry,
  getCurrentUserProfile,
  subscribeToOrders 
} from './services/supabaseService';
import { isSupabaseConfigured } from './lib/supabase';

import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { HeroBanner } from './components/storefront/HeroBanner';
import { ProductCatalog } from './components/storefront/ProductCatalog';
import { ProductDetailModal } from './components/storefront/ProductDetailModal';
import { CustomCakeBuilder } from './components/storefront/CustomCakeBuilder';
import { TastingSalonBooking } from './components/storefront/TastingSalonBooking';
import { StoryAndSourcing } from './components/storefront/StoryAndSourcing';
import { CartDrawer } from './components/storefront/CartDrawer';
import { KitchenOpsConsole } from './components/kitchen/KitchenOpsConsole';
import { AuthModal } from './components/common/AuthModal';
import { SupabaseStatusModal } from './components/common/SupabaseStatusModal';

export default function App() {
  const [currentView, setCurrentView] = useState<'storefront' | 'kitchen-ops'>('storefront');
  const [activeNavTab, setActiveNavTab] = useState<string>('menu');
  
  // User Authentication State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);

  // Storefront Data State
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [egglessOnly, setEgglessOnly] = useState(false);

  // Cart State (Initialized with 1 sample item)
  const [cart, setCart] = useState<CartItem[]>([
    {
      id: 'initial-cart-item-1',
      productId: 'prod-1',
      name: 'Grand Cru Valrhona Truffle Cake',
      price: 1850,
      size: '1 kg (Standard)',
      isEggless: true,
      plaqueInscription: 'Joyeux Anniversaire Sophie ✨',
      dispatchSlot: 'Today 2:00 PM - 4:00 PM Chilled Fleet',
      quantity: 1,
      imageType: 'valrhona-truffle',
    }
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Kitchen Ops Data State
  const [orders, setOrders] = useState<KitchenOrder[]>(INITIAL_KITCHEN_ORDERS);
  const [fleetVans, setFleetVans] = useState<FleetVan[]>(INITIAL_FLEET_VANS);
  const [pantryItems, setPantryItems] = useState<PantryItem[]>(INITIAL_PANTRY_ITEMS);
  const [bespokeInquiries, setBespokeInquiries] = useState<BespokeInquiry[]>(INITIAL_BESPOKE_INQUIRIES);

  // ==========================================================================
  // INITIAL DATA SYNC WITH SUPABASE
  // ==========================================================================
  const loadSupabaseData = async () => {
    try {
      const [prods, ords, vans, pantry, inqs, profile] = await Promise.all([
        fetchProducts(),
        fetchOrders(),
        fetchFleetVans(),
        fetchPantryItems(),
        fetchBespokeInquiries(),
        getCurrentUserProfile(),
      ]);

      if (prods && prods.length > 0) setProducts(prods);
      if (ords && ords.length > 0) setOrders(ords);
      if (vans && vans.length > 0) setFleetVans(vans);
      if (pantry && pantry.length > 0) setPantryItems(pantry);
      if (inqs && inqs.length > 0) setBespokeInquiries(inqs);
      if (profile) setCurrentUser(profile);
    } catch (e) {
      console.warn('Initial data load fallback to local seeds:', e);
    }
  };

  useEffect(() => {
    loadSupabaseData();

    // Subscribe to Supabase Realtime updates on orders
    const unsubscribe = subscribeToOrders((payload) => {
      if (payload.eventType === 'INSERT') {
        const newOrd = payload.new;
        setOrders((prev) => [
          {
            id: newOrd.id,
            time: 'Just now',
            tag: newOrd.tag,
            customerName: newOrd.customer_name,
            customerPhone: newOrd.customer_phone,
            customerNotes: newOrd.customer_notes,
            vipStatus: newOrd.vip_status,
            confectionName: newOrd.confection_name,
            confectionSpecs: newOrd.confection_specs || [],
            netWeight: newOrd.net_weight,
            internalDowels: newOrd.internal_dowels,
            plaqueInscription: newOrd.plaque_inscription,
            slotTime: newOrd.slot_time,
            destination: newOrd.destination,
            assignedVan: newOrd.assigned_van,
            driverName: newOrd.driver_name,
            stage: newOrd.stage,
            stageNote: newOrd.stage_note,
          },
          ...prev.filter((o) => o.id !== newOrd.id),
        ]);
      } else if (payload.eventType === 'UPDATE') {
        const updated = payload.new;
        setOrders((prev) =>
          prev.map((o) =>
            o.id === updated.id
              ? {
                  ...o,
                  stage: updated.stage,
                  stageNote: updated.stage_note,
                }
              : o
          )
        );
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Cart handlers
  const handleAddToCart = (item: Omit<CartItem, 'id'>) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (ci) => ci.productId === item.productId && ci.size === item.size && ci.plaqueInscription === item.plaqueInscription
      );
      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx].quantity += item.quantity;
        return next;
      }
      return [...prev, { ...item, id: `cart-${Date.now()}-${Math.random()}` }];
    });
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // Checkout Handler: Synchronizes directly to Supabase & Kitchen Ops!
  const handleCheckout = async (details: {
    customerName: string;
    customerPhone: string;
    destination: string;
    slotTime: string;
    customerNotes: string;
  }) => {
    const newKitchenOrders: KitchenOrder[] = cart.map((item) => ({
      id: `ORD-${Math.floor(8950 + Math.random() * 80)}`,
      time: 'Just now',
      tag: currentUser ? 'Verified Patron' : 'Storefront Direct',
      customerName: details.customerName,
      customerPhone: details.customerPhone,
      customerNotes: details.customerNotes,
      confectionName: item.name,
      confectionSpecs: [item.size, item.isEggless ? '100% Eggless' : 'French Standard Butter'],
      netWeight: item.size,
      plaqueInscription: item.plaqueInscription || 'Plaque Unspecified',
      slotTime: details.slotTime,
      destination: details.destination,
      assignedVan: 'Chilled Van #01 (KA 01 EK 4410)',
      driverName: 'Ramesh K.',
      stage: 'deck-baking',
      stageNote: 'Hearth allocation scheduled for immediate bake wave.',
    }));

    // Update local state
    setOrders((prev) => [...newKitchenOrders, ...prev]);
    setCart([]);

    // Insert orders into Supabase database
    for (const order of newKitchenOrders) {
      await createOrder(order, 1850);
    }
  };

  // Bespoke Commission handler: Synchronizes to Supabase & Kitchen Ops
  const handleCommissionToKitchen = async (config: BespokeCakeConfig) => {
    const orderId = `ORD-BESP-${Math.floor(100 + Math.random() * 900)}`;
    const inquiryId = `BESP-2026-${Math.floor(110 + Math.random() * 800)}`;
    const basePrice = config.tierSize === '1-tier' ? 3200 : config.tierSize === '2-tier' ? 7800 : 16500;
    const totalPrice = basePrice + config.finishPrice + (config.fulfillmentMethod === 'chilled-van' ? 550 : 0);

    const bespokeOrder: KitchenOrder = {
      id: orderId,
      time: 'Just now',
      tag: 'Bespoke Commission',
      customerName: currentUser?.fullName || 'Bespoke Client',
      customerPhone: currentUser?.phone || '+91 98450 00000',
      customerNotes: config.customNotes,
      vipStatus: 'Haute Bespoke',
      confectionName: `Architectural ${config.tierSize.toUpperCase()} (${config.occasion})`,
      confectionSpecs: [
        config.tierLabel,
        config.spongeFlavor,
        config.fillingFlavor,
        config.exteriorFinish,
        config.dietary === 'eggless' ? 'Eggless Formulation' : 'French Classic'
      ],
      netWeight: config.tierSize === '1-tier' ? '1.2 kg' : config.tierSize === '2-tier' ? '3.5 kg' : '7.5 kg',
      internalDowels: true,
      plaqueInscription: config.plaqueMessage || 'Special Commission',
      slotTime: `${config.deliveryDate} (Chilled Transport)`,
      destination: 'Client Venue, Bengaluru',
      assignedVan: 'Chilled Van #03 (KA 03 ML 9120)',
      driverName: 'Anand V.',
      stage: 'deck-baking',
      stageNote: 'Master decorator assigned; internal dowels queued.'
    };

    const newInquiry: BespokeInquiry = {
      id: inquiryId,
      clientName: currentUser?.fullName || 'Bespoke Client',
      clientPhone: currentUser?.phone || '+91 98450 00000',
      clientEmail: currentUser?.email || 'patron@kananatelier.in',
      submittedTime: 'Just now',
      status: 'chef-pricing',
      eventType: config.occasion,
      eventDate: config.deliveryDate,
      guestScale: config.tierSize === '1-tier' ? '10-14 Guests' : config.tierSize === '2-tier' ? '28-35 Guests' : '75-90 Guests',
      dietaryStandard: config.dietary === 'eggless' ? 'Strictly 100% Eggless' : 'French Classic Butter & Egg',
      exteriorFinish: config.exteriorFinish,
      tierArchitecture: [
        { tier: 'Primary Base', description: `${config.spongeFlavor} with ${config.fillingFlavor}`, weight: bespokeOrder.netWeight || '3.5 kg' }
      ],
      moodboardImages: ['lambeth-ivory', 'gold-leaf-piping'],
      quoteTariff: {
        baseStructure: basePrice,
        sugarwork: config.finishPrice,
        goldLeafing: 1200,
        refrigeratedLogistics: config.fulfillmentMethod === 'chilled-van' ? 550 : 0,
        recommendedTotal: totalPrice,
      }
    };

    setOrders((prev) => [bespokeOrder, ...prev]);
    setBespokeInquiries((prev) => [newInquiry, ...prev]);

    // Save to Supabase
    await createOrder(bespokeOrder, totalPrice);
    await createBespokeInquiry(newInquiry);
  };

  return (
    <div className="min-h-screen bg-[#140807] text-[#f7efe6] selection:bg-amber-600 selection:text-white font-sans antialiased">
      {/* Global Navigation Bar */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        activeNavTab={activeNavTab}
        setActiveNavTab={setActiveNavTab}
        cart={cart}
        setIsCartOpen={setIsCartOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        egglessOnly={egglessOnly}
        setEgglessOnly={setEgglessOnly}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
      />

      {/* View Switcher: Patron Boutique vs Kitchen Ops Console */}
      {currentView === 'kitchen-ops' ? (
        <KitchenOpsConsole
          orders={orders}
          setOrders={setOrders}
          fleetVans={fleetVans}
          setFleetVans={setFleetVans}
          pantryItems={pantryItems}
          setPantryItems={setPantryItems}
          bespokeInquiries={bespokeInquiries}
          setBespokeInquiries={setBespokeInquiries}
          onSwitchToBoutique={() => setCurrentView('storefront')}
        />
      ) : (
        <main>
          {/* Hero Banner with Quick Actions */}
          <HeroBanner
            onExploreMenu={() => {
              setActiveNavTab('menu');
              const el = document.getElementById('confection-menu');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            onBespokeCommission={() => {
              setActiveNavTab('custom-builder');
              const el = document.getElementById('custom-builder');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            onBookTasting={() => {
              setActiveNavTab('tasting-salon');
              const el = document.getElementById('tasting-salon');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
          />

          {/* Product Catalog */}
          <ProductCatalog
            products={products}
            onAddToCart={handleAddToCart}
            onOpenProductDetail={(prod) => setSelectedProduct(prod)}
            searchQuery={searchQuery}
            egglessOnly={egglessOnly}
            setEgglessOnly={setEgglessOnly}
          />

          {/* Bespoke Cake Builder */}
          <CustomCakeBuilder
            onAddToCart={handleAddToCart}
            onCommissionToKitchen={handleCommissionToKitchen}
          />

          {/* Tasting Salon Booking */}
          <TastingSalonBooking />

          {/* Story & Provenance Matrix */}
          <StoryAndSourcing />
        </main>
      )}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* User Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        onSwitchToKitchenOps={() => setCurrentView('kitchen-ops')}
      />

      {/* Supabase Connection Status & SQL Schema Modal */}
      <SupabaseStatusModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        onReloadData={loadSupabaseData}
      />

      {/* Global Footer */}
      <Footer />
    </div>
  );
}

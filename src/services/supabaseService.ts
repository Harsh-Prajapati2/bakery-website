import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { 
  Product, 
  KitchenOrder, 
  FleetVan, 
  PantryItem, 
  BespokeInquiry,
  UserProfile,
  TastingReservation 
} from '../types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_KITCHEN_ORDERS, 
  INITIAL_FLEET_VANS, 
  INITIAL_PANTRY_ITEMS, 
  INITIAL_BESPOKE_INQUIRIES 
} from '../data/bakeryData';

// ============================================================================
// AUTHENTICATION SERVICES
// ============================================================================

export async function signUpUser(
  email: string, 
  password: string, 
  fullName: string, 
  role: 'patron' | 'pastry_chef' = 'patron'
): Promise<{ user: UserProfile | null; error?: string }> {
  if (!isSupabaseConfigured || !supabase) {
    // Demo Mock User
    const mockUser: UserProfile = {
      id: `mock-${Date.now()}`,
      email,
      fullName,
      role,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem('kanan_demo_user', JSON.stringify(mockUser));
    return { user: mockUser };
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role,
        }
      }
    });

    if (error) return { user: null, error: error.message };

    if (data.user) {
      const profile: UserProfile = {
        id: data.user.id,
        email: data.user.email || email,
        fullName: fullName || data.user.user_metadata?.full_name || 'Patron',
        role,
      };
      return { user: profile };
    }

    return { user: null, error: 'Registration pending verification' };
  } catch (err: any) {
    return { user: null, error: err.message || 'Signup failed' };
  }
}

export async function signInUser(
  email: string, 
  password: string
): Promise<{ user: UserProfile | null; error?: string }> {
  if (!isSupabaseConfigured || !supabase) {
    // Check if test credentials
    const isChef = email.toLowerCase().includes('chef') || email.toLowerCase().includes('kitchen');
    const mockUser: UserProfile = {
      id: `mock-${Date.now()}`,
      email,
      fullName: isChef ? 'Chef Jean-Luc (Head Decorator)' : email.split('@')[0],
      role: isChef ? 'pastry_chef' : 'patron',
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem('kanan_demo_user', JSON.stringify(mockUser));
    return { user: mockUser };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return { user: null, error: error.message };
    if (!data.user) return { user: null, error: 'User not found' };

    // Fetch user profile from public.profiles table
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    const profile: UserProfile = {
      id: data.user.id,
      email: data.user.email || email,
      fullName: profileData?.full_name || data.user.user_metadata?.full_name || 'Atelier Patron',
      role: profileData?.role || data.user.user_metadata?.role || 'patron',
    };

    return { user: profile };
  } catch (err: any) {
    return { user: null, error: err.message || 'Sign in error' };
  }
}

export async function signOutUser(): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    await supabase.auth.signOut();
  }
  localStorage.removeItem('kanan_demo_user');
}

export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  if (!isSupabaseConfigured || !supabase) {
    const stored = localStorage.getItem('kanan_demo_user');
    return stored ? JSON.parse(stored) : null;
  }

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    return {
      id: user.id,
      email: user.email || '',
      fullName: profile?.full_name || user.user_metadata?.full_name || 'Patron',
      role: profile?.role || user.user_metadata?.role || 'patron',
      phone: profile?.phone,
    };
  } catch (e) {
    return null;
  }
}

// ============================================================================
// CONFECTION PRODUCTS (CATALOG CRUD)
// ============================================================================

export async function fetchProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured || !supabase) {
    return INITIAL_PRODUCTS;
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('price', { ascending: false });

    if (error || !data || data.length === 0) {
      console.warn('Supabase products empty or error, utilizing initial bakery data:', error);
      return INITIAL_PRODUCTS;
    }

    return data.map((row: any) => ({
      id: row.id,
      sku: row.sku,
      name: row.name,
      category: row.category,
      categoryLabel: row.category_label,
      price: row.price,
      originalPrice: row.original_price,
      rating: Number(row.rating),
      reviewCount: row.review_count,
      weight: row.weight,
      servings: row.servings,
      badge: row.badge,
      isEggless: row.is_eggless,
      isGlutenFree: row.is_gluten_free,
      isNutFree: row.is_nut_free,
      hasFrenchButter: row.has_french_butter,
      occasion: row.occasion,
      description: row.description,
      leadTime: row.lead_time,
      imageType: row.image_type,
      inStock: row.in_stock,
      batchCapacity: row.batch_capacity,
      batchBooked: row.batch_booked,
      ingredients: row.ingredients || [],
    }));
  } catch (e) {
    console.error('Failed to fetch products from Supabase:', e);
    return INITIAL_PRODUCTS;
  }
}

// ============================================================================
// ORDERS & ACTIVE HEARTH PIPELINE (CRUD & REALTIME)
// ============================================================================

export async function fetchOrders(): Promise<KitchenOrder[]> {
  if (!isSupabaseConfigured || !supabase) {
    return INITIAL_KITCHEN_ORDERS;
  }

  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return INITIAL_KITCHEN_ORDERS;
    }

    return data.map((row: any) => ({
      id: row.id,
      time: new Date(row.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      tag: row.tag,
      customerName: row.customer_name,
      customerPhone: row.customer_phone,
      customerNotes: row.customer_notes,
      vipStatus: row.vip_status,
      confectionName: row.confection_name,
      confectionSpecs: row.confection_specs || [],
      netWeight: row.net_weight,
      internalDowels: row.internal_dowels,
      plaqueInscription: row.plaque_inscription,
      slotTime: row.slot_time,
      destination: row.destination,
      assignedVan: row.assigned_van,
      driverName: row.driver_name,
      stage: row.stage,
      stageNote: row.stage_note,
    }));
  } catch (err) {
    console.error('Fetch orders failed:', err);
    return INITIAL_KITCHEN_ORDERS;
  }
}

export async function createOrder(order: KitchenOrder, totalPrice: number = 0): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured || !supabase) {
    return { success: true };
  }

  try {
    const { error } = await supabase
      .from('orders')
      .insert({
        id: order.id,
        customer_name: order.customerName,
        customer_phone: order.customerPhone,
        customer_notes: order.customerNotes,
        vip_status: order.vipStatus,
        tag: order.tag || 'Online Storefront',
        confection_name: order.confectionName,
        confection_specs: order.confectionSpecs,
        net_weight: order.netWeight || '1 kg',
        internal_dowels: order.internalDowels || false,
        plaque_inscription: order.plaqueInscription,
        slot_time: order.slotTime,
        destination: order.destination,
        assigned_van: order.assignedVan,
        driver_name: order.driverName,
        stage: order.stage,
        stage_note: order.stageNote,
        total_price: totalPrice,
      });

    if (error) {
      console.error('Supabase create order error:', error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function updateOrderStage(
  orderId: string, 
  stage: KitchenOrder['stage'], 
  stageNote?: string
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured || !supabase) {
    return { success: true };
  }

  try {
    const { error } = await supabase
      .from('orders')
      .update({
        stage,
        stage_note: stageNote,
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export function subscribeToOrders(onUpdate: (updatedOrder: any) => void) {
  if (!isSupabaseConfigured || !supabase) return () => {};

  const channel = supabase
    .channel('realtime:orders')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'orders' },
      (payload) => {
        onUpdate(payload);
      }
    )
    .subscribe();

  return () => {
    supabase?.removeChannel(channel);
  };
}

// ============================================================================
// COLD-FLEET TELEMETRY (CRUD & REALTIME)
// ============================================================================

export async function fetchFleetVans(): Promise<FleetVan[]> {
  if (!isSupabaseConfigured || !supabase) {
    return INITIAL_FLEET_VANS;
  }

  try {
    const { data, error } = await supabase
      .from('fleet_vans')
      .select('*')
      .order('id', { ascending: true });

    if (error || !data || data.length === 0) return INITIAL_FLEET_VANS;

    return data.map((row: any) => ({
      id: row.id,
      number: row.number,
      driverName: row.driver_name,
      driverPhone: row.driver_phone,
      status: row.status,
      specialty: row.specialty,
      temperature: Number(row.temperature),
      humidity: row.humidity,
      speed: row.speed,
      vibrationStatus: row.vibration_status,
      currentLocation: row.current_location,
      eta: row.eta,
      orderPayload: row.order_payload,
      percentCompleted: row.percent_completed,
    }));
  } catch (err) {
    return INITIAL_FLEET_VANS;
  }
}

// ============================================================================
// RAW PANTRY INVENTORY
// ============================================================================

export async function fetchPantryItems(): Promise<PantryItem[]> {
  if (!isSupabaseConfigured || !supabase) {
    return INITIAL_PANTRY_ITEMS;
  }

  try {
    const { data, error } = await supabase
      .from('pantry_items')
      .select('*');

    if (error || !data || data.length === 0) return INITIAL_PANTRY_ITEMS;

    return data.map((row: any) => ({
      name: row.name,
      stock: row.stock,
      threshold: row.threshold,
      status: row.status,
    }));
  } catch (err) {
    return INITIAL_PANTRY_ITEMS;
  }
}

export async function updatePantryItemStatus(name: string, status: PantryItem['status']): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;

  try {
    await supabase
      .from('pantry_items')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('name', name);
  } catch (e) {
    console.error('Failed to update pantry status:', e);
  }
}

// ============================================================================
// BESPOKE TIER INQUIRIES & WEDDING COMMISSIONS
// ============================================================================

export async function fetchBespokeInquiries(): Promise<BespokeInquiry[]> {
  if (!isSupabaseConfigured || !supabase) {
    return INITIAL_BESPOKE_INQUIRIES;
  }

  try {
    const { data, error } = await supabase
      .from('bespoke_inquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) return INITIAL_BESPOKE_INQUIRIES;

    return data.map((row: any) => ({
      id: row.id,
      clientName: row.client_name,
      clientPhone: row.client_phone,
      clientEmail: row.client_email,
      submittedTime: row.submitted_time,
      status: row.status,
      eventType: row.event_type,
      eventDate: row.event_date,
      guestScale: row.guest_scale,
      dietaryStandard: row.dietary_standard,
      exteriorFinish: row.exterior_finish,
      tierArchitecture: row.tier_architecture || [],
      moodboardImages: row.moodboard_images || [],
      quoteTariff: row.quote_tariff || {},
    }));
  } catch (err) {
    return INITIAL_BESPOKE_INQUIRIES;
  }
}

export async function createBespokeInquiry(inquiry: BespokeInquiry): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured || !supabase) return { success: true };

  try {
    const { error } = await supabase
      .from('bespoke_inquiries')
      .insert({
        id: inquiry.id,
        client_name: inquiry.clientName,
        client_phone: inquiry.clientPhone,
        client_email: inquiry.clientEmail,
        submitted_time: inquiry.submittedTime,
        status: inquiry.status,
        event_type: inquiry.eventType,
        event_date: inquiry.eventDate,
        guest_scale: inquiry.guestScale,
        dietary_standard: inquiry.dietaryStandard,
        exterior_finish: inquiry.exteriorFinish,
        tier_architecture: inquiry.tierArchitecture,
        moodboard_images: inquiry.moodboardImages,
        quote_tariff: inquiry.quoteTariff,
      });

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function updateBespokeInquiryStatus(id: string, status: BespokeInquiry['status']): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;

  try {
    await supabase
      .from('bespoke_inquiries')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);
  } catch (e) {
    console.error('Failed to update bespoke inquiry status:', e);
  }
}

// ============================================================================
// TASTING SALON RESERVATIONS
// ============================================================================

export async function createTastingReservation(reservation: TastingReservation): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured || !supabase) return { success: true };

  try {
    const { error } = await supabase
      .from('tasting_reservations')
      .insert({
        flight_name: reservation.flightName,
        reservation_date: reservation.reservationDate,
        time_slot: reservation.timeSlot,
        guest_count: reservation.guestCount,
        patron_name: reservation.patronName,
        patron_phone: reservation.patronPhone,
        notes: reservation.notes,
        status: 'confirmed',
      });

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

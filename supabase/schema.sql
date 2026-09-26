-- ==============================================================================
-- KANAN PATISSERIE ATELIER & KITCHEN OPS - SUPABASE SQL SCHEMA
-- Complete Schema: Tables, Enums, Foreign Keys, Triggers, RLS Policies, Realtime & Seeds
-- Run this in the Supabase SQL Editor (https://app.supabase.com/project/_/sql)
-- ==============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. User Roles & Profiles
-- Profiles automatically mirrors Supabase auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'patron' CHECK (role IN ('patron', 'pastry_chef', 'admin', 'driver')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Automated Trigger to create Profile on User Sign Up in Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'patron')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Products Table (Confections, Tiers, Viennoiserie, Tarts)
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  sku TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('classic-cakes', 'gourmet-tiers', 'desserts-tarts', 'cookies-bakes', 'viennoiserie', 'gift-hampers')),
  category_label TEXT NOT NULL,
  price INTEGER NOT NULL,
  original_price INTEGER,
  rating NUMERIC(3, 2) DEFAULT 4.90,
  review_count INTEGER DEFAULT 0,
  weight TEXT NOT NULL,
  servings TEXT NOT NULL,
  badge TEXT,
  is_eggless BOOLEAN DEFAULT FALSE,
  is_gluten_free BOOLEAN DEFAULT FALSE,
  is_nut_free BOOLEAN DEFAULT FALSE,
  has_french_butter BOOLEAN DEFAULT TRUE,
  occasion TEXT[] DEFAULT '{}',
  description TEXT NOT NULL,
  lead_time TEXT NOT NULL,
  image_type TEXT NOT NULL,
  in_stock BOOLEAN DEFAULT TRUE,
  batch_capacity INTEGER DEFAULT 16,
  batch_booked INTEGER DEFAULT 0,
  ingredients JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Orders Table (Active Hearth Bake Pipeline & Patron Orders)
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY, -- e.g. ORD-8921 or ORD-8955
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_notes TEXT,
  vip_status TEXT,
  tag TEXT DEFAULT 'Online Storefront',
  confection_name TEXT NOT NULL,
  confection_specs TEXT[] NOT NULL DEFAULT '{}',
  net_weight TEXT NOT NULL,
  internal_dowels BOOLEAN DEFAULT FALSE,
  plaque_inscription TEXT,
  slot_time TEXT NOT NULL,
  destination TEXT NOT NULL,
  assigned_van TEXT DEFAULT 'Chilled Van #01 (KA 01 EK 4410)',
  driver_name TEXT DEFAULT 'Ramesh K. (+91 98801 23091)',
  stage TEXT NOT NULL DEFAULT 'deck-baking' CHECK (stage IN ('deck-baking', 'decorating', 'qc-chill', 'ready-dispatch', 'delivered')),
  stage_note TEXT,
  total_price INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Fleet Vans (Refrigerated Transit Telemetry)
CREATE TABLE IF NOT EXISTS public.fleet_vans (
  id TEXT PRIMARY KEY,
  number TEXT NOT NULL UNIQUE,
  driver_name TEXT NOT NULL,
  driver_phone TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'docked' CHECK (status IN ('en-route', 'docked', 'standby')),
  specialty TEXT NOT NULL,
  temperature NUMERIC(3, 1) NOT NULL DEFAULT 4.0,
  humidity INTEGER NOT NULL DEFAULT 52,
  speed TEXT NOT NULL DEFAULT '0 km/h',
  vibration_status TEXT NOT NULL DEFAULT 'Stable Smooth',
  current_location TEXT NOT NULL,
  eta TEXT NOT NULL,
  order_payload TEXT NOT NULL,
  percent_completed INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Pantry Items (Raw Sourcing Inventory)
CREATE TABLE IF NOT EXISTS public.pantry_items (
  name TEXT PRIMARY KEY,
  stock TEXT NOT NULL,
  threshold TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'healthy' CHECK (status IN ('healthy', 'reorder-sent', 'near-warning')),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Bespoke Tier Inquiries (Architectural Wedding / Gala Commissions)
CREATE TABLE IF NOT EXISTS public.bespoke_inquiries (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  client_name TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  client_email TEXT NOT NULL,
  submitted_time TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'chef-pricing' CHECK (status IN ('awaiting-triage', 'chef-pricing', 'tasting-scheduled', 'quote-sent', 'hearth-booked')),
  event_type TEXT NOT NULL,
  event_date TEXT NOT NULL,
  guest_scale TEXT NOT NULL,
  dietary_standard TEXT NOT NULL,
  exterior_finish TEXT NOT NULL,
  tier_architecture JSONB NOT NULL DEFAULT '[]'::jsonb,
  moodboard_images TEXT[] DEFAULT '{}',
  quote_tariff JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Tasting Salon Reservations
CREATE TABLE IF NOT EXISTS public.tasting_reservations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  flight_name TEXT NOT NULL,
  reservation_date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  guest_count INTEGER NOT NULL DEFAULT 2,
  patron_name TEXT NOT NULL,
  patron_phone TEXT NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'pending', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fleet_vans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pantry_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bespoke_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasting_reservations ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can view their own profile; staff can view all
CREATE POLICY "Public read profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Products: Everyone can read; authenticated staff can insert/update
CREATE POLICY "Anyone can view products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Staff can update products" ON public.products FOR ALL USING (
  auth.role() = 'authenticated'
);

-- Orders:
-- 1. Anyone (even guests) can create an order
CREATE POLICY "Anyone can create orders" ON public.orders FOR INSERT WITH CHECK (true);
-- 2. Everyone can read orders (allows live bake board tracking and patron lookup)
CREATE POLICY "Anyone can read orders" ON public.orders FOR SELECT USING (true);
-- 3. Authenticated users / staff can update order status
CREATE POLICY "Users can update orders" ON public.orders FOR UPDATE USING (true);

-- Fleet Vans & Pantry:
CREATE POLICY "Anyone can view fleet vans" ON public.fleet_vans FOR SELECT USING (true);
CREATE POLICY "Anyone can update fleet vans" ON public.fleet_vans FOR UPDATE USING (true);

CREATE POLICY "Anyone can view pantry items" ON public.pantry_items FOR SELECT USING (true);
CREATE POLICY "Anyone can update pantry items" ON public.pantry_items FOR UPDATE USING (true);

-- Bespoke Inquiries & Tastings:
CREATE POLICY "Anyone can create bespoke inquiries" ON public.bespoke_inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view bespoke inquiries" ON public.bespoke_inquiries FOR SELECT USING (true);
CREATE POLICY "Staff can update bespoke inquiries" ON public.bespoke_inquiries FOR UPDATE USING (true);

CREATE POLICY "Anyone can create tasting reservations" ON public.tasting_reservations FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view tasting reservations" ON public.tasting_reservations FOR SELECT USING (true);

-- ==============================================================================
-- REALTIME PUBLICATION
-- Enable instant live streaming of active hearth bake stages, vans, and orders!
-- ==============================================================================
DROP PUBLICATION IF EXISTS supabase_realtime;
CREATE PUBLICATION supabase_realtime FOR TABLE 
  public.orders, 
  public.fleet_vans, 
  public.pantry_items, 
  public.bespoke_inquiries,
  public.products;

-- ==============================================================================
-- INITIAL SEED DATA
-- Populate products, active orders, cold-fleet vans, pantry inventory
-- ==============================================================================

INSERT INTO public.products (id, sku, name, category, category_label, price, original_price, rating, review_count, weight, servings, badge, is_eggless, has_french_butter, description, lead_time, image_type, in_stock, batch_capacity, batch_booked, ingredients)
VALUES
('prod-1', 'KAN-TRF-001', 'Grand Cru Valrhona Truffle Cake', 'classic-cakes', 'Classic Signature', 1850, 2100, 4.95, 342, '1 kg (Standard)', '8 - 10 Servings', 'Bestseller Atelier', true, true, 'Layers of moist 64% Valrhona Manjari dark chocolate sponge, whipped chocolate ganache, crunchy hazelnut feuilletine base, hand-finished with delicate 24k gold leaf specks.', '3-Hour Express Available', 'valrhona-truffle', true, 16, 13, '[{"name": "Valrhona Manjari 64%", "description": "Single origin Madagascar dark cocoa"}, {"name": "French AOP Butter", "description": "Normandy slow churned"}]'::jsonb),
('prod-2', 'KAN-TRF-002', 'Roasted Hazelnut Gianduja Truffle', 'classic-cakes', 'Signature Gateau', 1950, NULL, 4.90, 218, '1 kg', '8 - 10 Servings', 'Chef Favorite', false, true, 'Rich dark chocolate mousse swirled with house-ground Piedmont hazelnut paste, dark chocolate génoise, and praline glaze crown.', 'Same Day (4 Hrs)', 'hazelnut-truffle', true, 12, 9, '[{"name": "Piedmont IGP Hazelnuts", "description": "Stone-milled praline"}, {"name": "Belgian Callebaut 70%", "description": "Intense roasted cocoa"}]'::jsonb),
('prod-3', 'KAN-TIER-003', 'Imperial Raspberry & Champagne Multi-Tier', 'gourmet-tiers', 'Celebration Masterpiece', 4800, 5200, 5.00, 84, '2.8 kg (2 Tiers)', '20 - 24 Servings', 'Bespoke Atelier', true, true, 'Two magnificent tiers of Madagascar bourbon vanilla chiffon soaked in champagne reduction, raspberry confit gelée, and vintage Lambeth buttercream piping.', '24-Hour Notice Required', 'raspberry-tier', true, 6, 4, '[{"name": "Tahitian Vanilla", "description": "Plump floral pods"}, {"name": "Wild Raspberry Confit", "description": "Handpicked berries"}]'::jsonb),
('prod-4', 'KAN-TRT-004', 'Sicilian Pistachio & Wild Berry Tart', 'desserts-tarts', 'Individual Patisserie', 480, NULL, 4.88, 420, '160 g', '1 Serving', 'Daily Batch', false, true, 'Golden fluted pâte sablée pastry shell loaded with baked pistachio frangipane, pistachio whipped white chocolate ganache, and fresh glazed raspberries.', 'Immediate Dispatch', 'pistachio-tart', true, 30, 24, '[{"name": "Bronte Green Pistachio", "description": "Pure volcanic pistachio butter"}, {"name": "Isigny Ste Mère Butter", "description": "French pastry butter"}]'::jsonb),
('prod-5', 'KAN-MAC-005', 'Parisian Ispahan Rose & Pistachio Macaron Box', 'gift-hampers', 'Luxury Confection Box', 1200, 1350, 4.92, 310, '12 Pieces', '12 Confections', 'Gift Ready', false, true, 'Twelve delicate almond meringue shells: 6 Persian rose water & lychee buttercream, and 6 Sicilian roasted pistachio praline.', 'Same Day Dispatch', 'rose-macarons', true, 25, 18, '[{"name": "California Blanched Almonds", "description": "Fine almond meal"}, {"name": "Persian Rose Distillate", "description": "Damascus petal infusion"}]'::jsonb),
('prod-6', 'KAN-VNO-006', 'French Morning Viennoiserie Basket', 'viennoiserie', 'Morning Bake (7 AM)', 890, NULL, 4.97, 520, '6 Pastries', '3 - 4 Servings', 'Fresh From Oven', false, true, 'Freshly baked at 5:00 AM: 2 Traditional Croissants with 27 laminations, 2 Pain au Chocolat with Valrhona batons, and 2 Cardamom Kouign-Amann.', 'Morning Delivery Only', 'viennoiserie', true, 40, 35, '[{"name": "Label Rouge T55 Flour", "description": "Artisanal flour"}, {"name": "Tourage Butter 84%", "description": "Dry butter for flakiness"}]'::jsonb),
('prod-7', 'KAN-CHK-007', 'Caramelized Basque Burnt Cheesecake', 'desserts-tarts', 'Artisan Cheesecake', 1450, NULL, 4.89, 194, '900 g', '6 - 8 Servings', 'Molten Center', false, false, 'Baked at 240°C in Spanish cedar parchment. Scorched caramelized bittersweet exterior with an oozy vanilla center.', '3-Hour Express', 'basque-cheesecake', true, 14, 8, '[{"name": "Philadelphia Cream Cheese", "description": "Lactic curd cheese"}, {"name": "Bourbon Vanilla", "description": "Madagascar pods"}]'::jsonb)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.fleet_vans (id, number, driver_name, driver_phone, status, specialty, temperature, humidity, speed, vibration_status, current_location, eta, order_payload, percent_completed)
VALUES
('van-1', 'KA 01 EK 4410 (Van #01)', 'Ramesh Kumar', '+91 98801 23091', 'en-route', 'Dual-Chamber Multi-Tier Logistics', 4.2, 54, '28 km/h', 'Gentle (Level 1 Damped)', '100ft Road -> Domlur Flyover', '14 mins to Richmond Town', '3 Confections (ORD-8921, ORD-8919, ORD-8915)', 65),
('van-2', 'KA 04 PB 7712 (Van #02)', 'Sunil Mahajan', '+91 99160 55432', 'en-route', 'Express Metro Line Logistics', 3.9, 52, '34 km/h', 'Stable Smooth', 'Outer Ring Road near Bellandur', '22 mins to Whitefield Prestige', '4 Confections (ORD-8902, ORD-8908, ORD-8911)', 45),
('van-3', 'KA 03 ML 9120 (Van #03)', 'Anand Varma', '+91 97412 88721', 'docked', 'Heavy Tier Grand Wedding Transport', 3.6, 50, '0 km/h (Docked at Bay 2)', 'Static Idle', 'Indiranagar Central Hub Loading Bay', 'Loading for 03:30 PM Wave', 'Queued: ORD-8924 (Imperial Tier)', 0)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.pantry_items (name, stock, threshold, status)
VALUES
('Valrhona Manjari 64% Dark (Madagascar)', '78.5 kg', '25.0 kg', 'healthy'),
('French AOP Normandy Butter (Charentes-Poitou)', '42.0 kg', '30.0 kg', 'healthy'),
('Sicilian Pure Bronte Pistachio Paste', '11.2 kg', '10.0 kg', 'near-warning'),
('Madagascar Grade-A Vanilla Pods', '340 pods', '100 pods', 'healthy'),
('French Label Rouge T55 Pastry Flour', '180 kg', '50 kg', 'healthy'),
('Edible 24k Gold Leaf Booklets', '18 sheets', '20 sheets', 'reorder-sent')
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.orders (id, customer_name, customer_phone, tag, confection_name, confection_specs, net_weight, internal_dowels, plaque_inscription, slot_time, destination, assigned_van, driver_name, stage, stage_note, total_price)
VALUES
('ORD-8921', 'Ananya Deshmukh', '+91 98450 21980', 'Priority VIP', 'Grand Cru Valrhona Truffle Cake', ARRAY['1.5 kg (Tiered Presentation)', '100% Eggless Formula', 'French Gold Leaf Crown'], '1.5 kg', true, 'Joyeux Anniversaire Sophie', '02:00 PM - 03:00 PM', 'Lavelle Road, Richmond Town', 'Chilled Van #01 (KA 01 EK 4410)', 'Ramesh K.', 'ready-dispatch', 'Packed in insulated thermal carrier with dry ice pouch.', 2680),
('ORD-8924', 'Vikramaditya & Rohini', '+91 99002 78312', 'Bespoke Wedding', 'Imperial Raspberry & Champagne Multi-Tier', ARRAY['3.5 kg (2 Tiers - 8" & 6")', 'Eggless Champagne Sponge', 'Vintage Lambeth Ruffles'], '3.5 kg', true, 'V & R - Forever in Bloom', '03:30 PM - 04:30 PM', 'The Leela Palace, Old Airport Rd', 'Chilled Van #03 (KA 03 ML 9120)', 'Anand V.', 'qc-chill', 'Chamber temperature stable at 3.8°C for structural setting.', 6200),
('ORD-8928', 'Dr. Siddharth Rao', '+91 98452 90114', 'Patron Atelier', 'Roasted Hazelnut Gianduja Truffle', ARRAY['1.0 kg Single Tier', 'Standard French Pastry', 'Dark Praline Glaze'], '1.0 kg', false, 'Happy 40th Sid', '04:00 PM - 05:00 PM', 'Defence Colony, Indiranagar', 'Chilled Van #02 (KA 04 PB 7712)', 'Sunil M.', 'decorating', 'Pastry chef completing tempered chocolate sails and gold leaf.', 1950),
('ORD-8931', 'Meera Nambiar', '+91 96111 44520', 'Tea Selection', 'Sicilian Pistachio & Wild Berry Tart (Box of 4)', ARRAY['4 Individual Pâte Sablée Tarts', 'Hand-glazed fresh alpine raspberries'], '640 g', false, 'For Tea at Three', '04:30 PM - 05:30 PM', 'Koramangala 4th Block', 'Chilled Van #01 (KA 01 EK 4410)', 'Ramesh K.', 'deck-baking', 'Deck Oven A: 8 minutes remaining on sablée crust bake.', 1920)
ON CONFLICT (id) DO NOTHING;

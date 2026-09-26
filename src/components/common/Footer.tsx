import React from 'react';
import { Award, ShieldCheck, ThermometerSnowflake, HeartHandshake, MapPin, Phone, Mail, Instagram } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#120908] text-[#c9b2a5] border-t border-[#2e1714] pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Core Pillars / Guarantees */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-12 border-b border-[#2b1613]">
          <div className="flex items-start gap-3.5 p-3 rounded-xl bg-[#1b0d0c] border border-[#331a17]">
            <Award className="w-8 h-8 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-serif text-sm font-semibold text-[#f5ede4]">Grand Cru Single-Origin</h4>
              <p className="text-xs text-[#a37e6f] mt-1">100% Certified Valrhona French Chocolate and AOP Charentes-Poitou butter.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-3 rounded-xl bg-[#1b0d0c] border border-[#331a17]">
            <ThermometerSnowflake className="w-8 h-8 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-serif text-sm font-semibold text-[#f5ede4]">Calibrated Cold-Fleet</h4>
              <p className="text-xs text-[#a37e6f] mt-1">Dedicated refrigerated vans at constant 4°C with active pneumatic shock-damping.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-3 rounded-xl bg-[#1b0d0c] border border-[#331a17]">
            <ShieldCheck className="w-8 h-8 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-serif text-sm font-semibold text-[#f5ede4]">Deck-Baked Daily</h4>
              <p className="text-xs text-[#a37e6f] mt-1">Four deck ovens fired at 5:00 AM daily. Zero artificial preservatives or emulsifiers.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-3 rounded-xl bg-[#1b0d0c] border border-[#331a17]">
            <HeartHandshake className="w-8 h-8 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-serif text-sm font-semibold text-[#f5ede4]">Bespoke Atelier Service</h4>
              <p className="text-xs text-[#a37e6f] mt-1">Private wedding tastings, customized structural tiers, hand-piped Lambeth artistry.</p>
            </div>
          </div>
        </div>

        {/* Detailed Columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 py-12">
          {/* Brand Info */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-serif font-black tracking-wider text-[#faeedd]">
                KANAN
              </span>
              <span className="text-[10px] tracking-widest px-2 py-0.5 uppercase bg-amber-500/20 text-amber-300 rounded border border-amber-500/30">
                Atelier & Boutique
              </span>
            </div>
            <p className="text-xs text-[#9d796b] leading-relaxed">
              Kanan is an artisanal French patisserie and celebration cake studio rooted in Bengaluru. We combine classical French pastry architecture with contemporary indulgence, backed by real-time kitchen dispatch transparency.
            </p>
            <div className="pt-2 flex items-center gap-4 text-xs text-[#8f6958]">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                FSSAI Lic: 11221334000892
              </span>
              <span>•</span>
              <span>GST Registered</span>
            </div>
          </div>

          {/* Atelier Hours & Address */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-serif text-sm font-semibold text-[#f7efe6] uppercase tracking-wider">
              Atelier & Salon
            </h4>
            <ul className="text-xs space-y-2.5 text-[#a88273]">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>12, 12th Main Road, HAL 2nd Stage, Indiranagar, Bengaluru 560038</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>+91 80 4122 8900 / +91 98450 21980</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>bonjour@kananatelier.in</span>
              </li>
              <li className="pt-1 text-[#8f6958]">
                <strong>Salon Hours:</strong> Tue - Sun: 8:00 AM – 9:30 PM (Mondays Hearth Rest)
              </li>
            </ul>
          </div>

          {/* Curated Selections */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="font-serif text-sm font-semibold text-[#f7efe6] uppercase tracking-wider">
              Confections
            </h4>
            <ul className="text-xs space-y-2 text-[#a88273]">
              <li><span className="hover:text-amber-300 transition-colors cursor-pointer">Grand Cru Valrhona</span></li>
              <li><span className="hover:text-amber-300 transition-colors cursor-pointer">Multi-Tier Bespoke</span></li>
              <li><span className="hover:text-amber-300 transition-colors cursor-pointer">Sicilian Pistachio Tarts</span></li>
              <li><span className="hover:text-amber-300 transition-colors cursor-pointer">Morning Viennoiserie</span></li>
              <li><span className="hover:text-amber-300 transition-colors cursor-pointer">Basque Burnt Wheels</span></li>
              <li><span className="hover:text-amber-300 transition-colors cursor-pointer">Private Salon Tastings</span></li>
            </ul>
          </div>

          {/* Sourcing Newsletter / Dispatch Wave Subscription */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-serif text-sm font-semibold text-[#f7efe6] uppercase tracking-wider">
              Morning Bake Bulletin
            </h4>
            <p className="text-xs text-[#9d796b]">
              Receive early allocation access for limited seasonal viennoiserie drops and holiday tasting invitations.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-[#1e0f0e] border border-[#3e1e1b] rounded-lg px-3 py-2 text-xs text-[#faeedd] placeholder-[#7a5547] focus:outline-none focus:border-amber-400 flex-1"
              />
              <button className="bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs px-3 py-2 rounded-lg transition-colors">
                Join
              </button>
            </div>
            <p className="text-[11px] text-[#785345]">Complimentary box of 2 macarons on your inaugural order.</p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#261311] flex flex-col sm:flex-row items-center justify-between text-xs text-[#7d5849] gap-4">
          <p>© {new Date().getFullYear()} Kanan Bakery Atelier. Handcrafted with reverence for classical pastry.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-[#a88273] cursor-pointer">Cold-Fleet Logistics Protocol</span>
            <span className="hover:text-[#a88273] cursor-pointer">Allergen Matrix</span>
            <span className="hover:text-[#a88273] cursor-pointer">Terms of Commission</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

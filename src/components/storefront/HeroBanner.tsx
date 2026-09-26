import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, ThermometerSnowflake, Star, Clock } from 'lucide-react';
import { PatisserieArtwork } from '../common/PatisserieArtwork';

interface HeroBannerProps {
  onExploreMenu: () => void;
  onBespokeCommission: () => void;
  onBookTasting: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onExploreMenu,
  onBespokeCommission,
  onBookTasting,
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#1b0e0c] via-[#21110f] to-[#160c0b] text-[#f7efe6] border-b border-[#3b1f1b]">
      {/* Decorative Warm Ambient Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-rose-900/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-7 space-y-6">
            {/* Top Curated Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#341b18] border border-[#522924] text-xs text-amber-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-medium tracking-wide">Bengaluru's Haute Patisserie Atelier</span>
              <span className="text-[#885d4d]">|</span>
              <span className="text-[#debba9]">Deck Baked Daily at 5:00 AM</span>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight text-[#fdf8f2] leading-[1.12]">
              Pure Single-Origin Chocolate & <span className="italic font-normal text-amber-300">French Butter</span> Confections.
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#cdb1a2] leading-relaxed max-w-2xl font-light">
              Crafted in Indiranagar with Grand Cru Valrhona cocoa, AOP Charentes-Poitou cultured butter, and organic stoneground grains. Delivered citywide in dedicated 4°C chilled vans with pneumatic vibration damping.
            </p>

            {/* Quick Metrics Bar */}
            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-[#b89482]">
              <div className="flex items-center gap-1.5">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="font-semibold text-white">4.95</span>
                <span>(1,400+ Patrons)</span>
              </div>
              <div className="flex items-center gap-1.5 text-cyan-300">
                <ThermometerSnowflake className="w-3.5 h-3.5" />
                <span>Active 4.0°C Chilled Van Fleet</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-300">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>100% Preservative-Free</span>
              </div>
            </div>

            {/* Call to Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-4">
              <button
                onClick={onExploreMenu}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 hover:from-amber-500 hover:to-amber-700 text-white font-medium text-sm tracking-wide shadow-lg shadow-amber-900/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 group cursor-pointer"
              >
                <span>Explore Signature Menu</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onBespokeCommission}
                className="px-6 py-3.5 rounded-xl bg-[#291513] hover:bg-[#381d1a] border border-[#5a2e28] text-amber-200 font-medium text-sm tracking-wide transition-all hover:border-amber-400/50 flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Commission Bespoke Tier</span>
              </button>

              <button
                onClick={onBookTasting}
                className="px-4 py-3.5 rounded-xl text-xs font-medium text-[#bca091] hover:text-white transition-colors cursor-pointer"
              >
                Book Private Tasting Salon →
              </button>
            </div>
          </div>

          {/* Right Column: Hero Showcase Card Featuring Signature Grand Cru Truffle */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl bg-gradient-to-b from-[#2a1614] to-[#1c0d0c] border border-[#4d2621] p-6 shadow-2xl overflow-hidden group">
              {/* Badge */}
              <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                <span>Atelier Highlight of the Day</span>
              </div>

              {/* Artwork Render */}
              <div className="w-full aspect-square max-h-80 sm:max-h-96 rounded-xl overflow-hidden relative shadow-inner bg-[#120807] flex items-center justify-center p-2">
                <PatisserieArtwork type="valrhona-truffle" className="w-full h-full" />
              </div>

              {/* Card Meta Info */}
              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#faeedd]">
                      Grand Cru Valrhona Truffle Cake
                    </h3>
                    <p className="text-xs text-[#a98271]">
                      64% Manjari dark ganache, roasted hazelnut feuilletine, 24k gold leaf
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-amber-300">₹1,850</span>
                    <span className="block text-[10px] text-[#8e6958]">1 kg Standard</span>
                  </div>
                </div>

                {/* Live Batch Dispatch Telemetry */}
                <div className="p-2.5 rounded-lg bg-[#1f0f0e] border border-[#3b1d19] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>2:00 PM Afternoon Hearth Wave</span>
                  </div>
                  <span className="text-amber-300 font-semibold">3 of 16 batches left</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

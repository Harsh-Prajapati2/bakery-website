import React from 'react';
import { Flame, Award, ShieldCheck, ThermometerSnowflake, Sparkles } from 'lucide-react';

export const StoryAndSourcing: React.FC = () => {
  return (
    <section id="our-story" className="py-14 bg-[#140a08] text-[#f7efe6] border-b border-[#311613]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Our Hearth & Heritage</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-black text-[#faeedd]">
            Reverence for Classical French Pastry
          </h2>
          <p className="text-xs sm:text-sm text-[#ab8573] leading-relaxed">
            Founded in 2018 in Indiranagar, Bengaluru, Kanan was built on a simple conviction: uncompromising ingredient transparency, European stone deck baking, and unbroken cold-chain logistics.
          </p>
        </div>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#1d0e0c] border border-[#3b1d19] rounded-3xl p-6 sm:p-8 space-y-4 relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-amber-950/80 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#f5ece3]">
              Grand Cru Valrhona Chocolates
            </h3>
            <p className="text-xs text-[#a98271] leading-relaxed">
              We exclusively temper Grand Cru couverture from Tain-l'Hermitage, France. From the red-berry acidity of Madagascar Manjari 64% to the toasted caramel notes of Dulcey 35%, our chocolate holds zero palm oils, hydrogenated fats, or artificial vanilla.
            </p>
          </div>

          <div className="bg-[#1d0e0c] border border-[#3b1d19] rounded-3xl p-6 sm:p-8 space-y-4 relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-rose-950/80 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Flame className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#f5ece3]">
              Deck Hearth Micro-Baking
            </h3>
            <p className="text-xs text-[#a98271] leading-relaxed">
              Unlike industrial convection air blowers that dry delicate sponge crumbs, our 4 stone deck hearths generate gentle radiant heat with precision steam injection. Viennoiserie pastries achieve 27 crisp, butter-laminated layers with deep caramelization.
            </p>
          </div>

          <div className="bg-[#1d0e0c] border border-[#3b1d19] rounded-3xl p-6 sm:p-8 space-y-4 relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <ThermometerSnowflake className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#f5ece3]">
              Active Cold-Fleet Telemetry
            </h3>
            <p className="text-xs text-[#a98271] leading-relaxed">
              Delicate French buttercream and multi-tiered ganache melt above 18°C. We operate our own fleet of custom refrigerated transit vans maintaining continuous 4°C with active pneumatic shock-absorption cradles, ensuring confections arrive without sag or slip.
            </p>
          </div>
        </div>

        {/* Provenance Map / Ingredient Table */}
        <div className="bg-[#190c0a] border border-[#381a17] rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#301614] pb-4">
            <div>
              <h3 className="font-serif text-xl font-bold text-[#faeedd]">
                The Sourcing Ledger
              </h3>
              <p className="text-xs text-[#a98271]">
                Every single ingredient is tracked from origin farm to our Indiranagar pantry.
              </p>
            </div>
            <span className="text-xs text-amber-300 font-semibold px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 w-fit">
              100% Traceable Batch System
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-[#22110f] border border-[#3d1d19] space-y-1.5">
              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400">Dairy</span>
              <h4 className="font-serif text-sm font-bold text-[#f5ece3]">AOP French Butter</h4>
              <p className="text-xs text-[#8e6857]">Charentes-Poitou & Normandy, France. Slow-churned 84% fat cultured cream.</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#22110f] border border-[#3d1d19] space-y-1.5">
              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400">Botanical</span>
              <h4 className="font-serif text-sm font-bold text-[#f5ece3]">Tahitian Vanilla Pods</h4>
              <p className="text-xs text-[#8e6857]">Papua New Guinea & Tahiti. Plump cured pods with aniseed & floral fragrance.</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#22110f] border border-[#3d1d19] space-y-1.5">
              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400">Nut Praline</span>
              <h4 className="font-serif text-sm font-bold text-[#f5ece3]">Bronte Pistachios</h4>
              <p className="text-xs text-[#8e6857]">Mount Etna volcanic soil, Sicily. Pure green emerald pistachio stone-milled butter.</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#22110f] border border-[#3d1d19] space-y-1.5">
              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400">Milling</span>
              <h4 className="font-serif text-sm font-bold text-[#f5ece3]">Label Rouge T55 Flour</h4>
              <p className="text-xs text-[#8e6857]">Moulins Viron, France. Traditional stone-ground unbleached wheat flour.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

import React, { useState } from 'react';
import { BespokeCakeConfig, CartItem } from '../../types';
import { Sparkles, Check, ArrowRight, ShieldCheck, Clock, Layers, Flame, Award, Truck } from 'lucide-react';

interface CustomCakeBuilderProps {
  onAddToCart: (item: Omit<CartItem, 'id'>) => void;
  onCommissionToKitchen: (config: BespokeCakeConfig) => void;
}

export const CustomCakeBuilder: React.FC<CustomCakeBuilderProps> = ({
  onAddToCart,
  onCommissionToKitchen,
}) => {
  const [config, setConfig] = useState<BespokeCakeConfig>({
    occasion: 'Milestone Anniversary',
    tierSize: '2-tier',
    tierLabel: '2-Tier Grand Celebration (3.5 kg, 28-35 Guests)',
    spongeFlavor: 'Valrhona 64% Manjari Dark Cocoa',
    fillingFlavor: 'Roasted Hazelnut Feuilletine Praline',
    exteriorFinish: 'Vintage Lambeth Ruffled Buttercream',
    finishPrice: 1200,
    dietary: 'eggless',
    plaqueMessage: 'V & R • Together in Sweetness',
    deliveryDate: '2026-10-15',
    fulfillmentMethod: 'chilled-van',
    customNotes: 'Please ensure gold leafing is applied delicately along the top tier scallops.',
  });

  const [activeStep, setActiveStep] = useState<number>(1);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Price calculation
  const baseTierPrice = config.tierSize === '1-tier' ? 3200 : config.tierSize === '2-tier' ? 7800 : 16500;
  const finishPrice = config.finishPrice;
  const logisticsFee = config.fulfillmentMethod === 'chilled-van' ? 550 : 0;
  const totalPrice = baseTierPrice + finishPrice + logisticsFee;

  const handleCommission = () => {
    onCommissionToKitchen(config);
    // Also offer to add to cart
    onAddToCart({
      productId: `bespoke-${Date.now()}`,
      name: `Bespoke ${config.tierSize.toUpperCase()} Commission (${config.occasion})`,
      price: totalPrice,
      size: config.tierSize === '1-tier' ? '1.2 kg' : config.tierSize === '2-tier' ? '3.5 kg' : '7.5 kg',
      isEggless: config.dietary === 'eggless',
      plaqueInscription: config.plaqueMessage,
      dispatchSlot: `${config.deliveryDate} • Chilled Logistics`,
      quantity: 1,
      imageType: config.tierSize === '3-tier' ? 'raspberry-tier' : 'tropical-tier',
    });

    setSubmittedSuccess(true);
  };

  return (
    <section id="custom-builder" className="py-12 bg-[#190d0b] text-[#f7efe6] border-b border-[#3b1d19]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Studio Tier Commission</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-black text-[#faeedd]">
            Architect Your Celebration Cake
          </h2>
          <p className="text-xs sm:text-sm text-[#ab8573] leading-relaxed">
            Construct your architectural confection tier by tier. Every custom creation undergoes structural internal doweling and thermal chill stabilization before delivery.
          </p>
        </div>

        {submittedSuccess ? (
          <div className="max-w-2xl mx-auto bg-[#231210] border border-emerald-500/50 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-950 border border-emerald-500 text-emerald-300 mx-auto flex items-center justify-center">
              <Check className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h3 className="font-serif text-2xl font-bold text-[#faeedd]">
                Commission Dispatched to Hearth Hub!
              </h3>
              <p className="text-xs text-[#b89482] leading-relaxed">
                Your custom architectural design has been recorded in the Indiranagar Kitchen Ops Console. Our Head Pastry Chef has been assigned to schedule the deck baking and structural setting.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#1a0c0a] border border-[#3d1d19] text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-[#8e6857]">Architecture:</span>
                <span className="text-amber-200 font-semibold">{config.tierLabel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8e6857]">Flavor Symphony:</span>
                <span className="text-white">{config.spongeFlavor} & {config.fillingFlavor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8e6857]">Exterior Artistry:</span>
                <span className="text-white">{config.exteriorFinish}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8e6857]">Plaque Message:</span>
                <span className="text-amber-300 italic">"{config.plaqueMessage}"</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#311613] font-bold">
                <span className="text-[#debba9]">Tariff Total:</span>
                <span className="text-amber-300 text-sm">₹{totalPrice}</span>
              </div>
            </div>

            <button
              onClick={() => setSubmittedSuccess(false)}
              className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium transition-colors cursor-pointer"
            >
              Design Another Tier Commission
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Interactive Live SVG Render Preview (Sticky) */}
            <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
              <div className="bg-[#22110f] border border-[#44211d] rounded-3xl p-6 shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-[#361a17] pb-3 text-xs">
                  <span className="text-amber-400 font-bold uppercase tracking-wider">
                    Interactive Tier Blueprint
                  </span>
                  <span className="text-[11px] text-[#936e5e]">Real-time Proportions</span>
                </div>

                {/* SVG Visual Model */}
                <div className="w-full aspect-[4/3] flex items-center justify-center my-4 relative">
                  <svg viewBox="0 0 400 320" className="w-full h-full max-h-72 drop-shadow-2xl">
                    <defs>
                      <linearGradient id="cakeIvory" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#fdf6ee" />
                        <stop offset="50%" stopColor="#f5e3ce" />
                        <stop offset="100%" stopColor="#d9be9e" />
                      </linearGradient>
                      <linearGradient id="cakeGanache" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3d211d" />
                        <stop offset="50%" stopColor="#251210" />
                        <stop offset="100%" stopColor="#140807" />
                      </linearGradient>
                      <linearGradient id="cakeGoldStucco" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ecd599" />
                        <stop offset="50%" stopColor="#d4af37" />
                        <stop offset="100%" stopColor="#aa8214" />
                      </linearGradient>
                      <linearGradient id="pedestalGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#ffffff" />
                        <stop offset="60%" stopColor="#d6d6d6" />
                        <stop offset="100%" stopColor="#9e9e9e" />
                      </linearGradient>
                    </defs>

                    {/* Pedestal Stand */}
                    <ellipse cx="200" cy="290" rx="140" ry="16" fill="url(#pedestalGrad)" stroke="#737373" strokeWidth="2" />
                    <path d="M 180 290 L 175 310 L 225 310 L 220 290 Z" fill="#b0b0b0" />
                    <ellipse cx="200" cy="310" rx="60" ry="8" fill="#787878" />

                    {/* Base Tier (Bottom Tier) */}
                    <g>
                      {/* Cylinder body */}
                      <path 
                        d="M 100 230 C 100 230, 100 270, 100 270 C 100 285, 300 285, 300 270 L 300 230 Z" 
                        fill={
                          config.exteriorFinish.includes('Brutalist') ? 'url(#cakeGanache)' :
                          config.exteriorFinish.includes('Gold') ? 'url(#cakeGoldStucco)' : 'url(#cakeIvory)'
                        }
                      />
                      {/* Top oval of bottom tier */}
                      <ellipse 
                        cx="200" 
                        cy="230" 
                        rx="100" 
                        ry="18" 
                        fill={
                          config.exteriorFinish.includes('Brutalist') ? '#442520' :
                          config.exteriorFinish.includes('Gold') ? '#f3e3b5' : '#fff9f0'
                        } 
                        stroke="#caa895" 
                        strokeWidth="1.5" 
                      />
                      {/* Decorative Piping / Pearls on Base Tier */}
                      {config.exteriorFinish.includes('Lambeth') && (
                        <path 
                          d="M 100 240 Q 125 255 150 240 Q 175 255 200 240 Q 225 255 250 240 Q 275 255 300 240" 
                          fill="none" 
                          stroke="#e6cbb7" 
                          strokeWidth="3" 
                        />
                      )}
                    </g>

                    {/* Middle Tier (Shown if 2-tier or 3-tier) */}
                    {(config.tierSize === '2-tier' || config.tierSize === '3-tier') && (
                      <g>
                        <path 
                          d="M 130 170 L 130 215 C 130 228, 270 228, 270 215 L 270 170 Z" 
                          fill={
                            config.exteriorFinish.includes('Brutalist') ? 'url(#cakeGanache)' :
                            config.exteriorFinish.includes('Gold') ? 'url(#cakeGoldStucco)' : 'url(#cakeIvory)'
                          } 
                        />
                        <ellipse 
                          cx="200" 
                          cy="170" 
                          rx="70" 
                          ry="14" 
                          fill={
                            config.exteriorFinish.includes('Brutalist') ? '#442520' :
                            config.exteriorFinish.includes('Gold') ? '#f3e3b5' : '#fff9f0'
                          } 
                          stroke="#caa895" 
                          strokeWidth="1.5" 
                        />
                        {config.exteriorFinish.includes('Lambeth') && (
                          <path 
                            d="M 130 180 Q 153 192 176 180 Q 200 192 224 180 Q 247 192 270 180" 
                            fill="none" 
                            stroke="#e6cbb7" 
                            strokeWidth="2.5" 
                          />
                        )}
                      </g>
                    )}

                    {/* Top Tier (Shown if 3-tier) */}
                    {config.tierSize === '3-tier' && (
                      <g>
                        <path 
                          d="M 155 115 L 155 155 C 155 166, 245 166, 245 155 L 245 115 Z" 
                          fill={
                            config.exteriorFinish.includes('Brutalist') ? 'url(#cakeGanache)' :
                            config.exteriorFinish.includes('Gold') ? 'url(#cakeGoldStucco)' : 'url(#cakeIvory)'
                          } 
                        />
                        <ellipse 
                          cx="200" 
                          cy="115" 
                          rx="45" 
                          ry="10" 
                          fill={
                            config.exteriorFinish.includes('Brutalist') ? '#442520' :
                            config.exteriorFinish.includes('Gold') ? '#f3e3b5' : '#fff9f0'
                          } 
                          stroke="#caa895" 
                          strokeWidth="1.5" 
                        />
                      </g>
                    )}

                    {/* Crown Florals / Topper */}
                    <g transform={`translate(200, ${config.tierSize === '3-tier' ? '105' : config.tierSize === '2-tier' ? '160' : '220'})`}>
                      <circle cx="-10" cy="-6" r="8" fill="#e06d7e" />
                      <circle cx="10" cy="-6" r="8" fill="#ecc4c9" />
                      <circle cx="0" cy="-12" r="10" fill="#f79da7" />
                      <circle cx="0" cy="-12" r="4" fill="#ffd700" />
                      <ellipse cx="-18" cy="-4" rx="6" ry="2.5" fill="#7a9a60" transform="rotate(-30 -18 -4)" />
                      <ellipse cx="18" cy="-4" rx="6" ry="2.5" fill="#7a9a60" transform="rotate(30 18 -4)" />
                    </g>

                    {/* Custom Chocolate Plaque Representation */}
                    {config.plaqueMessage && (
                      <g transform="translate(200, 255)">
                        <rect x="-80" y="-12" width="160" height="24" rx="6" fill="#1f0f0e" stroke="#d4af37" strokeWidth="1.5" />
                        <text x="0" y="4" textAnchor="middle" fill="#faeedd" fontSize="9" fontFamily="Playfair Display, serif" fontStyle="italic">
                          {config.plaqueMessage.length > 28 ? config.plaqueMessage.substring(0, 26) + '...' : config.plaqueMessage}
                        </text>
                      </g>
                    )}
                  </svg>
                </div>

                {/* Real-time Pricing Summary Card */}
                <div className="bg-[#190c0a] border border-[#3b1d19] rounded-2xl p-4 space-y-2 text-xs">
                  <div className="flex justify-between text-[#8e6857]">
                    <span>Structural Tier Base ({config.tierSize}):</span>
                    <span className="text-[#f5ece3] font-medium">₹{baseTierPrice}</span>
                  </div>
                  <div className="flex justify-between text-[#8e6857]">
                    <span>Exterior Finish ({config.exteriorFinish}):</span>
                    <span className="text-[#f5ece3] font-medium">₹{finishPrice}</span>
                  </div>
                  <div className="flex justify-between text-[#8e6857]">
                    <span>Refrigerated 4°C Van Logistics:</span>
                    <span className="text-[#f5ece3] font-medium">{logisticsFee === 0 ? 'Complimentary' : `₹${logisticsFee}`}</span>
                  </div>
                  <div className="pt-2 border-t border-[#311613] flex justify-between items-baseline font-bold">
                    <span className="text-amber-300 text-sm">Estimated Commission Total:</span>
                    <span className="text-amber-300 text-xl font-serif">₹{totalPrice}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Step-by-Step Selection Form */}
            <div className="lg:col-span-7 bg-[#20100e] border border-[#44211d] rounded-3xl p-6 sm:p-8 space-y-8 shadow-xl">
              {/* Step Tabs */}
              <div className="flex items-center justify-between border-b border-[#361a17] pb-4">
                {[
                  { num: 1, label: 'Tier Scale' },
                  { num: 2, label: 'Flavors' },
                  { num: 3, label: 'Exterior Art' },
                  { num: 4, label: 'Logistics' },
                ].map((s) => (
                  <button
                    key={s.num}
                    onClick={() => setActiveStep(s.num)}
                    className={`flex items-center gap-2 text-xs font-semibold pb-1 cursor-pointer transition-colors ${
                      activeStep === s.num
                        ? 'text-amber-300 border-b-2 border-amber-400'
                        : 'text-[#8e6857] hover:text-[#d4af94]'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                      activeStep === s.num ? 'bg-amber-500 text-[#140807]' : 'bg-[#2d1614] text-[#8e6857]'
                    }`}>
                      {s.num}
                    </span>
                    <span className="hidden sm:inline">{s.label}</span>
                  </button>
                ))}
              </div>

              {/* Step 1: Tier Architecture */}
              {activeStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#faeedd]">
                      Select Architectural Tier Scale
                    </h3>
                    <p className="text-xs text-[#a98271]">
                      Engineered with food-grade food dowels and reinforced cake drums for safe transit.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {[
                      {
                        size: '1-tier' as const,
                        title: '1-Tier Intimate (1.2 kg)',
                        guests: '10 - 14 Guests • Single Tier (8")',
                        price: 3200,
                        desc: 'Ideal for private salon dinners, milestones, and intimate anniversary soirées.'
                      },
                      {
                        size: '2-tier' as const,
                        title: '2-Tier Grand Celebration (3.5 kg)',
                        guests: '28 - 35 Guests • 8" base + 6" top',
                        price: 7800,
                        badge: 'Most Popular',
                        desc: 'Perfect proportional harmony with dramatic visual elevation for weddings and grand galas.'
                      },
                      {
                        size: '3-tier' as const,
                        title: '3-Tier Imperial Wedding (7.5 kg)',
                        guests: '75 - 90 Guests • 10" base + 8" mid + 6" crown',
                        price: 16500,
                        badge: 'Haute Couture',
                        desc: 'Showstopping ballroom centerpiece requiring master pastry artisan assembly and on-site setup.'
                      },
                    ].map((item) => (
                      <div
                        key={item.size}
                        onClick={() => setConfig(prev => ({ ...prev, tierSize: item.size, tierLabel: item.title }))}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer relative ${
                          config.tierSize === item.size
                            ? 'bg-amber-950/40 border-amber-500 shadow-md'
                            : 'bg-[#190c0a] border-[#361a17] hover:border-[#522924]'
                        }`}
                      >
                        {item.badge && (
                          <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                            {item.badge}
                          </span>
                        )}
                        <div className="flex items-center justify-between">
                          <h4 className="font-serif text-sm font-bold text-[#f5ece3]">
                            {item.title}
                          </h4>
                          <span className="text-amber-300 font-bold text-sm">₹{item.price}</span>
                        </div>
                        <p className="text-xs text-[#a98271] mt-1">{item.guests}</p>
                        <p className="text-xs text-[#8e6857] mt-1.5">{item.desc}</p>
                      </div>
                    ))}
                  </div>

                  {/* Dietary Standard */}
                  <div className="pt-4 border-t border-[#311613]">
                    <label className="text-xs font-semibold text-[#f5ece3] block mb-2">
                      Dietary Formulation:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'eggless', label: '100% Eggless Formula' },
                        { id: 'standard', label: 'French Classic (Egg)' },
                        { id: 'gluten-friendly', label: 'Gluten-Friendly' },
                      ].map((d) => (
                        <button
                          key={d.id}
                          onClick={() => setConfig(prev => ({ ...prev, dietary: d.id as any }))}
                          className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition-all ${
                            config.dietary === d.id
                              ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500'
                              : 'bg-[#180a09] text-[#8e6857] border-[#361a17]'
                          }`}
                        >
                          {d.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      onClick={() => setActiveStep(2)}
                      className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Proceed to Flavors</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Flavors & Fillings */}
              {activeStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#faeedd]">
                      Sponge & Praline Symphony
                    </h3>
                    <p className="text-xs text-[#a98271]">
                      Choose complementary sponge and layered filling profiles.
                    </p>
                  </div>

                  {/* Sponge */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#f5ece3] block">
                      Tier Sponge Crumb:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {[
                        'Valrhona 64% Manjari Dark Cocoa',
                        'Madagascar Bourbon Vanilla Bean Chiffon',
                        'Sicilian Bronte Emerald Pistachio Genoise',
                        'Bergamot Earl Grey Infused Sponge'
                      ].map((sp) => (
                        <div
                          key={sp}
                          onClick={() => setConfig(prev => ({ ...prev, spongeFlavor: sp }))}
                          className={`p-3 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                            config.spongeFlavor === sp
                              ? 'bg-amber-950/50 text-amber-200 border-amber-500'
                              : 'bg-[#190c0a] text-[#a98271] border-[#361a17] hover:border-[#522924]'
                          }`}
                        >
                          {sp}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Filling */}
                  <div className="space-y-2 pt-2">
                    <label className="text-xs font-semibold text-[#f5ece3] block">
                      Filling & Crunch Layer:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {[
                        'Roasted Hazelnut Feuilletine Praline',
                        'Slow-Simmered Raspberry Confit Gelée',
                        'Fleur de Sel Guérande Salted Caramel Ganache',
                        'Exotic Passionfruit & Alphonso Mango Curd'
                      ].map((fl) => (
                        <div
                          key={fl}
                          onClick={() => setConfig(prev => ({ ...prev, fillingFlavor: fl }))}
                          className={`p-3 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                            config.fillingFlavor === fl
                              ? 'bg-amber-950/50 text-amber-200 border-amber-500'
                              : 'bg-[#190c0a] text-[#a98271] border-[#361a17] hover:border-[#522924]'
                          }`}
                        >
                          {fl}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      onClick={() => setActiveStep(1)}
                      className="px-4 py-2 rounded-xl text-xs text-[#8e6857] hover:text-white transition-colors"
                    >
                      ← Back
                    </button>
                    <button
                      onClick={() => setActiveStep(3)}
                      className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Proceed to Exterior Art</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Exterior Artistry & Inscription */}
              {activeStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#faeedd]">
                      Exterior Artistry & Inscription
                    </h3>
                    <p className="text-xs text-[#a98271]">
                      Select the visual texture and personalized dark chocolate plaque text.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {[
                      {
                        name: 'Vintage Lambeth Ruffled Buttercream',
                        cost: 1200,
                        desc: 'Intricate ornate Victorian shell borders, cascading ruffles, and edible luster pearls.'
                      },
                      {
                        name: 'Minimalist Brutalist Dark Ganache',
                        cost: 0,
                        desc: 'Sleek, razor-sharp edges finished in velvet cocoa glaze with architectural wafer paper sails.'
                      },
                      {
                        name: '24k Gold Flaked Textured Stucco',
                        cost: 1800,
                        desc: 'Hand-sculpted organic palette-knife ridges generously gilded with pure 24k French gold leaf.'
                      },
                      {
                        name: 'Botanical Pressed Flora & Berries',
                        cost: 1500,
                        desc: 'Arranged organic edible pressed blossoms, micro-chamomile, and dehydrated mountain berries.'
                      },
                    ].map((fin) => (
                      <div
                        key={fin.name}
                        onClick={() => setConfig(prev => ({ ...prev, exteriorFinish: fin.name, finishPrice: fin.cost }))}
                        className={`p-3.5 rounded-2xl border text-xs transition-all cursor-pointer ${
                          config.exteriorFinish === fin.name
                            ? 'bg-amber-950/40 border-amber-500 shadow-md'
                            : 'bg-[#190c0a] border-[#361a17] hover:border-[#522924]'
                        }`}
                      >
                        <div className="flex justify-between font-semibold">
                          <span className="text-[#f5ece3]">{fin.name}</span>
                          <span className="text-amber-300">{fin.cost === 0 ? 'Included' : `+₹${fin.cost}`}</span>
                        </div>
                        <p className="text-[#8e6857] mt-1">{fin.desc}</p>
                      </div>
                    ))}
                  </div>

                  {/* Chocolate Plaque Inscription */}
                  <div className="pt-2 space-y-2">
                    <label className="text-xs font-semibold text-[#f5ece3] block">
                      Custom Chocolate Plaque Inscription (Max 40 chars):
                    </label>
                    <input
                      type="text"
                      maxLength={40}
                      value={config.plaqueMessage}
                      onChange={(e) => setConfig(prev => ({ ...prev, plaqueMessage: e.target.value }))}
                      placeholder="e.g. V & R • Forever in Bloom"
                      className="w-full bg-[#180a09] border border-[#44211d] rounded-xl px-3 py-2 text-xs text-amber-100 placeholder-[#6e483a] focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      onClick={() => setActiveStep(2)}
                      className="px-4 py-2 rounded-xl text-xs text-[#8e6857] hover:text-white transition-colors"
                    >
                      ← Back
                    </button>
                    <button
                      onClick={() => setActiveStep(4)}
                      className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Proceed to Logistics</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Logistics & Confirmation */}
              {activeStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#faeedd]">
                      Logistics & Hearth Commission
                    </h3>
                    <p className="text-xs text-[#a98271]">
                      Select fulfillment protocol and review commission dossier before dispatch.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div
                      onClick={() => setConfig(prev => ({ ...prev, fulfillmentMethod: 'chilled-van' }))}
                      className={`p-4 rounded-2xl border text-xs cursor-pointer transition-all ${
                        config.fulfillmentMethod === 'chilled-van'
                          ? 'bg-cyan-950/40 border-cyan-500 shadow-md'
                          : 'bg-[#190c0a] border-[#361a17]'
                      }`}
                    >
                      <div className="flex items-center gap-2 font-bold text-[#f5ece3]">
                        <Truck className="w-4 h-4 text-cyan-400" />
                        <span>Dedicated 4°C Chilled Van</span>
                      </div>
                      <p className="text-[#8e6857] mt-1.5">
                        Pneumatic vibration damping with live GPS and chamber temperature telemetry.
                      </p>
                      <span className="text-cyan-300 font-semibold mt-2 block">₹550 Logistics Fee</span>
                    </div>

                    <div
                      onClick={() => setConfig(prev => ({ ...prev, fulfillmentMethod: 'pickup' }))}
                      className={`p-4 rounded-2xl border text-xs cursor-pointer transition-all ${
                        config.fulfillmentMethod === 'pickup'
                          ? 'bg-amber-950/40 border-amber-500 shadow-md'
                          : 'bg-[#190c0a] border-[#361a17]'
                      }`}
                    >
                      <div className="flex items-center gap-2 font-bold text-[#f5ece3]">
                        <Award className="w-4 h-4 text-amber-400" />
                        <span>Atelier Studio Pickup</span>
                      </div>
                      <p className="text-[#8e6857] mt-1.5">
                        Collect directly from Indiranagar Central Hub with chef briefing & insulated thermal tote.
                      </p>
                      <span className="text-emerald-400 font-semibold mt-2 block">Complimentary</span>
                    </div>
                  </div>

                  {/* Commission Delivery Date */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#f5ece3] block">
                      Target Celebration / Event Date:
                    </label>
                    <input
                      type="date"
                      value={config.deliveryDate}
                      onChange={(e) => setConfig(prev => ({ ...prev, deliveryDate: e.target.value }))}
                      className="bg-[#180a09] border border-[#44211d] rounded-xl px-3 py-2 text-xs text-amber-100 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  {/* Chef Notes */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#f5ece3] block">
                      Special Dietary or Chef Briefing Notes:
                    </label>
                    <textarea
                      rows={2}
                      value={config.customNotes}
                      onChange={(e) => setConfig(prev => ({ ...prev, customNotes: e.target.value }))}
                      placeholder="e.g. Venue coordinator contact, allergen cautions, or setup instructions..."
                      className="w-full bg-[#180a09] border border-[#44211d] rounded-xl px-3 py-2 text-xs text-amber-100 placeholder-[#6e483a] focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  {/* Commission Button */}
                  <div className="pt-4 border-t border-[#311613] flex flex-col sm:flex-row items-center justify-between gap-4">
                    <button
                      onClick={() => setActiveStep(3)}
                      className="px-4 py-2 rounded-xl text-xs text-[#8e6857] hover:text-white transition-colors"
                    >
                      ← Back
                    </button>

                    <button
                      onClick={handleCommission}
                      className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 hover:from-amber-500 hover:to-amber-700 text-white font-medium text-xs tracking-wide shadow-xl shadow-amber-900/40 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Dispatch Commission to Kitchen Hub • ₹{totalPrice}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

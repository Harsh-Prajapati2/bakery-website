import React, { useState } from 'react';
import { Product, CartItem } from '../../types';
import { PatisserieArtwork } from '../common/PatisserieArtwork';
import { X, Star, Clock, ShieldCheck, ThermometerSnowflake, Plus, Minus, PenTool, Check } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (item: Omit<CartItem, 'id'>) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  if (!product) return null;

  const [quantity, setQuantity] = useState(1);
  const [selectedWeight, setSelectedWeight] = useState(product.weight);
  const [inscription, setInscription] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('2:00 PM - 4:00 PM Wave (Today)');
  const [justAdded, setJustAdded] = useState(false);

  // Scaled price calculation
  let currentPrice = product.price;
  if (selectedWeight.includes('500 g')) currentPrice = Math.round(product.price * 0.58);
  if (selectedWeight.includes('1.5 kg')) currentPrice = Math.round(product.price * 1.45);
  if (selectedWeight.includes('2 kg') || selectedWeight.includes('2.8 kg')) currentPrice = Math.round(product.price * 1.9);

  const handleAdd = () => {
    onAddToCart({
      productId: product.id,
      name: product.name,
      price: currentPrice,
      size: selectedWeight,
      isEggless: product.isEggless,
      plaqueInscription: inscription.trim() || undefined,
      dispatchSlot: selectedSlot,
      quantity,
      imageType: product.imageType,
    });

    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="relative w-full max-w-4xl bg-[#1c0e0c] border border-[#44211d] rounded-3xl shadow-2xl overflow-hidden text-[#f7efe6] my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-[#2c1411] hover:bg-[#3d1c18] border border-[#4f241f] flex items-center justify-center text-[#debba9] hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 sm:p-8">
          {/* Left Column: Visual Artwork & Provenance */}
          <div className="md:col-span-6 space-y-4">
            <div className="aspect-square w-full rounded-2xl bg-[#120807] border border-[#391b17] overflow-hidden p-4 flex items-center justify-center relative shadow-inner">
              <PatisserieArtwork type={product.imageType} className="w-full h-full object-contain" />
              
              {product.badge && (
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 backdrop-blur-md">
                    {product.badge}
                  </span>
                </div>
              )}
            </div>

            {/* Sourcing & Ingredients Provenance */}
            <div className="bg-[#241311] rounded-2xl p-4 border border-[#3b1c19] space-y-3">
              <h4 className="text-xs uppercase tracking-widest text-amber-300 font-semibold">
                Transparent Sourcing Matrix
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {product.ingredients.map((ing, idx) => (
                  <div key={idx} className="text-xs flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0"></span>
                    <div>
                      <strong className="text-[#f5ece3]">{ing.name}: </strong>
                      <span className="text-[#a5806f]">{ing.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chilled Temperature Telemetry Note */}
            <div className="p-3 rounded-xl bg-[#190c0a] border border-[#311613] flex items-center gap-3 text-xs text-[#b89482]">
              <ThermometerSnowflake className="w-5 h-5 text-cyan-400 shrink-0" />
              <span>Chilled transit protocol: Maintained at 4°C inside thermal carrier with suspension cradle.</span>
            </div>
          </div>

          {/* Right Column: Order Configuration & Actions */}
          <div className="md:col-span-6 flex flex-col justify-between space-y-5">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                  {product.categoryLabel} • SKU: {product.sku}
                </span>
                <div className="flex items-center gap-1 text-amber-400 text-xs">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-bold">{product.rating}</span>
                  <span className="text-[#8e6857]">({product.reviewCount} Reviews)</span>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#fdf8f2] mt-1">
                {product.name}
              </h2>

              {/* Price & Servings */}
              <div className="mt-2 flex items-baseline gap-3">
                <span className="text-2xl font-bold text-amber-300">
                  ₹{currentPrice * quantity}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-[#7e5849] line-through">
                    ₹{product.originalPrice * quantity}
                  </span>
                )}
                <span className="text-xs text-[#a98271] pl-2 border-l border-[#3a1d19]">
                  {product.servings}
                </span>
              </div>

              {/* Description */}
              <p className="mt-3 text-xs sm:text-sm text-[#cdb1a2] leading-relaxed">
                {product.description}
              </p>

              {/* Dietary Tags */}
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                {product.isEggless && (
                  <span className="px-2.5 py-1 rounded-md bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    100% Eggless
                  </span>
                )}
                {product.hasFrenchButter && (
                  <span className="px-2.5 py-1 rounded-md bg-[#2b1714] text-amber-200 border border-[#482420]">
                    AOP French Butter
                  </span>
                )}
                {product.isGlutenFree && (
                  <span className="px-2.5 py-1 rounded-md bg-[#221b14] text-amber-300 border border-amber-600/30">
                    Gluten-Friendly Flour
                  </span>
                )}
              </div>

              {/* Weight Selector */}
              {product.category === 'classic-cakes' && (
                <div className="mt-5 space-y-2">
                  <label className="text-xs font-semibold text-[#f5ece3] block">
                    Select Cake Dimension / Weight:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['500 g', '1 kg (Standard)', '1.5 kg'].map((wt) => (
                      <button
                        key={wt}
                        onClick={() => setSelectedWeight(wt)}
                        className={`py-2 px-2 rounded-xl text-xs font-medium border text-center transition-all ${
                          selectedWeight === wt
                            ? 'bg-amber-600/30 text-amber-200 border-amber-500 shadow-md'
                            : 'bg-[#22110f] text-[#a98271] border-[#381b17] hover:border-[#522924]'
                        }`}
                      >
                        {wt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Gold Plaque Inscription */}
              <div className="mt-5 space-y-2">
                <label className="text-xs font-semibold text-[#f5ece3] flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <PenTool className="w-3.5 h-3.5 text-amber-400" />
                    Complimentary Dark Chocolate Plaque Inscription:
                  </span>
                  <span className="text-[10px] text-[#8e6857]">{inscription.length}/40 chars</span>
                </label>
                <input
                  type="text"
                  maxLength={40}
                  value={inscription}
                  onChange={(e) => setInscription(e.target.value)}
                  placeholder="e.g. Joyeux Anniversaire Vikram ✨"
                  className="w-full bg-[#180a09] border border-[#44211d] rounded-xl px-3 py-2 text-xs text-amber-100 placeholder-[#6e483a] focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Delivery Wave Slot Selection */}
              <div className="mt-4 space-y-2">
                <label className="text-xs font-semibold text-[#f5ece3] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  Select Refrigerated Fleet Dispatch Slot:
                </label>
                <select
                  value={selectedSlot}
                  onChange={(e) => setSelectedSlot(e.target.value)}
                  className="w-full bg-[#180a09] border border-[#44211d] rounded-xl px-3 py-2 text-xs text-[#debba9] focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  <option value="Today 2:00 PM - 4:00 PM Wave">Today: 2:00 PM – 4:00 PM Afternoon Wave (Recommended)</option>
                  <option value="Today 5:00 PM - 7:00 PM Wave">Today: 5:00 PM – 7:00 PM Twilight Wave</option>
                  <option value="Tomorrow 10:00 AM - 12:00 PM Wave">Tomorrow: 10:00 AM – 12:00 PM Morning Hearth Wave</option>
                  <option value="Tomorrow 2:00 PM - 4:00 PM Wave">Tomorrow: 2:00 PM – 4:00 PM Afternoon Wave</option>
                </select>
              </div>
            </div>

            {/* Quantity & CTA */}
            <div className="pt-4 border-t border-[#311613] flex items-center gap-4">
              <div className="flex items-center border border-[#44211d] rounded-xl bg-[#190a09] p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#2e1512] text-[#debba9] transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center font-bold text-sm text-[#f5ece3]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#2e1512] text-[#debba9] transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={handleAdd}
                disabled={justAdded}
                className="flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 hover:from-amber-500 hover:to-amber-700 text-white font-medium text-sm shadow-xl shadow-amber-900/40 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
              >
                {justAdded ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Added to Bag!</span>
                  </>
                ) : (
                  <span>
                    Add to Bag • ₹{currentPrice * quantity}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

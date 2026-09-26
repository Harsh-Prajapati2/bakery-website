import React, { useState, useMemo } from 'react';
import { 
  Product, 
  ProductCategory, 
  CartItem 
} from '../../types';
import { PatisserieArtwork } from '../common/PatisserieArtwork';
import { Star, Clock, Check, Sparkles, Filter, ChevronRight, PenTool } from 'lucide-react';

interface ProductCatalogProps {
  products: Product[];
  onAddToCart: (item: Omit<CartItem, 'id'>) => void;
  onOpenProductDetail: (product: Product) => void;
  searchQuery: string;
  egglessOnly: boolean;
  setEgglessOnly: (val: boolean) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  onAddToCart,
  onOpenProductDetail,
  searchQuery,
  egglessOnly,
  setEgglessOnly,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('all');
  const [leadTimeFilter, setLeadTimeFilter] = useState<'all' | 'express' | 'same-day' | 'advance'>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');
  const [activeInscriptionProductId, setActiveInscriptionProductId] = useState<string | null>(null);
  const [inscriptionText, setInscriptionText] = useState<{ [productId: string]: string }>({});
  const [selectedWeights, setSelectedWeights] = useState<{ [productId: string]: string }>({});
  const [addedToast, setAddedToast] = useState<string | null>(null);

  const categories: { id: ProductCategory; label: string }[] = [
    { id: 'all', label: 'All Confections' },
    { id: 'classic-cakes', label: 'Classic Cakes' },
    { id: 'gourmet-tiers', label: 'Gourmet Tiers' },
    { id: 'desserts-tarts', label: 'Desserts & Tarts' },
    { id: 'viennoiserie', label: 'Morning Viennoiserie' },
    { id: 'cookies-bakes', label: 'Cookies & Bakes' },
    { id: 'gift-hampers', label: 'Gift Hampers' },
  ];

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }
      // Eggless filter
      if (egglessOnly && !p.isEggless) {
        return false;
      }
      // Lead time filter
      if (leadTimeFilter === 'express' && !p.leadTime.toLowerCase().includes('express') && !p.leadTime.toLowerCase().includes('immediate')) {
        return false;
      }
      if (leadTimeFilter === 'same-day' && !p.leadTime.toLowerCase().includes('same day') && !p.leadTime.toLowerCase().includes('immediate')) {
        return false;
      }
      if (leadTimeFilter === 'advance' && !p.leadTime.toLowerCase().includes('notice') && !p.leadTime.toLowerCase().includes('hour')) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        const matchesIngredients = p.ingredients.some(i => i.name.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesIngredients) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // featured default
    });
  }, [products, selectedCategory, egglessOnly, leadTimeFilter, searchQuery, sortBy]);

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    const chosenWeight = selectedWeights[product.id] || product.weight;
    let finalPrice = product.price;

    // Weight price multiplier if larger weight is chosen
    if (chosenWeight.includes('500 g')) finalPrice = Math.round(product.price * 0.58);
    if (chosenWeight.includes('1.5 kg')) finalPrice = Math.round(product.price * 1.45);
    if (chosenWeight.includes('2 kg') || chosenWeight.includes('2.8 kg')) finalPrice = Math.round(product.price * 1.9);

    const message = inscriptionText[product.id]?.trim() || undefined;

    onAddToCart({
      productId: product.id,
      name: product.name,
      price: finalPrice,
      size: chosenWeight,
      isEggless: product.isEggless,
      plaqueInscription: message,
      dispatchSlot: 'Today 2:00 PM - 4:00 PM Chilled Fleet',
      quantity: 1,
      imageType: product.imageType,
    });

    setAddedToast(`Added ${product.name} to bag`);
    setTimeout(() => setAddedToast(null), 2500);
  };

  return (
    <section id="confection-menu" className="py-12 bg-[#170c0a] text-[#f7efe6]">
      {/* Toast Notification */}
      {addedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-900 border border-emerald-500 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-slide-up">
          <Check className="w-4 h-4 text-emerald-300" />
          <span className="text-xs font-medium">{addedToast}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#301815] pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-amber-400 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Indiranagar Central Hearth</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-black text-[#faeedd] mt-1">
              The Confection Catalogue
            </h2>
            <p className="text-xs sm:text-sm text-[#ab8573] mt-1 max-w-xl">
              Each confection is formulated with Grand Cru chocolates, cultured French butter, and baked to order in micro-batches.
            </p>
          </div>

          {/* Quick Dietary and Speed Filters */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Lead Time Filter */}
            <select
              value={leadTimeFilter}
              onChange={(e) => setLeadTimeFilter(e.target.value as any)}
              className="bg-[#241311] border border-[#44221e] text-xs text-[#debba9] rounded-lg px-3 py-2 focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              <option value="all">Fulfillment: All Waves</option>
              <option value="express">Express Wave (3 Hours)</option>
              <option value="same-day">Same Day Dispatch</option>
              <option value="advance">Advance Bespoke</option>
            </select>

            {/* Sort Filter */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#241311] border border-[#44221e] text-xs text-[#debba9] rounded-lg px-3 py-2 focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              <option value="featured">Sort: Atelier Curated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated (4.9+)</option>
            </select>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-900/40 border border-amber-500'
                    : 'bg-[#221210] text-[#bca091] hover:text-white hover:bg-[#2e1815] border border-[#3b1d19]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-[#1f100e] rounded-2xl border border-[#381a17] p-8">
            <p className="text-base text-[#cb9e8a]">No confections match your active filter criteria.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setEgglessOnly(false);
                setLeadTimeFilter('all');
              }}
              className="mt-4 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs rounded-lg transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const currentWeight = selectedWeights[product.id] || product.weight;
              const hasPlaqueOpen = activeInscriptionProductId === product.id;
              const bookedPct = Math.round((product.batchBooked / product.batchCapacity) * 100);

              return (
                <div
                  key={product.id}
                  onClick={() => onOpenProductDetail(product)}
                  className="group bg-[#21110f] rounded-2xl border border-[#3e1f1c] hover:border-amber-400/50 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1 cursor-pointer"
                >
                  {/* Top Artwork Container */}
                  <div className="relative aspect-square w-full bg-[#140908] overflow-hidden p-2 flex items-center justify-center">
                    <PatisserieArtwork type={product.imageType} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />

                    {/* Badge at Top Left */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                      {product.badge && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 backdrop-blur-md">
                          {product.badge}
                        </span>
                      )}
                      {product.isEggless && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 backdrop-blur-md flex items-center gap-1 w-fit">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                          100% Eggless
                        </span>
                      )}
                    </div>

                    {/* Lead Time at Top Right */}
                    <div className="absolute top-3 right-3 z-10">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#1a0c0b]/80 text-[#debba9] border border-[#44221e] backdrop-blur-md flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-400" />
                        {product.leadTime}
                      </span>
                    </div>

                    {/* Batch capacity meter on card bottom */}
                    <div className="absolute bottom-2 left-2 right-2 z-10 bg-[#160c0b]/85 backdrop-blur-sm px-2.5 py-1 rounded-md border border-[#331a17] flex items-center justify-between text-[10px]">
                      <span className="text-[#a57f6f]">Hearth Batch:</span>
                      <span className="text-amber-300 font-semibold">
                        {product.batchCapacity - product.batchBooked} left in 2 PM wave
                      </span>
                    </div>
                  </div>

                  {/* Body Details */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      {/* Rating & Category */}
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[10px] uppercase tracking-wider text-[#a88273]">
                          {product.categoryLabel}
                        </span>
                        <div className="flex items-center gap-1 text-amber-400 text-xs">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span className="font-semibold">{product.rating}</span>
                          <span className="text-[10px] text-[#7d5849]">({product.reviewCount})</span>
                        </div>
                      </div>

                      {/* Product Title */}
                      <h3 className="font-serif text-base font-bold text-[#faeedd] mt-1 group-hover:text-amber-200 transition-colors line-clamp-1">
                        {product.name}
                      </h3>

                      {/* Snippet Description */}
                      <p className="text-xs text-[#a37e6f] mt-1 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    {/* Weight Options for Cakes */}
                    {product.category === 'classic-cakes' && (
                      <div className="pt-1" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-1 text-[11px] text-[#8e6a5b] mb-1">
                          <span>Portion:</span>
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                          {['500 g', '1 kg (Standard)', '1.5 kg'].map((w) => (
                            <button
                              key={w}
                              onClick={() => setSelectedWeights(prev => ({ ...prev, [product.id]: w }))}
                              className={`py-1 px-1.5 rounded text-[10px] font-medium border text-center transition-all ${
                                currentWeight === w
                                  ? 'bg-amber-950/80 text-amber-200 border-amber-500'
                                  : 'bg-[#190c0a] text-[#8e6a5b] border-[#361a17] hover:border-[#522924]'
                              }`}
                            >
                              {w.replace(' (Standard)', '')}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Optional Gold Plaque Inscription Toggle */}
                    <div className="pt-1 border-t border-[#2e1714]" onClick={(e) => e.stopPropagation()}>
                      {!hasPlaqueOpen ? (
                        <button
                          onClick={() => setActiveInscriptionProductId(product.id)}
                          className="text-[11px] text-[#ba9684] hover:text-amber-300 flex items-center gap-1 transition-colors"
                        >
                          <PenTool className="w-3 h-3 text-amber-400" />
                          <span>Add Chocolate Plaque Message</span>
                        </button>
                      ) : (
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-[10px] text-[#debba9]">
                            <span className="flex items-center gap-1">
                              <PenTool className="w-2.5 h-2.5 text-amber-400" />
                              Custom Plaque Inscription:
                            </span>
                            <button
                              onClick={() => setActiveInscriptionProductId(null)}
                              className="text-[#885d4d] hover:text-white"
                            >
                              ✕
                            </button>
                          </div>
                          <input
                            type="text"
                            placeholder="e.g., Happy 30th Ananya ✨"
                            maxLength={35}
                            value={inscriptionText[product.id] || ''}
                            onChange={(e) => setInscriptionText(prev => ({ ...prev, [product.id]: e.target.value }))}
                            className="w-full bg-[#180b0a] border border-[#482420] rounded px-2 py-1 text-xs text-amber-100 placeholder-[#6e493b] focus:outline-none focus:border-amber-400"
                          />
                        </div>
                      )}
                    </div>

                    {/* Price & Action Button */}
                    <div className="pt-2 flex items-center justify-between gap-2 border-t border-[#2e1714]">
                      <div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-base font-bold text-amber-300">
                            ₹{product.price}
                          </span>
                          {product.originalPrice && (
                            <span className="text-xs text-[#7e5849] line-through">
                              ₹{product.originalPrice}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-[#8e6857] block">
                          {product.servings}
                        </span>
                      </div>

                      <button
                        onClick={(e) => handleQuickAdd(product, e)}
                        className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-medium text-xs shadow-md transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>Add to Bag</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

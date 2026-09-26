import React, { useState } from 'react';
import { CartItem } from '../../types';
import { PatisserieArtwork } from '../common/PatisserieArtwork';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Check, ThermometerSnowflake, ShieldCheck, PenTool } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: (orderDetails: {
    customerName: string;
    customerPhone: string;
    destination: string;
    slotTime: string;
    customerNotes: string;
  }) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}) => {
  const [customerName, setCustomerName] = useState('Ananya Deshmukh');
  const [customerPhone, setCustomerPhone] = useState('+91 98450 21980');
  const [destination, setDestination] = useState('14, Richmond Road, Bengaluru');
  const [slotTime, setSlotTime] = useState('Today 2:00 PM - 4:00 PM Wave');
  const [customerNotes, setCustomerNotes] = useState('Please handle with care; keep refrigerated upon delivery.');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderPlacedSuccess, setOrderPlacedSuccess] = useState(false);

  if (!isOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = subtotal > 2000 || subtotal === 0 ? 0 : 150;
  const gst = Math.round(subtotal * 0.05); // 5% GST on bakery
  const total = subtotal + deliveryFee + gst;

  const handleCompleteOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !destination) return;

    setIsCheckingOut(true);
    setTimeout(() => {
      onCheckout({
        customerName,
        customerPhone,
        destination,
        slotTime,
        customerNotes,
      });
      setIsCheckingOut(false);
      setOrderPlacedSuccess(true);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm flex justify-end">
      <div 
        className="w-full max-w-md bg-[#1a0d0c] text-[#f7efe6] border-l border-[#3a1d19] h-full flex flex-col shadow-2xl animate-slide-left relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-[#311613] flex items-center justify-between bg-[#20100e]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            <h2 className="font-serif text-lg font-bold text-[#faeedd]">
              Your Confection Bag
            </h2>
            <span className="text-xs bg-[#2e1513] text-amber-300 px-2 py-0.5 rounded-full border border-[#48221d]">
              {cart.reduce((a, b) => a + b.quantity, 0)} items
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#2a1310] hover:bg-[#3d1a16] border border-[#48221d] flex items-center justify-center text-[#debba9] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {orderPlacedSuccess ? (
          <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-950 border border-emerald-500 text-emerald-300 flex items-center justify-center">
              <Check className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h3 className="font-serif text-2xl font-bold text-[#faeedd]">
                Order Dispatched to Hearth!
              </h3>
              <p className="text-xs text-[#a98271] leading-relaxed">
                Your order is now queued in the Indiranagar Kitchen Ops Console. You can toggle to the <strong>Kitchen Ops Console</strong> in the top bar to watch the deck ovens, cold-fleet telemetry, and order progress live!
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-[#140807] border border-[#2d1411] text-left text-xs w-full space-y-2 text-[#debba9]">
              <div className="flex justify-between">
                <span className="text-[#8e6857]">Customer:</span>
                <span className="font-medium text-white">{customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8e6857]">Fulfillment Slot:</span>
                <span className="text-amber-300">{slotTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8e6857]">Transit Temperature:</span>
                <span className="text-cyan-300 font-semibold">4.0°C Chilled Van</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-[#291310] font-bold text-white">
                <span>Total Paid:</span>
                <span className="text-amber-300 text-sm">₹{total}</span>
              </div>
            </div>
            <button
              onClick={() => {
                setOrderPlacedSuccess(false);
                onClose();
              }}
              className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              Continue Exploring Boutique
            </button>
          </div>
        ) : cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#241210] border border-[#3d1d19] flex items-center justify-center text-[#7e5748]">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif text-base font-bold text-[#faeedd]">
                Your Bag is Empty
              </h3>
              <p className="text-xs text-[#8e6857]">
                Add our signature Valrhona confections or bespoke celebration tiers.
              </p>
            </div>
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium transition-colors cursor-pointer"
            >
              Explore Confection Menu
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto flex flex-col justify-between">
            {/* Items List */}
            <div className="p-4 space-y-3 divide-y divide-[#2a1310]">
              {cart.map((item) => (
                <div key={item.id} className="pt-3 first:pt-0 flex gap-3">
                  {/* Thumbnail Artwork */}
                  <div className="w-16 h-16 rounded-xl bg-[#120807] border border-[#331613] p-1 shrink-0 overflow-hidden flex items-center justify-center">
                    <PatisserieArtwork type={item.imageType} className="w-full h-full object-contain" />
                  </div>

                  {/* Item Specs */}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-serif text-xs font-bold text-[#f5ece3] line-clamp-1">
                        {item.name}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-[#7d5647] hover:text-rose-400 transition-colors p-0.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] text-[#a88273]">
                      <span>{item.size}</span>
                      {item.isEggless && (
                        <span className="text-emerald-400 font-semibold">• Eggless</span>
                      )}
                    </div>

                    {/* Plaque Message if present */}
                    {item.plaqueInscription && (
                      <div className="text-[10px] text-amber-300 italic flex items-center gap-1 bg-[#241311] px-2 py-0.5 rounded border border-[#3d1d19]">
                        <PenTool className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                        <span className="truncate">"{item.plaqueInscription}"</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs font-bold text-amber-300">
                        ₹{item.price * item.quantity}
                      </span>

                      {/* Quantity Controls */}
                      <div className="flex items-center border border-[#3d1d19] rounded-lg bg-[#140807]">
                        <button
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="w-6 h-6 flex items-center justify-center text-[#debba9] hover:bg-[#2b1411] transition-colors"
                        >
                          <Minus className="w-2.5 h-2.5" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-[#f5ece3]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="w-6 h-6 flex items-center justify-center text-[#debba9] hover:bg-[#2b1411] transition-colors"
                        >
                          <Plus className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Delivery Address & Checkout Form */}
            <div className="p-4 bg-[#1f100e] border-t border-[#311613] space-y-4">
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-[#debba9] font-semibold">
                  <span>Fulfillment Protocol:</span>
                  <span className="text-cyan-300 flex items-center gap-1 text-[11px]">
                    <ThermometerSnowflake className="w-3 h-3" />
                    Chilled Van (4.0°C)
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Recipient Name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="bg-[#140807] border border-[#3d1d19] rounded-lg px-2.5 py-1.5 text-xs text-amber-100 placeholder-[#6e483a] focus:outline-none focus:border-amber-400"
                  />
                  <input
                    type="tel"
                    placeholder="Mobile Number"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="bg-[#140807] border border-[#3d1d19] rounded-lg px-2.5 py-1.5 text-xs text-amber-100 placeholder-[#6e483a] focus:outline-none focus:border-amber-400"
                  />
                </div>

                <input
                  type="text"
                  placeholder="Delivery Address (Bengaluru)"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full bg-[#140807] border border-[#3d1d19] rounded-lg px-2.5 py-1.5 text-xs text-amber-100 placeholder-[#6e483a] focus:outline-none focus:border-amber-400"
                />

                <select
                  value={slotTime}
                  onChange={(e) => setSlotTime(e.target.value)}
                  className="w-full bg-[#140807] border border-[#3d1d19] rounded-lg px-2.5 py-1.5 text-xs text-[#debba9] focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  <option value="Today 2:00 PM - 4:00 PM Wave">Today: 2:00 PM – 4:00 PM Wave</option>
                  <option value="Today 5:00 PM - 7:00 PM Wave">Today: 5:00 PM – 7:00 PM Wave</option>
                  <option value="Tomorrow 10:00 AM - 12:00 PM Wave">Tomorrow: 10:00 AM – 12:00 PM Wave</option>
                </select>
              </div>

              {/* Price Calculations */}
              <div className="space-y-1.5 pt-2 border-t border-[#2e1512] text-xs">
                <div className="flex justify-between text-[#a88273]">
                  <span>Subtotal:</span>
                  <span className="text-[#f5ece3]">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-[#a88273]">
                  <span>Refrigerated 4°C Logistics:</span>
                  <span className={deliveryFee === 0 ? 'text-emerald-400 font-medium' : 'text-[#f5ece3]'}>
                    {deliveryFee === 0 ? 'Free (Orders > ₹2,000)' : `₹${deliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-[#a88273]">
                  <span>GST (5%):</span>
                  <span className="text-[#f5ece3]">₹{gst}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#faeedd] pt-1 border-t border-[#2e1512]">
                  <span>Total Amount:</span>
                  <span className="text-amber-300 font-serif text-base">₹{total}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={handleCompleteOrder}
                disabled={isCheckingOut}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 hover:from-amber-500 hover:to-amber-700 text-white font-medium text-xs tracking-wide shadow-xl transition-all hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer"
              >
                {isCheckingOut ? (
                  <span>Securing Hearth Batch...</span>
                ) : (
                  <>
                    <span>Place Order to Kitchen Hub • ₹{total}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

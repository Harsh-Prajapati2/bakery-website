import React, { useState } from 'react';
import { Calendar, Clock, Users, Coffee, Sparkles, Check, MapPin, Award } from 'lucide-react';
import { createTastingReservation } from '../../services/supabaseService';

export const TastingSalonBooking: React.FC = () => {
  const [selectedFlight, setSelectedFlight] = useState('Grand Cru Chocolate & Praline Flight');
  const [guestCount, setGuestCount] = useState(2);
  const [selectedDate, setSelectedDate] = useState('2026-10-10');
  const [selectedTime, setSelectedTime] = useState('11:30 AM');
  const [patronName, setPatronName] = useState('');
  const [patronPhone, setPatronPhone] = useState('');
  const [patronNotes, setPatronNotes] = useState('');
  const [bookedConfirmation, setBookedConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const flights = [
    {
      name: 'Grand Cru Chocolate & Praline Flight',
      duration: '45 Minutes',
      price: '₹1,450 for two',
      desc: 'Comparative tasting of 4 Valrhona single-origin chocolates (Guanaja 70%, Manjari 64%, Jivara 40%, Dulcey 35%) paired with house hazelnut praline and espresso.',
      badge: 'Popular'
    },
    {
      name: 'Bespoke Wedding & Milestone Tier Showcase',
      duration: '60 Minutes',
      price: '₹2,200 for two (Reimbursable on tier order)',
      desc: 'Private salon consultation with our Head Decorator. Sample 6 sponge and ganache combinations with tiered presentation mockups.',
      badge: 'Bridal Atelier'
    },
    {
      name: 'Seasonal Viennoiserie & Pâtisserie Tea Flight',
      duration: '40 Minutes',
      price: '₹1,250 for two',
      desc: 'Freshly pulled espresso or Himalayan first-flush tea served with morning laminated pastries, mini pistachio tarts, and Ispahan macarons.',
      badge: 'Morning Salon'
    }
  ];

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patronName || !patronPhone) return;
    setIsSubmitting(true);

    await createTastingReservation({
      flightName: selectedFlight,
      reservationDate: selectedDate,
      timeSlot: selectedTime,
      guestCount,
      patronName,
      patronPhone,
      notes: patronNotes,
      status: 'confirmed',
    });

    setIsSubmitting(false);
    setBookedConfirmation(true);
  };

  return (
    <section id="tasting-salon" className="py-14 bg-[#180c0a] text-[#f7efe6] border-b border-[#361a17]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30">
            <Coffee className="w-3.5 h-3.5 text-amber-400" />
            <span>Private Salon Experience</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-black text-[#faeedd]">
            Reserve an Atelier Tasting
          </h2>
          <p className="text-xs sm:text-sm text-[#a98271] leading-relaxed">
            Experience our flavor pairings in an intimate 45-minute private salon at our Indiranagar atelier. Reserved for bespoke tier commissions, wedding couples, and chocolate connoisseurs.
          </p>
        </div>

        {bookedConfirmation ? (
          <div className="max-w-xl mx-auto bg-[#22110f] border border-emerald-500/40 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-950 border border-emerald-500 text-emerald-300 mx-auto flex items-center justify-center">
              <Check className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h3 className="font-serif text-2xl font-bold text-[#faeedd]">
                Salon Reservation Confirmed
              </h3>
              <p className="text-xs text-[#b89482] leading-relaxed">
                Merci, {patronName}! A formal salon pass has been dispatched via SMS to {patronPhone}. Our Sommelier Pastry Chef will prepare your customized flight for your arrival.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#190c0a] border border-[#3b1d19] text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-[#8e6857]">Flight Selected:</span>
                <span className="text-amber-200 font-semibold">{selectedFlight}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8e6857]">Date & Time:</span>
                <span className="text-white">{selectedDate} at {selectedTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8e6857]">Salon Location:</span>
                <span className="text-white">Private Tasting Room 1, Indiranagar Hub</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8e6857]">Guests:</span>
                <span className="text-white">{guestCount} Patrons</span>
              </div>
            </div>

            <button
              onClick={() => setBookedConfirmation(false)}
              className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium transition-colors cursor-pointer"
            >
              Reserve Another Flight
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Flight Cards */}
            <div className="lg:col-span-6 space-y-4">
              <h3 className="text-xs uppercase tracking-widest text-amber-300 font-bold mb-1">
                Step 1: Choose Your Tasting Flight
              </h3>
              <div className="space-y-3">
                {flights.map((flight) => (
                  <div
                    key={flight.name}
                    onClick={() => setSelectedFlight(flight.name)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer relative ${
                      selectedFlight === flight.name
                        ? 'bg-amber-950/40 border-amber-500 shadow-lg'
                        : 'bg-[#1e0f0d] border-[#361a17] hover:border-[#4d2520]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-wide">
                        {flight.badge}
                      </span>
                      <span className="text-xs text-amber-300 font-semibold">{flight.price}</span>
                    </div>
                    <h4 className="font-serif text-base font-bold text-[#f5ece3] mt-1">
                      {flight.name}
                    </h4>
                    <p className="text-xs text-[#a98271] mt-1 leading-relaxed">
                      {flight.desc}
                    </p>
                    <div className="mt-2 flex items-center gap-3 text-[11px] text-[#8e6857]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-400" />
                        {flight.duration}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-amber-400" />
                        Indiranagar Salon
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Atelier Note */}
              <div className="p-4 rounded-2xl bg-[#190c0a] border border-[#311613] text-xs text-[#9d796b] space-y-1.5">
                <div className="flex items-center gap-2 text-amber-300 font-semibold">
                  <Award className="w-4 h-4" />
                  <span>Wedding Commission Rebate</span>
                </div>
                <p>
                  Patrons booking the Bespoke Wedding & Milestone Tier Showcase receive a full 100% tasting credit applied toward their final commissioned tier invoice.
                </p>
              </div>
            </div>

            {/* Right: Reservation Details Form */}
            <div className="lg:col-span-6 bg-[#21110f] border border-[#44211d] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <h3 className="text-xs uppercase tracking-widest text-amber-300 font-bold">
                Step 2: Salon Schedule & Patron Details
              </h3>

              <form onSubmit={handleBook} className="space-y-4 text-xs">
                {/* Date & Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[#f5ece3] font-medium flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      Date:
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full bg-[#180a09] border border-[#44211d] rounded-xl px-3 py-2 text-amber-100 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[#f5ece3] font-medium flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      Salon Time Slot:
                    </label>
                    <select
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="w-full bg-[#180a09] border border-[#44211d] rounded-xl px-3 py-2 text-amber-100 focus:outline-none focus:border-amber-400 cursor-pointer"
                    >
                      <option value="11:30 AM">11:30 AM Morning Salon</option>
                      <option value="02:00 PM">02:00 PM Afternoon Salon</option>
                      <option value="04:30 PM">04:30 PM High Tea Salon</option>
                      <option value="06:30 PM">06:30 PM Evening Salon</option>
                    </select>
                  </div>
                </div>

                {/* Guests */}
                <div className="space-y-1.5">
                  <label className="text-[#f5ece3] font-medium flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-amber-400" />
                    Guest Count:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[2, 3, 4].map((cnt) => (
                      <button
                        type="button"
                        key={cnt}
                        onClick={() => setGuestCount(cnt)}
                        className={`py-2 rounded-xl font-medium border text-center transition-all ${
                          guestCount === cnt
                            ? 'bg-amber-600/30 text-amber-200 border-amber-500'
                            : 'bg-[#180a09] text-[#8e6857] border-[#361a17]'
                        }`}
                      >
                        {cnt} Patrons
                      </button>
                    ))}
                  </div>
                </div>

                {/* Contact Fields */}
                <div className="space-y-1.5">
                  <label className="text-[#f5ece3] font-medium">Patron Name:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rohini Nambiar"
                    value={patronName}
                    onChange={(e) => setPatronName(e.target.value)}
                    className="w-full bg-[#180a09] border border-[#44211d] rounded-xl px-3 py-2 text-amber-100 placeholder-[#6e483a] focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[#f5ece3] font-medium">Mobile Phone (for Salon Pass SMS):</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98450 00000"
                    value={patronPhone}
                    onChange={(e) => setPatronPhone(e.target.value)}
                    className="w-full bg-[#180a09] border border-[#44211d] rounded-xl px-3 py-2 text-amber-100 placeholder-[#6e483a] focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[#f5ece3] font-medium">Specific Event Details / Flavor Preferences:</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Planning a December wedding with 150 guests, interested in dark chocolate and raspberry..."
                    value={patronNotes}
                    onChange={(e) => setPatronNotes(e.target.value)}
                    className="w-full bg-[#180a09] border border-[#44211d] rounded-xl px-3 py-2 text-amber-100 placeholder-[#6e483a] focus:outline-none focus:border-amber-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-medium text-xs tracking-wide shadow-lg transition-all hover:scale-[1.01] cursor-pointer mt-2"
                >
                  Confirm Salon Pass Reservation
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

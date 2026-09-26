import React, { useState } from 'react';
import { 
  KitchenOrder, 
  FleetVan, 
  PantryItem, 
  BespokeInquiry 
} from '../../types';
import { 
  updateOrderStage, 
  createOrder, 
  updatePantryItemStatus, 
  updateBespokeInquiryStatus 
} from '../../services/supabaseService';
import { 
  ChefHat, 
  Flame, 
  Truck, 
  ThermometerSnowflake, 
  Package, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Plus, 
  Check, 
  Layers, 
  Phone, 
  MapPin,
  RefreshCw,
  Send,
  Sliders,
  ShieldCheck
} from 'lucide-react';

interface KitchenOpsConsoleProps {
  orders: KitchenOrder[];
  setOrders: React.Dispatch<React.SetStateAction<KitchenOrder[]>>;
  fleetVans: FleetVan[];
  setFleetVans: React.Dispatch<React.SetStateAction<FleetVan[]>>;
  pantryItems: PantryItem[];
  setPantryItems: React.Dispatch<React.SetStateAction<PantryItem[]>>;
  bespokeInquiries: BespokeInquiry[];
  setBespokeInquiries: React.Dispatch<React.SetStateAction<BespokeInquiry[]>>;
  onSwitchToBoutique: () => void;
}

export const KitchenOpsConsole: React.FC<KitchenOpsConsoleProps> = ({
  orders,
  setOrders,
  fleetVans,
  setFleetVans,
  pantryItems,
  setPantryItems,
  bespokeInquiries,
  setBespokeInquiries,
  onSwitchToBoutique,
}) => {
  const [activeOpsTab, setActiveOpsTab] = useState<'kanban' | 'fleet' | 'pantry' | 'bespoke-triage'>('kanban');
  const [selectedOrder, setSelectedOrder] = useState<KitchenOrder | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);

  // New manual order form state
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerPhone, setNewCustomerPhone] = useState('');
  const [newConfectionName, setNewConfectionName] = useState('Grand Cru Valrhona Truffle Cake');
  const [newWeight, setNewWeight] = useState('1.0 kg');
  const [newPlaque, setNewPlaque] = useState('');
  const [newSlot, setNewSlot] = useState('04:00 PM - 05:00 PM');
  const [newDestination, setNewDestination] = useState('Indiranagar 100ft Road');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Advance Order Stage in Kanban
  const handleAdvanceStage = async (orderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const currentOrder = orders.find(o => o.id === orderId);
    if (!currentOrder) return;

    let nextStage: KitchenOrder['stage'] = currentOrder.stage;
    let nextNote = currentOrder.stageNote;

    if (currentOrder.stage === 'deck-baking') {
      nextStage = 'decorating';
      nextNote = 'Applying chilled ganache & praline crunch';
      showToast(`Order ${currentOrder.id} moved to Decorating Station`);
    } else if (currentOrder.stage === 'decorating') {
      nextStage = 'qc-chill';
      nextNote = 'Stabilizing at 3.8°C blast chiller';
      showToast(`Order ${currentOrder.id} moved to QC & Thermal Chill`);
    } else if (currentOrder.stage === 'qc-chill') {
      nextStage = 'ready-dispatch';
      nextNote = 'Secured inside van thermal carrier';
      showToast(`Order ${currentOrder.id} moved to Ready for Chilled Dispatch`);
    } else if (currentOrder.stage === 'ready-dispatch') {
      showToast(`Order ${currentOrder.id} dispatched with ${currentOrder.assignedVan}`);
      return;
    }

    // Optimistic local UI update
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, stage: nextStage, stageNote: nextNote } : ord))
    );

    // Supabase update
    await updateOrderStage(orderId, nextStage, nextNote);
  };

  // Reorder pantry item
  const handleReorderPantry = async (itemName: string) => {
    setPantryItems((prev) =>
      prev.map((item) =>
        item.name === itemName ? { ...item, status: 'reorder-sent' } : item
      )
    );
    showToast(`Purchase order sent to supplier for ${itemName}`);
    await updatePantryItemStatus(itemName, 'reorder-sent');
  };

  // Approve Bespoke Inquiry
  const handleApproveInquiry = async (inquiryId: string) => {
    setBespokeInquiries((prev) =>
      prev.map((inq) =>
        inq.id === inquiryId ? { ...inq, status: 'quote-sent' } : inq
      )
    );
    showToast(`Formal quote & tier dossier dispatched to client`);
    await updateBespokeInquiryStatus(inquiryId, 'quote-sent');
  };

  const handleCreateManualOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomerName) return;

    const newOrder: KitchenOrder = {
      id: `ORD-${Math.floor(8940 + Math.random() * 50)}`,
      time: 'Just now',
      tag: 'Walk-in Atelier',
      customerName: newCustomerName,
      customerPhone: newCustomerPhone || '+91 98000 00000',
      confectionName: newConfectionName,
      confectionSpecs: [`${newWeight} Weight`, 'Fresh Hearth Bake'],
      netWeight: newWeight,
      plaqueInscription: newPlaque || 'Joyeux Anniversaire',
      slotTime: newSlot,
      destination: newDestination,
      assignedVan: 'Chilled Van #01 (KA 01 EK 4410)',
      driverName: 'Ramesh K.',
      stage: 'deck-baking',
      stageNote: 'Fired in Deck Oven B, baking cycle initiated.'
    };

    setOrders((prev) => [newOrder, ...prev]);
    setIsNewOrderModalOpen(false);
    showToast(`New order ${newOrder.id} logged to Deck Baking stage`);

    // Sync to Supabase
    await createOrder(newOrder, 1850);
  };

  // Stage columns
  const stages: {
    key: KitchenOrder['stage'];
    label: string;
    icon: any;
    color: string;
    border: string;
    bgBadge: string;
  }[] = [
    {
      key: 'deck-baking',
      label: 'Deck Baking Hearth',
      icon: Flame,
      color: 'text-amber-400',
      border: 'border-amber-500/40',
      bgBadge: 'bg-amber-950/60 text-amber-300',
    },
    {
      key: 'decorating',
      label: 'Decorating & Praline',
      icon: Sparkles,
      color: 'text-purple-400',
      border: 'border-purple-500/40',
      bgBadge: 'bg-purple-950/60 text-purple-300',
    },
    {
      key: 'qc-chill',
      label: 'QC & Thermal Chill',
      icon: ThermometerSnowflake,
      color: 'text-cyan-400',
      border: 'border-cyan-500/40',
      bgBadge: 'bg-cyan-950/60 text-cyan-300',
    },
    {
      key: 'ready-dispatch',
      label: 'Ready for Chilled Dispatch',
      icon: Truck,
      color: 'text-emerald-400',
      border: 'border-emerald-500/40',
      bgBadge: 'bg-emerald-950/60 text-emerald-300',
    },
  ];

  return (
    <div className="min-h-screen bg-[#130706] text-[#f7efe6] pb-16">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#291411] border border-amber-500 text-amber-200 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-xs animate-slide-up">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hub Master Header */}
      <div className="bg-[#1e0d0b] border-b border-[#3b1c18] px-4 sm:px-6 lg:px-8 py-5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              <h1 className="font-serif text-xl sm:text-2xl font-black text-[#faeedd] tracking-wide flex items-center gap-2">
                KANAN KITCHEN OPS
                <span className="text-xs font-sans font-normal tracking-widest px-2 py-0.5 uppercase bg-red-950/70 text-red-300 rounded border border-red-500/30">
                  Indiranagar Central Hub
                </span>
              </h1>
            </div>
            <p className="text-xs text-[#a88273]">
              Active Hearth Pipeline • Cold-Chain Van Telemetry • Live Deck Monitoring
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={() => setIsNewOrderModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Manual Order</span>
            </button>

            <button
              onClick={onSwitchToBoutique}
              className="px-3.5 py-2 rounded-xl bg-[#2b1513] hover:bg-[#3d1d1a] border border-[#4d2520] text-amber-300 font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Back to Patron Boutique</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Live Hearth Telemetry Gauge Strip */}
      <div className="bg-[#180908] border-b border-[#2e1512] px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-[#cb9e8a]">
            <div className="flex items-center gap-2">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Deck A (Tarts): <strong className="text-white">185°C</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Deck B (Genoise): <strong className="text-white">165°C</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Deck C (Viennoiserie): <strong className="text-white">175°C</strong></span>
            </div>
            <div className="flex items-center gap-2 text-cyan-300">
              <ThermometerSnowflake className="w-3.5 h-3.5" />
              <span>Blast Chiller: <strong className="text-white">-18.2°C</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-[#916b5a]">
            <span>System Telemetry: Synchronized</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          </div>
        </div>
      </div>

      {/* Main Console Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Navigation Tabs for Kitchen Ops */}
        <div className="flex items-center gap-2 border-b border-[#301614] pb-3 overflow-x-auto">
          {[
            { id: 'kanban', label: `Active Bake Board (${orders.length})`, icon: Flame },
            { id: 'fleet', label: `Cold-Fleet Telemetry (${fleetVans.length} Vans)`, icon: Truck },
            { id: 'pantry', label: 'Raw Sourcing & Pantry Stocks', icon: Package },
            { id: 'bespoke-triage', label: `Bespoke Inquiries (${bespokeInquiries.length})`, icon: Sparkles },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeOpsTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveOpsTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-600 text-white shadow-md border border-amber-500'
                    : 'bg-[#200f0d] text-[#bca091] hover:text-white hover:bg-[#2c1513] border border-[#381a17]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: KANBAN BAKE PIPELINE */}
        {activeOpsTab === 'kanban' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
              {stages.map((stage) => {
                const stageOrders = orders.filter((o) => o.stage === stage.key);
                const StageIcon = stage.icon;

                return (
                  <div
                    key={stage.key}
                    className="bg-[#1b0d0b] border border-[#331815] rounded-2xl flex flex-col h-full overflow-hidden shadow-lg"
                  >
                    {/* Column Header */}
                    <div className="p-3.5 border-b border-[#2d1411] bg-[#22100e] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <StageIcon className={`w-4 h-4 ${stage.color}`} />
                        <h3 className="font-serif text-xs font-bold text-[#faeedd]">
                          {stage.label}
                        </h3>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${stage.bgBadge}`}>
                        {stageOrders.length}
                      </span>
                    </div>

                    {/* Orders Column Body */}
                    <div className="p-3 space-y-3 flex-1 min-h-[420px]">
                      {stageOrders.length === 0 ? (
                        <div className="h-40 flex items-center justify-center text-center text-xs text-[#7d5648] border border-dashed border-[#331815] rounded-xl p-4">
                          <span>No confections currently in this stage.</span>
                        </div>
                      ) : (
                        stageOrders.map((ord) => (
                          <div
                            key={ord.id}
                            onClick={() => setSelectedOrder(ord)}
                            className="bg-[#241210] border border-[#3d1d19] hover:border-amber-400/50 rounded-xl p-3.5 text-xs space-y-2.5 transition-all shadow-sm hover:shadow-md cursor-pointer group"
                          >
                            {/* Card Top: ID and Tag */}
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-amber-300 font-mono text-[11px]">
                                {ord.id}
                              </span>
                              {ord.tag && (
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                  {ord.tag}
                                </span>
                              )}
                            </div>

                            {/* Cake Name & Specs */}
                            <div>
                              <h4 className="font-serif font-bold text-sm text-[#f5ece3] group-hover:text-amber-200 transition-colors">
                                {ord.confectionName}
                              </h4>
                              <p className="text-[11px] text-[#a88273] mt-0.5">
                                {ord.confectionSpecs.join(' • ')}
                              </p>
                            </div>

                            {/* Plaque Message */}
                            {ord.plaqueInscription && (
                              <div className="p-1.5 rounded bg-[#190a09] border border-[#331613] text-[10px] text-amber-200 italic">
                                Plaque: "{ord.plaqueInscription}"
                              </div>
                            )}

                            {/* Customer & Slot */}
                            <div className="pt-1.5 border-t border-[#311613] flex items-center justify-between text-[11px] text-[#8e6857]">
                              <span>{ord.customerName}</span>
                              <span className="text-[#debba9] font-medium">{ord.slotTime}</span>
                            </div>

                            {/* Assigned Van & Note */}
                            <div className="flex items-center justify-between text-[10px] text-cyan-300 bg-[#160b0a] p-1.5 rounded">
                              <span className="truncate">{ord.assignedVan}</span>
                            </div>

                            {/* Action Button: Advance to Next Stage */}
                            {stage.key !== 'ready-dispatch' ? (
                              <button
                                onClick={(e) => handleAdvanceStage(ord.id, e)}
                                className="w-full py-1.5 rounded-lg bg-[#2e1714] hover:bg-amber-600 hover:text-white text-[#d4af94] text-[11px] font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                <span>Advance to Next Stage</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            ) : (
                              <div className="w-full py-1 text-center text-emerald-400 text-[10px] font-semibold flex items-center justify-center gap-1">
                                <Check className="w-3 h-3" />
                                <span>Awaiting Carrier Handoff</span>
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: COLD-FLEET TELEMETRY */}
        {activeOpsTab === 'fleet' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {fleetVans.map((van) => (
                <div
                  key={van.id}
                  className="bg-[#1d0e0c] border border-[#381c18] rounded-3xl p-6 space-y-5 shadow-xl relative overflow-hidden"
                >
                  {/* Van Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                        {van.specialty}
                      </span>
                      <h3 className="font-serif text-lg font-bold text-[#f5ece3] mt-0.5">
                        {van.number}
                      </h3>
                      <p className="text-xs text-[#a98271]">
                        Driver: {van.driverName} ({van.driverPhone})
                      </p>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      van.status === 'en-route'
                        ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 animate-pulse'
                        : 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                    }`}>
                      {van.status === 'en-route' ? 'En-Route' : 'Docked at Bay'}
                    </span>
                  </div>

                  {/* Telemetry Sensor Gauges */}
                  <div className="grid grid-cols-2 gap-3 bg-[#140807] border border-[#2b1411] rounded-2xl p-4 text-xs">
                    <div>
                      <span className="text-[#8e6857] block">Chamber Temp:</span>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span className="text-xl font-bold text-cyan-300 font-mono">{van.temperature}°C</span>
                        <span className="text-[10px] text-emerald-400">Optimal</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[#8e6857] block">Humidity:</span>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span className="text-xl font-bold text-[#f5ece3] font-mono">{van.humidity}%</span>
                        <span className="text-[10px] text-amber-400">Stable</span>
                      </div>
                    </div>

                    <div className="col-span-2 pt-2 border-t border-[#291310] flex justify-between text-[11px]">
                      <span className="text-[#8e6857]">Suspension Damping:</span>
                      <span className="text-emerald-300 font-semibold">{van.vibrationStatus}</span>
                    </div>

                    <div className="col-span-2 flex justify-between text-[11px]">
                      <span className="text-[#8e6857]">Fleet Speed:</span>
                      <span className="text-[#debba9]">{van.speed}</span>
                    </div>
                  </div>

                  {/* Location & ETA */}
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-[#debba9]">
                      <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{van.currentLocation}</span>
                    </div>
                    <div className="flex items-center gap-2 text-amber-300 font-semibold">
                      <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{van.eta}</span>
                    </div>
                  </div>

                  {/* Onboard Payload */}
                  <div className="p-3 rounded-xl bg-[#241311] border border-[#3b1d19] text-xs space-y-1">
                    <span className="text-[#8e6857] block text-[10px] uppercase font-bold">Onboard Payload:</span>
                    <p className="text-[#debba9] font-medium">{van.orderPayload}</p>
                  </div>

                  {/* Progress Bar */}
                  {van.status === 'en-route' && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-[#8e6857]">
                        <span>Route Progress</span>
                        <span>{van.percentCompleted}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-[#140807] overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-cyan-400 rounded-full"
                          style={{ width: `${van.percentCompleted}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: PANTRY RAW INGREDIENTS TELEMETRY */}
        {activeOpsTab === 'pantry' && (
          <div className="space-y-6">
            <div className="bg-[#1c0d0c] border border-[#381c18] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#301614] pb-4">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#faeedd]">
                    Raw Inventory & Sourcing Reserve Telemetry
                  </h3>
                  <p className="text-xs text-[#a98271]">
                    Real-time pantry weighing sensors with threshold reorder triggers.
                  </p>
                </div>
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  All Ingredients 100% Traceable
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pantryItems.map((item) => (
                  <div
                    key={item.name}
                    className="p-4 rounded-2xl bg-[#231210] border border-[#3b1d19] space-y-3 text-xs"
                  >
                    <div className="flex items-start justify-between">
                      <h4 className="font-serif font-bold text-sm text-[#f5ece3]">{item.name}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        item.status === 'healthy' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' :
                        item.status === 'near-warning' ? 'bg-amber-950 text-amber-300 border border-amber-500/40' :
                        'bg-rose-950 text-rose-300 border border-rose-500/40'
                      }`}>
                        {item.status === 'healthy' ? 'Healthy Reserve' :
                         item.status === 'near-warning' ? 'Near Reorder Level' : 'Reorder Dispatched'}
                      </span>
                    </div>

                    <div className="flex justify-between text-xs pt-1 border-t border-[#311613]">
                      <span className="text-[#8e6857]">Current Reserve:</span>
                      <span className="text-amber-300 font-bold font-mono text-sm">{item.stock}</span>
                    </div>

                    <div className="flex justify-between text-xs">
                      <span className="text-[#8e6857]">Safe Floor Threshold:</span>
                      <span className="text-[#debba9]">{item.threshold}</span>
                    </div>

                    <button
                      onClick={() => handleReorderPantry(item.name)}
                      disabled={item.status === 'reorder-sent'}
                      className={`w-full py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-center gap-1.5 ${
                        item.status === 'reorder-sent'
                          ? 'bg-[#180a09] text-[#7d5648] border border-[#2d1411] cursor-not-allowed'
                          : 'bg-amber-600/30 hover:bg-amber-600 text-amber-200 hover:text-white border border-amber-500/40 cursor-pointer'
                      }`}
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>{item.status === 'reorder-sent' ? 'Supplier PO Logged' : 'Trigger Restock PO'}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: BESPOKE INQUIRIES TRIAGE */}
        {activeOpsTab === 'bespoke-triage' && (
          <div className="space-y-6">
            <div className="bg-[#1c0d0c] border border-[#381c18] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="border-b border-[#301614] pb-4">
                <h3 className="font-serif text-lg font-bold text-[#faeedd]">
                  Inbound Bespoke Tier Commissions & Wedding Triage
                </h3>
                <p className="text-xs text-[#a98271]">
                  Review client architectural submissions, tier breakdowns, and approve formatted chef quote tariffs.
                </p>
              </div>

              <div className="space-y-6">
                {bespokeInquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className="p-6 rounded-2xl bg-[#22110f] border border-[#3d1d19] space-y-5 text-xs"
                  >
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#301614] pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-amber-300 font-bold">{inq.id}</span>
                          <span className="text-[#8e6857]">• {inq.submittedTime}</span>
                        </div>
                        <h4 className="font-serif text-base font-bold text-[#faeedd] mt-1">
                          {inq.clientName} — {inq.eventType}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          inq.status === 'quote-sent'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                            : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                        }`}>
                          {inq.status === 'quote-sent' ? 'Quote Sent to Patron' : 'Awaiting Chef Triage'}
                        </span>
                      </div>
                    </div>

                    {/* Specs Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-[#180a09] border border-[#2d1411]">
                        <span className="text-[#8e6857] block">Event Date:</span>
                        <span className="text-white font-medium">{inq.eventDate}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-[#180a09] border border-[#2d1411]">
                        <span className="text-[#8e6857] block">Guest Scale:</span>
                        <span className="text-white font-medium">{inq.guestScale}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-[#180a09] border border-[#2d1411]">
                        <span className="text-[#8e6857] block">Dietary Standard:</span>
                        <span className="text-emerald-400 font-medium">{inq.dietaryStandard}</span>
                      </div>
                    </div>

                    {/* Tier Architecture */}
                    <div className="space-y-2">
                      <span className="text-[#8e6857] font-semibold uppercase tracking-wider text-[10px]">
                        Architectural Tier Breakdown:
                      </span>
                      <div className="space-y-1.5">
                        {inq.tierArchitecture.map((t, idx) => (
                          <div key={idx} className="p-2.5 rounded-lg bg-[#190a09] border border-[#301614] flex justify-between items-center text-xs">
                            <span className="font-bold text-[#debba9]">{t.tier}:</span>
                            <span className="text-[#f5ece3]">{t.description}</span>
                            <span className="text-amber-300 font-mono">{t.weight}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Exterior Finish */}
                    <div className="p-3 rounded-xl bg-[#180a09] border border-[#2d1411] space-y-1">
                      <span className="text-[#8e6857] block text-[10px] uppercase font-bold">Exterior Finish & Sugarcraft:</span>
                      <p className="text-white">{inq.exteriorFinish}</p>
                    </div>

                    {/* Tariff Calculator */}
                    <div className="p-4 rounded-xl bg-[#150706] border border-[#381c18] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1 text-xs text-[#a98271]">
                        <div className="flex gap-4">
                          <span>Base: ₹{inq.quoteTariff.baseStructure}</span>
                          <span>Sugarcraft: ₹{inq.quoteTariff.sugarwork}</span>
                          <span>Gold Leaf: ₹{inq.quoteTariff.goldLeafing}</span>
                          <span>Logistics: ₹{inq.quoteTariff.refrigeratedLogistics}</span>
                        </div>
                        <span className="text-amber-300 font-serif font-bold text-base block">
                          Total Recommended Quote: ₹{inq.quoteTariff.recommendedTotal}
                        </span>
                      </div>

                      {inq.status !== 'quote-sent' && (
                        <button
                          onClick={() => handleApproveInquiry(inq.id)}
                          className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs flex items-center gap-2 transition-colors cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Approve & Dispatch Quote</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Manual Order Creation Modal */}
      {isNewOrderModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1c0d0b] border border-[#44211d] rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 text-xs text-[#f7efe6]">
            <h3 className="font-serif text-lg font-bold text-[#faeedd]">
              Log Manual Hearth Order (Walk-In / Direct Call)
            </h3>

            <form onSubmit={handleCreateManualOrder} className="space-y-3">
              <div>
                <label className="text-[#a98271] block mb-1">Patron Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Radhika Menon"
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                  className="w-full bg-[#140807] border border-[#3b1c18] rounded-xl px-3 py-2 text-amber-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-[#a98271] block mb-1">Patron Mobile:</label>
                <input
                  type="tel"
                  placeholder="+91 98450 11223"
                  value={newCustomerPhone}
                  onChange={(e) => setNewCustomerPhone(e.target.value)}
                  className="w-full bg-[#140807] border border-[#3b1c18] rounded-xl px-3 py-2 text-amber-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[#a98271] block mb-1">Confection:</label>
                  <select
                    value={newConfectionName}
                    onChange={(e) => setNewConfectionName(e.target.value)}
                    className="w-full bg-[#140807] border border-[#3b1c18] rounded-xl px-3 py-2 text-amber-100 focus:outline-none focus:border-amber-400 cursor-pointer"
                  >
                    <option value="Grand Cru Valrhona Truffle Cake">Valrhona Truffle Cake</option>
                    <option value="Roasted Hazelnut Gianduja Truffle">Hazelnut Gianduja Truffle</option>
                    <option value="Imperial Raspberry & Champagne Multi-Tier">Imperial Raspberry Tier</option>
                    <option value="Sicilian Pistachio & Wild Berry Tart">Sicilian Pistachio Tart</option>
                    <option value="Caramelized Basque Burnt Cheesecake">Basque Burnt Cheesecake</option>
                  </select>
                </div>

                <div>
                  <label className="text-[#a98271] block mb-1">Portion Weight:</label>
                  <input
                    type="text"
                    value={newWeight}
                    onChange={(e) => setNewWeight(e.target.value)}
                    className="w-full bg-[#140807] border border-[#3b1c18] rounded-xl px-3 py-2 text-amber-100 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#a98271] block mb-1">Plaque Inscription:</label>
                <input
                  type="text"
                  placeholder="e.g. Happy Birthday Vikram"
                  value={newPlaque}
                  onChange={(e) => setNewPlaque(e.target.value)}
                  className="w-full bg-[#140807] border border-[#3b1c18] rounded-xl px-3 py-2 text-amber-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-[#a98271] block mb-1">Destination Address:</label>
                <input
                  type="text"
                  value={newDestination}
                  onChange={(e) => setNewDestination(e.target.value)}
                  className="w-full bg-[#140807] border border-[#3b1c18] rounded-xl px-3 py-2 text-amber-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#311613]">
                <button
                  type="button"
                  onClick={() => setIsNewOrderModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-[#8e6857] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold cursor-pointer"
                >
                  Enqueue to Deck Baking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Selected Order Detailed Drawer */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1c0d0b] border border-[#44211d] rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 text-xs text-[#f7efe6]">
            <div className="flex items-center justify-between border-b border-[#301614] pb-3">
              <div>
                <span className="font-mono text-amber-400 font-bold">{selectedOrder.id}</span>
                <h3 className="font-serif text-base font-bold text-[#faeedd] mt-0.5">
                  {selectedOrder.confectionName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-7 h-7 rounded-full bg-[#2a1310] flex items-center justify-center text-[#debba9]"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#8e6857]">Customer:</span>
                <span className="text-white font-medium">{selectedOrder.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8e6857]">Phone:</span>
                <span className="text-amber-200">{selectedOrder.customerPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8e6857]">Delivery Slot:</span>
                <span className="text-[#debba9]">{selectedOrder.slotTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8e6857]">Destination:</span>
                <span className="text-white">{selectedOrder.destination}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8e6857]">Assigned Van:</span>
                <span className="text-cyan-300">{selectedOrder.assignedVan}</span>
              </div>
              {selectedOrder.plaqueInscription && (
                <div className="p-2 rounded bg-[#160807] border border-[#2d1411] text-amber-300 italic">
                  Plaque: "{selectedOrder.plaqueInscription}"
                </div>
              )}
              {selectedOrder.stageNote && (
                <div className="p-2 rounded bg-[#160807] border border-[#2d1411] text-[#debba9]">
                  Hearth Note: {selectedOrder.stageNote}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-[#311613]">
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full py-2.5 rounded-xl bg-[#291310] hover:bg-[#3d1a16] text-[#debba9] font-medium"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

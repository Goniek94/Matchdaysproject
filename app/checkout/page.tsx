"use client";

import { Suspense, useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Shield, Truck, Lock, ArrowLeft, CheckCircle, AlertCircle,
  MapPin, Package, Zap, Building2, Clock, Edit2, CreditCard,
  Landmark, Wallet, ChevronDown,
} from "lucide-react";
import { useCart } from "@/lib/CartContext";
import { useAuth } from "@/lib/context/AuthContext";
import { buyNow } from "@/lib/api/auctions.api";
import { getMyAddress } from "@/lib/api/users";

// ─── Delivery options ─────────────────────────────────────────────────────────

type DeliveryOption = {
  id: string;
  label: string;
  sublabel: string;
  icon: React.ReactNode;
  price: number;
  days: string;
};

function getDeliveryOptions(sellerCountry: string, buyerCountry: string): DeliveryOption[] {
  const same = sellerCountry.toLowerCase() === buyerCountry.toLowerCase();
  const isEU = ["poland","germany","france","italy","spain","netherlands","belgium","austria","czechia","slovakia"].includes(buyerCountry.toLowerCase());
  const isUK = ["uk","united kingdom"].includes(buyerCountry.toLowerCase());

  if (same && sellerCountry.toLowerCase() === "poland") return [
    { id: "paczkomat", label: "InPost Locker",     sublabel: "Pick up at selected locker",         icon: <Zap size={16}/>,       price: 2.99,  days: "1–2 days" },
    { id: "punkt",     label: "Pickup Point",       sublabel: "DPD Pickup, Orlen, Żabka & more",   icon: <Building2 size={16}/>, price: 1.99,  days: "2–3 days" },
    { id: "kurier",    label: "Home Delivery",      sublabel: "DPD / DHL – delivery to your door", icon: <Truck size={16}/>,     price: 4.99,  days: "1–2 days" },
    { id: "ekspres",   label: "Express (next day)", sublabel: "Guaranteed next-day delivery",       icon: <Clock size={16}/>,     price: 8.99,  days: "Next day" },
  ];
  if (isEU) return [
    { id: "standard_eu", label: "Standard EU Courier", sublabel: "DHL / GLS – tracked",             icon: <Truck size={16}/>, price: 9.99,  days: "3–5 days" },
    { id: "express_eu",  label: "Express EU Courier",  sublabel: "DHL Express – tracked & insured", icon: <Zap size={16}/>,   price: 18.99, days: "1–2 days" },
  ];
  if (isUK) return [
    { id: "uk_standard", label: "UK Standard Courier", sublabel: "Royal Mail / DHL – tracked", icon: <Truck size={16}/>, price: 14.99, days: "4–7 days" },
    { id: "uk_express",  label: "UK Express Courier",  sublabel: "DHL Express",                icon: <Zap size={16}/>,   price: 24.99, days: "2–3 days" },
  ];
  return [
    { id: "intl_standard", label: "International Shipping", sublabel: "Tracked international shipping", icon: <Package size={16}/>, price: 19.99, days: "7–14 days" },
    { id: "intl_express",  label: "International Express",  sublabel: "DHL Express Worldwide",          icon: <Zap size={16}/>,     price: 34.99, days: "3–5 days" },
  ];
}

// ─── Address card ─────────────────────────────────────────────────────────────

function AddressCard({ addr, name, email }: { addr: any; name: string; email: string }) {
  if (!addr) return (
    <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-sm text-amber-800">
      <AlertCircle size={16} className="flex-shrink-0" />
      <span>No saved address. <Link href="/settings" className="font-bold underline">Add address in settings</Link></span>
    </div>
  );
  return (
    <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 bg-black rounded-xl flex items-center justify-center flex-shrink-0">
            <MapPin size={16} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-gray-900">{name}</p>
            <p className="text-sm text-gray-500 mt-0.5">{addr.street}</p>
            <p className="text-sm text-gray-500">{addr.postalCode} {addr.city}, {addr.country}</p>
            <p className="text-sm text-gray-400 mt-0.5">{email}</p>
          </div>
        </div>
        <Link href="/settings" className="flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-black transition-colors flex-shrink-0">
          <Edit2 size={13} /> Edit
        </Link>
      </div>
    </div>
  );
}

// ─── Seller delivery section ──────────────────────────────────────────────────

function SellerDeliverySection({
  sellerName, items, options, selectedId, onSelect, buyerCountry, sellerCountry,
}: {
  sellerName: string;
  items: any[];
  options: DeliveryOption[];
  selectedId: string;
  onSelect: (id: string) => void;
  buyerCountry: string;
  sellerCountry: string;
}) {
  const [open, setOpen] = useState(true);
  const active = options.find(o => o.id === selectedId);

  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden">
      {/* Seller header */}
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-gray-800 flex items-center justify-center text-white text-xs font-bold">
            {sellerName[0]?.toUpperCase()}
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-gray-900">{sellerName}</p>
            <p className="text-xs text-gray-400">{items.length} {items.length === 1 ? "item" : "items"} · {sellerCountry} → {buyerCountry}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {active && !open && (
            <span className="text-xs font-semibold text-gray-600 bg-white border border-gray-200 px-2 py-1 rounded-full">
              {active.label} · €{active.price.toFixed(2)}
            </span>
          )}
          <ChevronDown size={16} className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
        </div>
      </button>

      {/* Items preview */}
      {open && (
        <div className="px-4 py-3 border-b border-gray-100 flex gap-2 overflow-x-auto">
          {items.map(item => (
            <div key={item.id} className="flex items-center gap-2 flex-shrink-0 bg-white border border-gray-100 rounded-xl p-2 pr-3">
              <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                <Image src={item.image || "/images/placeholder.jpg"} alt={item.title} fill className="object-cover" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-800 max-w-[120px] truncate">{item.title}</p>
                <p className="text-xs font-black text-gray-900">€{item.price.toLocaleString("de-DE", { minimumFractionDigits: 2 })}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delivery options */}
      {open && (
        <div className="p-3 space-y-2">
          {options.map(opt => {
            const sel = selectedId === opt.id;
            return (
              <button key={opt.id} type="button" onClick={() => onSelect(opt.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${
                  sel ? "border-black bg-black text-white" : "border-gray-200 bg-white hover:border-gray-400 text-gray-900"
                }`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${sel ? "bg-white/20" : "bg-gray-100"}`}>
                  <span className={sel ? "text-white" : "text-gray-500"}>{opt.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm">{opt.label}</p>
                  <p className={`text-xs ${sel ? "text-white/70" : "text-gray-500"}`}>{opt.sublabel} · <span className="font-semibold">{opt.days}</span></p>
                </div>
                <p className="font-black text-sm flex-shrink-0">€{opt.price.toFixed(2)}</p>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Payment card ─────────────────────────────────────────────────────────────

type PaymentMethod = "card" | "paypal" | "bank";

function PaymentCard({
  method, selected, onSelect, cardNumber, setCardNumber, cardExpiry, setCardExpiry, cardCvc, setCardCvc,
}: {
  method: PaymentMethod; selected: boolean; onSelect: () => void;
  cardNumber: string; setCardNumber: (v: string) => void;
  cardExpiry: string; setCardExpiry: (v: string) => void;
  cardCvc: string; setCardCvc: (v: string) => void;
}) {
  const meta: Record<PaymentMethod, { label: string; sublabel: string; icon: React.ReactNode }> = {
    card:   { label: "Credit / Debit Card", sublabel: "Visa, Mastercard, Amex",        icon: <CreditCard size={18}/> },
    paypal: { label: "PayPal",              sublabel: "Pay with your PayPal account",   icon: <Wallet size={18}/> },
    bank:   { label: "Bank Transfer",       sublabel: "Manual transfer – 1–2 days delay", icon: <Landmark size={18}/> },
  };
  const m = meta[method];

  const handleCardNumber = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 16);
    setCardNumber(d.replace(/(.{4})/g, "$1 ").trim());
  };
  const handleExpiry = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    setCardExpiry(d.length > 2 ? `${d.slice(0,2)}/${d.slice(2)}` : d);
  };

  return (
    <div className={`rounded-2xl border-2 overflow-hidden transition-all ${selected ? "border-black" : "border-gray-200"}`}>
      <button type="button" onClick={onSelect}
        className={`w-full flex items-center gap-4 p-4 text-left transition-colors ${selected ? "bg-black text-white" : "bg-white text-gray-900 hover:bg-gray-50"}`}>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${selected ? "bg-white/20" : "bg-gray-100"}`}>
          <span className={selected ? "text-white" : "text-gray-600"}>{m.icon}</span>
        </div>
        <div className="flex-1">
          <p className="font-bold text-sm">{m.label}</p>
          <p className={`text-xs mt-0.5 ${selected ? "text-white/70" : "text-gray-500"}`}>{m.sublabel}</p>
        </div>
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selected ? "border-white" : "border-gray-300"}`}>
          {selected && <div className="w-2.5 h-2.5 rounded-full bg-white"/>}
        </div>
      </button>

      {selected && method === "card" && (
        <div className="p-4 bg-gray-50 space-y-3 border-t border-gray-100">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Card number</label>
            <input value={cardNumber} onChange={e => handleCardNumber(e.target.value)} placeholder="0000 0000 0000 0000"
              className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 placeholder:text-gray-300" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Expiry</label>
              <input value={cardExpiry} onChange={e => handleExpiry(e.target.value)} placeholder="MM/YY"
                className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 placeholder:text-gray-300" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">CVC</label>
              <input value={cardCvc} onChange={e => setCardCvc(e.target.value.replace(/\D/g,"").slice(0,4))} placeholder="•••" type="password"
                className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 placeholder:text-gray-300" />
            </div>
          </div>
          <p className="text-[11px] text-gray-400 flex items-center gap-1"><Lock size={10}/> Your card details are encrypted and never stored.</p>
        </div>
      )}
      {selected && method === "paypal" && (
        <div className="p-4 bg-gray-50 border-t border-gray-100">
          <p className="text-sm text-gray-500">You will be redirected to PayPal to complete the payment securely.</p>
        </div>
      )}
      {selected && method === "bank" && (
        <div className="p-4 bg-gray-50 border-t border-gray-100 space-y-1.5">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Transfer details</p>
          <p className="text-sm text-gray-700">Account: <span className="font-mono font-bold">PL12 3456 7890 1234 5678 9012 3456</span></p>
          <p className="text-sm text-gray-500">Title: your order ID (sent after placing order)</p>
          <p className="text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 mt-2">Order will be confirmed once payment is received (1–2 business days).</p>
        </div>
      )}
    </div>
  );
}

// ─── Main checkout ────────────────────────────────────────────────────────────

function CheckoutContent() {
  const router = useRouter();
  const { items, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();

  const [address, setAddress]         = useState<any>(null);
  const [loadingAddr, setLoadingAddr] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [cardNumber, setCardNumber]   = useState("");
  const [cardExpiry, setCardExpiry]   = useState("");
  const [cardCvc, setCardCvc]         = useState("");
  const [submitting, setSubmitting]   = useState(false);
  const [result, setResult]           = useState<"success" | "error" | null>(null);
  const [errorMsg, setErrorMsg]       = useState("");

  const buyerCountry = address?.country ?? "Poland";

  // Group items by seller
  const sellerGroups = useMemo(() => {
    const groups: Record<string, { sellerName: string; sellerCountry: string; items: typeof items }> = {};
    for (const item of items) {
      const key = item.seller.name;
      if (!groups[key]) groups[key] = { sellerName: item.seller.name, sellerCountry: (item as any).sellerCountry ?? "Poland", items: [] };
      groups[key].items.push(item);
    }
    return Object.values(groups);
  }, [items]);

  // Per-seller delivery selection: Record<sellerName, deliveryOptionId>
  const [selectedDeliveries, setSelectedDeliveries] = useState<Record<string, string>>({});

  // Auto-select cheapest option for each seller group
  useEffect(() => {
    setSelectedDeliveries(prev => {
      const next = { ...prev };
      for (const group of sellerGroups) {
        if (!next[group.sellerName]) {
          const opts = getDeliveryOptions(group.sellerCountry, buyerCountry);
          if (opts.length > 0) next[group.sellerName] = opts[0].id;
        }
      }
      return next;
    });
  }, [sellerGroups, buyerCountry]);

  useEffect(() => {
    if (!isAuthenticated) { setLoadingAddr(false); return; }
    getMyAddress()
      .then((res: any) => { if (res?.address) setAddress(res.address); })
      .catch(() => {})
      .finally(() => setLoadingAddr(false));
  }, [isAuthenticated]);

  // Compute total shipping across all seller groups
  const shippingTotal = sellerGroups.reduce((sum, group) => {
    const opts = getDeliveryOptions(group.sellerCountry, buyerCountry);
    const sel = opts.find(o => o.id === selectedDeliveries[group.sellerName]);
    return sum + (sel?.price ?? 0);
  }, 0);

  const itemsTotal = items.reduce((sum, i) => sum + i.price, 0);
  const totalPrice = itemsTotal + shippingTotal;

  const userName  = `${(user as any)?.name ?? ""} ${(user as any)?.lastName ?? ""}`.trim();
  const userEmail = (user as any)?.email ?? "";

  const allDeliveriesSelected = sellerGroups.every(g => selectedDeliveries[g.sellerName]);

  const handleSubmit = async () => {
    if (!isAuthenticated)      { setErrorMsg("You must be logged in.");              setResult("error"); return; }
    if (!allDeliveriesSelected){ setErrorMsg("Please select a delivery method for each seller."); setResult("error"); return; }
    if (items.length === 0)    { setErrorMsg("Your cart is empty.");                setResult("error"); return; }
    if (paymentMethod === "card" && (!cardNumber || !cardExpiry || !cardCvc)) {
      setErrorMsg("Please fill in all card details."); setResult("error"); return;
    }

    try {
      setSubmitting(true);
      setResult(null);
      const errors: string[] = [];
      for (const item of items) {
        try {
          const res = await buyNow(item.id);
          if (!res.success) errors.push(`${item.title}: ${res.message ?? "Purchase failed"}`);
        } catch (itemErr: any) {
          errors.push(`${item.title}: ${itemErr?.message || itemErr?.error || "Purchase failed"}`);
        }
      }
      if (errors.length > 0) { setErrorMsg(errors.join(" · ")); setResult("error"); return; }
      clearCart();
      setResult("success");
      setTimeout(() => router.push("/history"), 3000);
    } catch (err: unknown) {
      const e = err as any;
      setErrorMsg(e?.message || e?.error || "Unexpected error");
      setResult("error");
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0 && result !== "success") return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <p className="text-4xl mb-3">🛒</p>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <Link href="/auctions" className="text-sm text-black underline underline-offset-2">Browse auctions</Link>
      </div>
    </div>
  );

  if (result === "success") return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-12 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <CheckCircle size={32} className="text-emerald-600" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">
          {items.length > 1 ? `${items.length} orders placed!` : "Order placed!"}
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          Your purchase is confirmed. You can track it in your{" "}
          <Link href="/history" className="text-black font-bold underline">transaction history</Link>.
        </p>
        <p className="text-xs text-gray-400">Redirecting in 3 seconds…</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

        <Link href="/cart" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black mb-8 transition-colors font-medium">
          <ArrowLeft size={16} /> Back to cart
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* ── Left: steps ──────────────────────────────────── */}
          <div className="lg:col-span-3 space-y-5">

            {result === "error" && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm">
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5" /> <span>{errorMsg}</span>
              </div>
            )}

            {/* Step 1 — Delivery Address */}
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-7 h-7 bg-black text-white text-xs font-black rounded-full flex items-center justify-center">1</span>
                <h2 className="text-lg font-bold text-gray-900">Delivery Address</h2>
              </div>
              {loadingAddr
                ? <div className="h-20 bg-gray-100 rounded-2xl animate-pulse" />
                : <AddressCard addr={address} name={userName} email={userEmail} />}
            </div>

            {/* Step 2 — Delivery per seller */}
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-7 h-7 bg-black text-white text-xs font-black rounded-full flex items-center justify-center">2</span>
                <h2 className="text-lg font-bold text-gray-900">Delivery Method</h2>
                {sellerGroups.length > 1 && (
                  <span className="ml-auto text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                    {sellerGroups.length} sellers
                  </span>
                )}
              </div>

              <div className="space-y-3">
                {sellerGroups.map(group => {
                  const opts = getDeliveryOptions(group.sellerCountry, buyerCountry);
                  return (
                    <SellerDeliverySection
                      key={group.sellerName}
                      sellerName={group.sellerName}
                      items={group.items}
                      options={opts}
                      selectedId={selectedDeliveries[group.sellerName] ?? ""}
                      onSelect={id => setSelectedDeliveries(prev => ({ ...prev, [group.sellerName]: id }))}
                      buyerCountry={buyerCountry}
                      sellerCountry={group.sellerCountry}
                    />
                  );
                })}
              </div>

              <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-700 flex items-center gap-2">
                <Zap size={12} className="flex-shrink-0" />
                Delivery times are estimated based on seller and buyer location. Each seller ships separately.
              </div>
            </div>

            {/* Step 3 — Payment */}
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-7 h-7 bg-black text-white text-xs font-black rounded-full flex items-center justify-center">3</span>
                <h2 className="text-lg font-bold text-gray-900">Payment Method</h2>
              </div>
              <div className="space-y-2.5">
                {(["card", "paypal", "bank"] as PaymentMethod[]).map(m => (
                  <PaymentCard key={m} method={m}
                    selected={paymentMethod === m} onSelect={() => setPaymentMethod(m)}
                    cardNumber={cardNumber} setCardNumber={setCardNumber}
                    cardExpiry={cardExpiry} setCardExpiry={setCardExpiry}
                    cardCvc={cardCvc} setCardCvc={setCardCvc}
                  />
                ))}
              </div>
            </div>

          </div>

          {/* ── Right: order summary ──────────────────────────── */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-6 shadow-sm sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-5">Order Summary</h2>

              {/* Items grouped by seller */}
              <div className="space-y-4 mb-5 pb-5 border-b border-gray-100">
                {sellerGroups.map(group => (
                  <div key={group.sellerName}>
                    {sellerGroups.length > 1 && (
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{group.sellerName}</p>
                    )}
                    <div className="space-y-2">
                      {group.items.map(item => (
                        <div key={item.id} className="flex gap-3">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                            <Image src={item.image || "/images/placeholder.jpg"} alt={item.title} fill className="object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 line-clamp-1">{item.title}</p>
                            <p className="text-sm font-black text-gray-900">
                              €{item.price.toLocaleString("de-DE", { minimumFractionDigits: 2 })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Price breakdown */}
              <div className="space-y-2 mb-5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Items ({items.length})</span>
                  <span className="font-semibold">€{itemsTotal.toLocaleString("de-DE", { minimumFractionDigits: 2 })}</span>
                </div>
                {/* Per-seller shipping breakdown */}
                {sellerGroups.map(group => {
                  const opts = getDeliveryOptions(group.sellerCountry, buyerCountry);
                  const sel = opts.find(o => o.id === selectedDeliveries[group.sellerName]);
                  return sel ? (
                    <div key={group.sellerName} className="flex justify-between text-sm">
                      <span className="text-gray-500">
                        Shipping{sellerGroups.length > 1 ? ` · ${group.sellerName}` : ""}
                      </span>
                      <span className="font-semibold">€{sel.price.toFixed(2)}</span>
                    </div>
                  ) : null;
                })}
              </div>

              <div className="border-t border-gray-100 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-black text-gray-900">
                    €{totalPrice.toLocaleString("de-DE", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={submitting || !allDeliveriesSelected}
                className="w-full py-4 bg-black text-white font-bold rounded-2xl hover:bg-gray-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                <Lock size={15} />
                {submitting
                  ? "Processing…"
                  : items.length > 1
                    ? `Place ${items.length} orders`
                    : "Place Order"}
              </button>

              <div className="mt-5 pt-5 border-t border-gray-100 space-y-2.5">
                <div className="flex items-center gap-2.5 text-xs text-gray-500">
                  <Shield size={14} className="text-emerald-500 flex-shrink-0" /> Buyer protection on every order
                </div>
                <div className="flex items-center gap-2.5 text-xs text-gray-500">
                  <Truck size={14} className="text-blue-500 flex-shrink-0" /> Real-time shipment tracking
                </div>
                <div className="flex items-center gap-2.5 text-xs text-gray-500">
                  <Lock size={14} className="text-gray-400 flex-shrink-0" /> Encrypted payment
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-black border-t-transparent" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}

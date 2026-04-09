"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Shield, Truck, Lock, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import { useCart } from "@/lib/CartContext";
import { useAuth } from "@/lib/context/AuthContext";
import { buyNow } from "@/lib/api/auctions.api";
import { getMyAddress } from "@/lib/api/users";

// ─── Checkout form ────────────────────────────────────────────────────────────

function CheckoutContent() {
  const router = useRouter();
  const { items, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "Poland",
    phone: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<"success" | "error" | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  // Pre-fill form with user's saved address
  useEffect(() => {
    if (!isAuthenticated) return;

    const prefill = async () => {
      try {
        const res = await getMyAddress();
        const addr = (res as any)?.address;
        if (!addr) return;

        setFormData((prev) => ({
          ...prev,
          email: (user as any)?.email ?? prev.email,
          firstName: (user as any)?.name ?? prev.firstName,
          lastName: (user as any)?.lastName ?? prev.lastName,
          phone: (user as any)?.phone ?? prev.phone,
          address: addr.street ?? prev.address,
          city: addr.city ?? prev.city,
          postalCode: addr.postalCode ?? prev.postalCode,
          country: addr.country ?? prev.country,
        }));
      } catch {
        // Silently fail — user can fill manually
      }
    };

    prefill();
  }, [isAuthenticated, user]);

  const shippingCost = 25;
  const itemsTotal = items.reduce((sum, i) => sum + i.price, 0);
  const totalPrice = itemsTotal + shippingCost;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setErrorMsg("You must be logged in to place an order.");
      setResult("error");
      return;
    }

    if (items.length === 0) {
      setErrorMsg("Your cart is empty.");
      setResult("error");
      return;
    }

    try {
      setSubmitting(true);
      setResult(null);

      // Call buyNow for each cart item sequentially
      const errors: string[] = [];
      for (const item of items) {
        const res = await buyNow(item.id);
        if (!res.success) {
          errors.push(`${item.title}: ${res.message ?? "Purchase failed"}`);
        }
      }

      if (errors.length > 0) {
        setErrorMsg(errors.join(" | "));
        setResult("error");
        return;
      }

      // All purchases successful
      clearCart();
      setResult("success");
      setTimeout(() => router.push("/history"), 3000);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Unexpected error");
      setResult("error");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Empty cart ──
  if (items.length === 0 && result !== "success") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-light mb-3">Your cart is empty</h2>
          <Link href="/auctions" className="text-black underline">
            Browse Auctions
          </Link>
        </div>
      </div>
    );
  }

  // ── Success state ──
  if (result === "success") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 max-w-md w-full text-center">
          <CheckCircle size={56} className="mx-auto text-emerald-500 mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Order placed!</h2>
          <p className="text-gray-500 text-sm mb-6">
            Your purchase is confirmed. You can track it in{" "}
            <Link href="/history" className="text-black font-medium underline">
              Transaction History
            </Link>
            .
          </p>
          <p className="text-xs text-gray-400">Redirecting in 3 seconds…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="pt-4 pb-16 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-black mb-8 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to cart</span>
          </Link>

          <h1 className="text-4xl font-light mb-2">Checkout</h1>
          <p className="text-gray-600 mb-8">Complete your purchase securely</p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Error banner */}
              {result === "error" && (
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                  <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Contact Information */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Contact Information
                </h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your.email@example.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              {/* Shipping Information */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="John"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Doe"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Street address"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Warsaw"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        placeholder="00-001"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                    >
                      <option value="Poland">Poland</option>
                      <option value="Germany">Germany</option>
                      <option value="UK">United Kingdom</option>
                      <option value="France">France</option>
                      <option value="Italy">Italy</option>
                      <option value="Spain">Spain</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+48 123 456 789"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </form>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

                {/* Items */}
                <div className="space-y-4 mb-6 pb-6 border-b max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <Image
                          src={item.image || "/images/placeholder.jpg"}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm mb-1 line-clamp-2">
                          {item.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          Seller: {item.seller.name}
                        </p>
                        <p className="text-sm font-bold mt-1">
                          {item.price.toLocaleString()} {item.currency}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Items ({items.length})
                    </span>
                    <span className="font-medium">
                      €{itemsTotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">€{shippingCost}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-xl">
                      €{totalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Place Order Button */}
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="w-full py-4 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-all hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Lock size={18} />
                  {submitting ? "Processing…" : "Place Order"}
                </button>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Shield size={16} className="text-emerald-600" />
                    <span>Buyer Protection Included</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Truck size={16} className="text-blue-600" />
                    <span>Tracked & Insured Shipping</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Lock size={16} className="text-gray-600" />
                    <span>Secure Payment Processing</span>
                  </div>
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
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black" />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}

"use client";

import { useCart } from "@/lib/CartContext";
import Image from "next/image";
import Link from "next/link";
import { Trash2, ShoppingBag, ArrowRight, Shield } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { items, removeFromCart, clearCart, totalPrice, itemCount } = useCart();
  const router = useRouter();

  const shippingCost = items.length > 0 ? 25 : 0;
  const finalTotal = totalPrice + shippingCost;

  const handleCheckout = () => {
    if (items.length === 1) {
      // If only one item, go directly to checkout with that item
      router.push(`/checkout?id=${items[0].id}`);
    } else {
      // For multiple items, you could create a multi-item checkout
      alert(
        "Multi-item checkout coming soon! For now, please checkout items individually.",
      );
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-gray-50">
        <div className="pt-12 pb-16 px-4 sm:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <ShoppingBag size={80} className="mx-auto text-gray-300 mb-6" />
            <h1 className="text-4xl font-light mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">
              Start adding items to your cart to see them here
            </p>
            <Link
              href="/auctions"
              className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-all"
            >
              Browse Auctions
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <div className="pt-12 pb-16 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-light mb-2">Shopping Cart</h1>
              <p className="text-gray-600">
                {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
              </p>
            </div>
            <button
              onClick={clearCart}
              className="text-red-600 hover:text-red-700 font-medium flex items-center gap-2"
            >
              <Trash2 size={18} />
              Clear Cart
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow-sm p-6 flex gap-6"
                >
                  {/* Image */}
                  <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <Link
                          href={`/auction/${item.id}`}
                          className="text-lg font-semibold hover:text-gray-600 transition-colors"
                        >
                          {item.title}
                        </Link>
                        <p className="text-sm text-gray-500 mt-1">
                          Seller: {item.seller.name}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-500">★</span>
                            <span className="text-sm font-medium">
                              {item.seller.rating.toFixed(1)}
                            </span>
                          </div>
                          <Shield size={14} className="text-emerald-600" />
                          <span className="text-xs text-emerald-600">
                            Verified
                          </span>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="mt-4 pt-4 border-t flex justify-between items-center">
                      <span className="text-sm text-gray-600">Price</span>
                      <span className="text-2xl font-bold">
                        {item.price.toLocaleString()} {item.currency}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-32">
                <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"}
                      )
                    </span>
                    <span className="font-medium">
                      {totalPrice.toLocaleString()} zł
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {shippingCost.toLocaleString()} zł
                    </span>
                  </div>
                  <div className="border-t pt-3 flex justify-between">
                    <span className="font-semibold text-lg">Total</span>
                    <span className="font-bold text-2xl">
                      {finalTotal.toLocaleString()} zł
                    </span>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  className="w-full py-4 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-all hover:shadow-lg flex items-center justify-center gap-2 mb-4"
                >
                  Proceed to Checkout
                  <ArrowRight size={20} />
                </button>

                <Link
                  href="/auctions"
                  className="block text-center text-sm text-gray-600 hover:text-black transition-colors"
                >
                  Continue Shopping
                </Link>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Shield size={16} className="text-emerald-600" />
                    <span>Buyer Protection Included</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <svg
                      className="w-4 h-4 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <svg
                      className="w-4 h-4 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                      />
                    </svg>
                    <span>14-Day Returns</span>
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

"use client";

import { useState } from "react";
import { authApi } from "@/lib/api";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
}

export default function LoginModal({
  isOpen,
  onClose,
  onLoginSuccess,
}: LoginModalProps) {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authApi.login({
        emailOrUsername,
        password,
      });

      if (response.success) {
        console.log("✅ Login successful:", response.data);

        // Call callback to update Navbar BEFORE closing modal
        if (onLoginSuccess) {
          await onLoginSuccess();
        }

        // Small delay to ensure state updates
        await new Promise((resolve) => setTimeout(resolve, 100));

        onClose(); // Close modal
      } else {
        setError(response.message || "Login failed");
      }
    } catch (err: any) {
      console.error("❌ Login error:", err);
      setError(err.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed top-0 left-0 right-0 bottom-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 min-h-screen"
      onClick={onClose}
    >
      {/* Modal Container */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex-shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
        >
          <span className="text-2xl text-gray-600">×</span>
        </button>

        {/* Modal Content */}
        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
            <p className="text-gray-600">Login to your account</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email/Login Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold mb-2"
              >
                Email or Username
              </label>
              <input
                type="text"
                id="email"
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                placeholder="Enter your email or username"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                required
                disabled={loading}
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                required
                disabled={loading}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Forgot Password Link */}
            <div className="text-right">
              <a
                href="/forgot-password"
                className="text-sm text-gray-600 hover:text-black font-medium transition-colors"
              >
                Forgot your password?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <a
                href="/register"
                className="text-black font-semibold hover:opacity-70 transition-opacity"
              >
                Register
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

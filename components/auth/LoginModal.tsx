"use client";

import { useState } from "react";
import { useAuth } from "@/lib/context/AuthContext";

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
  const { login } = useAuth();
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
      // Use AuthContext login - updates global state automatically
      await login(emailOrUsername, password);

      // Notify parent (e.g. close modal, update UI)
      if (onLoginSuccess) {
        onLoginSuccess();
      }

      onClose();
    } catch (err: any) {
      // Error message from AuthContext or API
      const message =
        err?.message ||
        err?.response?.data?.message ||
        "Wystąpił błąd podczas logowania";
      setError(message);
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
            {/* Email/Username Field */}
            <div>
              <label
                htmlFor="emailOrUsername"
                className="block text-sm font-semibold mb-2"
              >
                Email or Username
              </label>
              <input
                type="text"
                id="emailOrUsername"
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
              Don&apos;t have an account?{" "}
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

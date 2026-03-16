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
      await login(emailOrUsername, password);

      if (onLoginSuccess) {
        onLoginSuccess();
      }

      onClose();
    } catch (err: any) {
      const message =
        err?.message || err?.response?.data?.message || "Login failed";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
        >
          <span className="text-2xl text-gray-600">×</span>
        </button>

        <div className="p-8">
          {/* HEADER */}
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
            <p className="text-gray-600">Login to your account</p>
          </div>

          {/* TEST ACCOUNT INFO */}
          <div className="mb-6 p-4 border rounded-lg bg-gray-50 text-sm">
            <p className="font-semibold mb-1">Test account</p>
            <p>
              Email: <span className="font-mono">test@matchdays.com</span>
            </p>
            <p>
              Password: <span className="font-mono">Test2026</span>
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Email or Username
              </label>

              <input
                type="text"
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                placeholder="Enter your email or username"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                required
                disabled={loading}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="text-right">
              <a
                href="/forgot-password"
                className="text-sm text-gray-600 hover:text-black"
              >
                Forgot your password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-900 disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don&apos;t have an account?{" "}
              <a
                href="/register"
                className="text-black font-semibold hover:opacity-70"
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

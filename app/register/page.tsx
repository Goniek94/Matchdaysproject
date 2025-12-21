"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

// Lista krajów
const ALLOWED_COUNTRIES = [
  { code: "PL", name: "Poland" },
  { code: "AT", name: "Austria" },
  { code: "BE", name: "Belgium" },
  { code: "BG", name: "Bulgaria" },
  { code: "HR", name: "Croatia" },
  { code: "CY", name: "Cyprus" },
  { code: "CZ", name: "Czech Republic" },
  { code: "DK", name: "Denmark" },
  { code: "EE", name: "Estonia" },
  { code: "FI", name: "Finland" },
  { code: "FR", name: "France" },
  { code: "DE", name: "Germany" },
  { code: "GR", name: "Greece" },
  { code: "HU", name: "Hungary" },
  { code: "IE", name: "Ireland" },
  { code: "IT", name: "Italy" },
  { code: "LV", name: "Latvia" },
  { code: "LT", name: "Lithuania" },
  { code: "LU", name: "Luxembourg" },
  { code: "MT", name: "Malta" },
  { code: "NL", name: "Netherlands" },
  { code: "NO", name: "Norway" },
  { code: "PT", name: "Portugal" },
  { code: "RO", name: "Romania" },
  { code: "SK", name: "Slovakia" },
  { code: "SI", name: "Slovenia" },
  { code: "ES", name: "Spain" },
  { code: "SE", name: "Sweden" },
  { code: "CH", name: "Switzerland" },
];

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    country: "", // Tu trzymamy kod kraju np. "PL"
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // NOWE: Stan do obsługi własnego dropdowna
  const [isCountryOpen, setIsCountryOpen] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // NOWE: Funkcja do wyboru kraju z naszej listy
  const handleCountrySelect = (code: string) => {
    setFormData({ ...formData, country: code });
    setIsCountryOpen(false); // Zamknij listę po wyborze
  };

  // Helper: Znajdź pełną nazwę kraju na podstawie kodu (do wyświetlenia w inpucie)
  const getSelectedCountryName = () => {
    const country = ALLOWED_COUNTRIES.find((c) => c.code === formData.country);
    return country ? country.name : "Select your country";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      setIsLoading(false);
      return;
    }

    // Walidacja czy wybrano kraj
    if (!formData.country) {
      setError("Please select a country.");
      setIsLoading(false);
      return;
    }

    try {
      console.log("Registering user:", formData);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      alert("Registration successful! (Demo)");
    } catch (err) {
      setError("Registration failed. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="bg-white min-h-screen">
      <Navbar />

      <section className="pt-32 pb-20 px-8">
        <div className="container-max max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">Create Account</h1>
            <p className="text-xl text-gray-600">
              Join MatchDays and start collecting today
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Imiona */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-semibold mb-2"
                  >
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="John"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-semibold mb-2"
                  >
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Doe"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  />
                </div>
              </div>

              {/* Data urodzenia */}
              <div>
                <label
                  htmlFor="birthDate"
                  className="block text-sm font-semibold mb-2"
                >
                  Date of Birth *
                </label>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>

              {/* --- CUSTOM DROPDOWN (Zastępuje stary select) --- */}
              <div className="relative">
                <label className="block text-sm font-semibold mb-2">
                  Country (Europe) *
                </label>

                {/* Ten div udaje inputa */}
                <div
                  onClick={() => setIsCountryOpen(!isCountryOpen)}
                  className={`w-full px-4 py-3 border rounded-lg cursor-pointer flex justify-between items-center bg-white
                    ${
                      isCountryOpen
                        ? "ring-2 ring-black border-transparent"
                        : "border-gray-300"
                    }
                  `}
                >
                  <span
                    className={
                      formData.country ? "text-black" : "text-gray-400"
                    }
                  >
                    {getSelectedCountryName()}
                  </span>

                  {/* Strzałka */}
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      isCountryOpen ? "rotate-180" : ""
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>

                {/* To jest rozwijana lista */}
                {isCountryOpen && (
                  <>
                    {/* Niewidzialna warstwa pod spodem, żeby zamknąć klikając obok */}
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsCountryOpen(false)}
                    />

                    {/* Właściwa lista opcji */}
                    <ul className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                      {ALLOWED_COUNTRIES.map((c) => (
                        <li
                          key={c.code}
                          onClick={() => handleCountrySelect(c.code)}
                          className={`px-4 py-3 cursor-pointer hover:bg-gray-100 transition-colors
                            ${
                              formData.country === c.code
                                ? "bg-gray-50 font-semibold"
                                : ""
                            }
                          `}
                        >
                          {c.name}
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                <p className="text-xs text-gray-500 mt-1">
                  Registration is currently limited to EU, Norway, and
                  Switzerland.
                </p>
              </div>
              {/* --- KONIEC CUSTOM DROPDOWN --- */}

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold mb-2"
                >
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john.doe@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>

              {/* Telefon */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-semibold mb-2"
                >
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+48 123 456 789"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>

              {/* Hasła */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold mb-2"
                  >
                    Password *
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-semibold mb-2"
                  >
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  />
                </div>
              </div>

              {/* Zgody */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="terms"
                  className="mt-1 w-4 h-4 accent-black"
                  required
                />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="text-black font-semibold hover:opacity-70"
                  >
                    Terms & Conditions
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-black font-semibold hover:opacity-70"
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {/* Błędy */}
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200">
                  {error}
                </div>
              )}

              {/* Przycisk */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 rounded-lg font-semibold text-lg transition-all ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-black text-white hover:bg-gray-900 hover:shadow-lg"
                }`}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/"
                  className="text-black font-semibold hover:opacity-70 transition-opacity"
                >
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

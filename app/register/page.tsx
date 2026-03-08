"use client";

import { useState } from "react";
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
  { code: "GB", name: "United Kingdom" },
];

export default function RegisterPage() {
  // Multi-step state
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    country: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCountryOpen, setIsCountryOpen] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const value =
      e.target.type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleCountrySelect = (code: string) => {
    setFormData({ ...formData, country: code });
    setIsCountryOpen(false);
  };

  const getSelectedCountryName = () => {
    const country = ALLOWED_COUNTRIES.find((c) => c.code === formData.country);
    return country ? country.name : "Select your country";
  };

  // Validation for each step
  const validateStep = (step: number): boolean => {
    setError("");

    switch (step) {
      case 1:
        if (!formData.firstName.trim() || !formData.lastName.trim()) {
          setError("Please enter your first and last name.");
          return false;
        }
        return true;

      case 2:
        if (!formData.birthDate) {
          setError("Please enter your date of birth.");
          return false;
        }
        if (!formData.country) {
          setError("Please select your country.");
          return false;
        }
        return true;

      case 3:
        if (!formData.email.trim()) {
          setError("Please enter your email address.");
          return false;
        }
        if (!formData.phone.trim()) {
          setError("Please enter your phone number.");
          return false;
        }
        return true;

      case 4:
        if (formData.password.length < 8) {
          setError("Password must be at least 8 characters long.");
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match!");
          return false;
        }
        if (!formData.termsAccepted) {
          setError("Please accept the Terms & Conditions.");
          return false;
        }
        return true;

      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const handleBack = () => {
    setError("");
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep(currentStep)) {
      return;
    }

    setIsLoading(true);

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

  // Progress indicator
  const ProgressBar = () => (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-3">
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className="flex items-center flex-1">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                step === currentStep
                  ? "bg-black text-white scale-110"
                  : step < currentStep
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-500"
              }`}
            >
              {step < currentStep ? "✓" : step}
            </div>
            {step < totalSteps && (
              <div
                className={`flex-1 h-1 mx-2 transition-all ${
                  step < currentStep ? "bg-green-500" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>
      <div className="text-center text-sm text-gray-600 font-medium">
        Step {currentStep} of {totalSteps}
      </div>
    </div>
  );

  // Step content renderer
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-2">
                What's your name?
              </h2>
              <p className="text-gray-600">Let's start with the basics</p>
            </div>

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
                className="w-full px-4 py-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                autoFocus
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
                className="w-full px-4 py-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-2">
                Where are you from?
              </h2>
              <p className="text-gray-600">Tell us about yourself</p>
            </div>

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
                className="w-full px-4 py-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-semibold mb-2">
                Country (Europe) *
              </label>

              <div
                onClick={() => setIsCountryOpen(!isCountryOpen)}
                className={`w-full px-4 py-4 text-lg border rounded-lg cursor-pointer flex justify-between items-center bg-white
                  ${
                    isCountryOpen
                      ? "ring-2 ring-black border-transparent"
                      : "border-gray-300"
                  }
                `}
              >
                <span
                  className={formData.country ? "text-black" : "text-gray-400"}
                >
                  {getSelectedCountryName()}
                </span>

                <svg
                  className={`w-5 h-5 transition-transform ${
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

              {isCountryOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsCountryOpen(false)}
                  />

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

              <p className="text-xs text-gray-500 mt-2">
                Registration is currently limited to EU, Norway, and
                Switzerland.
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-2">
                Contact Information
              </h2>
              <p className="text-gray-600">How can we reach you?</p>
            </div>

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
                className="w-full px-4 py-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

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
                className="w-full px-4 py-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-2">
                Secure Your Account
              </h2>
              <p className="text-gray-600">Create a strong password</p>
            </div>

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
                className="w-full px-4 py-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
              <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
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
                className="w-full px-4 py-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div className="flex items-start gap-3 pt-4">
              <input
                type="checkbox"
                id="terms"
                name="termsAccepted"
                checked={formData.termsAccepted}
                onChange={handleChange}
                className="mt-1 w-5 h-5 accent-black cursor-pointer"
              />
              <label
                htmlFor="terms"
                className="text-sm text-gray-600 cursor-pointer"
              >
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
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <section className="pt-8 md:pt-12 pb-12 md:pb-20 px-4 md:px-8">
        <div className="container-max max-w-2xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-3 md:mb-4">
              Create Account
            </h1>
            <p className="text-lg md:text-xl text-gray-600">
              Join MatchDays and start collecting today
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 md:p-8">
            <ProgressBar />

            <form onSubmit={handleSubmit}>
              {renderStepContent()}

              {/* Error message */}
              {error && (
                <div className="mt-6 bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-200">
                  {error}
                </div>
              )}

              {/* Navigation buttons */}
              <div className="mt-8 flex gap-3">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex-1 py-4 rounded-lg font-semibold text-lg border-2 border-gray-300 hover:border-gray-400 transition-all"
                  >
                    Back
                  </button>
                )}

                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex-1 py-4 rounded-lg font-semibold text-lg bg-black text-white hover:bg-gray-900 hover:shadow-lg transition-all"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`flex-1 py-4 rounded-lg font-semibold text-lg transition-all ${
                      isLoading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-black text-white hover:bg-gray-900 hover:shadow-lg"
                    }`}
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </button>
                )}
              </div>
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
    </div>
  );
}

import { Settings, Globe, Calendar } from "lucide-react";
import { useState } from "react";

export default function AccountSettings() {
  const [settings, setSettings] = useState({
    language: "en",
    timezone: "UTC",
    dateFormat: "MM/DD/YYYY",
    currency: "USD",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Account settings updated:", settings);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="text-gray-700" size={24} />
        <h2 className="text-2xl font-bold text-gray-900">Account Settings</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Language */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <div className="flex items-center gap-2">
              <Globe size={16} />
              Language
            </div>
          </label>
          <select
            value={settings.language}
            onChange={(e) =>
              setSettings({ ...settings, language: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
            <option value="pl">Polski</option>
          </select>
        </div>

        {/* Timezone */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Timezone
          </label>
          <select
            value={settings.timezone}
            onChange={(e) =>
              setSettings({ ...settings, timezone: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="UTC">UTC (GMT+0)</option>
            <option value="EST">Eastern Time (GMT-5)</option>
            <option value="PST">Pacific Time (GMT-8)</option>
            <option value="CET">Central European Time (GMT+1)</option>
            <option value="JST">Japan Standard Time (GMT+9)</option>
          </select>
        </div>

        {/* Date Format */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              Date Format
            </div>
          </label>
          <select
            value={settings.dateFormat}
            onChange={(e) =>
              setSettings({ ...settings, dateFormat: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>

        {/* Currency */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Currency
          </label>
          <select
            value={settings.currency}
            onChange={(e) =>
              setSettings({ ...settings, currency: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="PLN">PLN (zł)</option>
            <option value="JPY">JPY (¥)</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

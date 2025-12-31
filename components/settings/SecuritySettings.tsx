import { Shield, Lock, Key } from "lucide-react";
import { useState } from "react";

export default function SecuritySettings() {
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Password change requested");
    // Reset form
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="text-gray-700" size={24} />
        <h2 className="text-2xl font-bold text-gray-900">Security Settings</h2>
      </div>

      <div className="space-y-8">
        {/* Change Password */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Lock size={20} className="text-gray-700" />
            <h3 className="text-lg font-bold text-gray-900">Change Password</h3>
          </div>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Current Password
              </label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    currentPassword: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter current password"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter new password"
              />
              <p className="text-xs text-gray-500 mt-1">
                Must be at least 8 characters with uppercase, lowercase, and
                numbers
              </p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirmPassword: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Confirm new password"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold"
              >
                Update Password
              </button>
            </div>
          </form>
        </div>

        {/* Two-Factor Authentication */}
        <div className="pt-6 border-t border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Key size={20} className="text-gray-700" />
            <h3 className="text-lg font-bold text-gray-900">
              Two-Factor Authentication
            </h3>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-700 mb-3">
              Add an extra layer of security to your account. When enabled,
              you'll need to enter a code from your phone in addition to your
              password.
            </p>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-gray-900">
                  Status:{" "}
                  <span
                    className={
                      twoFactorEnabled ? "text-green-600" : "text-gray-600"
                    }
                  >
                    {twoFactorEnabled ? "Enabled" : "Disabled"}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                  twoFactorEnabled
                    ? "bg-red-100 text-red-700 hover:bg-red-200"
                    : "bg-green-100 text-green-700 hover:bg-green-200"
                }`}
              >
                {twoFactorEnabled ? "Disable" : "Enable"} 2FA
              </button>
            </div>
          </div>
        </div>

        {/* Active Sessions */}
        <div className="pt-6 border-t border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Active Sessions
          </h3>
          <div className="space-y-3">
            {[
              {
                device: "Chrome on Windows",
                location: "New York, USA",
                lastActive: "Active now",
                current: true,
              },
              {
                device: "Safari on iPhone",
                location: "New York, USA",
                lastActive: "2 hours ago",
                current: false,
              },
            ].map((session, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <div className="font-semibold text-gray-900 flex items-center gap-2">
                    {session.device}
                    {session.current && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-bold">
                        Current
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    {session.location} • {session.lastActive}
                  </div>
                </div>
                {!session.current && (
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Revoke
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

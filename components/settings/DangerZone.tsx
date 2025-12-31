import { AlertTriangle, Trash2, LogOut } from "lucide-react";
import { useState } from "react";

export default function DangerZone() {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const handleDeactivate = () => {
    if (confirm("Are you sure you want to deactivate your account?")) {
      console.log("Account deactivation requested");
    }
  };

  const handleDelete = () => {
    if (deleteConfirmText === "DELETE") {
      console.log("Account deletion requested");
      setShowDeleteConfirm(false);
      setDeleteConfirmText("");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border-2 border-red-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <AlertTriangle className="text-red-600" size={24} />
        <h2 className="text-2xl font-bold text-red-900">Danger Zone</h2>
      </div>

      <div className="space-y-4">
        {/* Deactivate Account */}
        <div className="border border-red-200 rounded-lg p-4 bg-red-50">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 mb-1">
                Deactivate Account
              </h3>
              <p className="text-sm text-gray-600">
                Temporarily disable your account. You can reactivate it anytime
                by logging in.
              </p>
            </div>
            <button
              type="button"
              onClick={handleDeactivate}
              className="ml-4 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors font-semibold text-sm whitespace-nowrap"
            >
              <div className="flex items-center gap-2">
                <LogOut size={16} />
                Deactivate
              </div>
            </button>
          </div>
        </div>

        {/* Delete Account */}
        <div className="border-2 border-red-300 rounded-lg p-4 bg-red-50">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="font-bold text-red-900 mb-1">Delete Account</h3>
              <p className="text-sm text-gray-700">
                Permanently delete your account and all associated data. This
                action cannot be undone.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}
              className="ml-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold text-sm whitespace-nowrap"
            >
              <div className="flex items-center gap-2">
                <Trash2 size={16} />
                Delete Account
              </div>
            </button>
          </div>

          {showDeleteConfirm && (
            <div className="mt-4 pt-4 border-t border-red-300">
              <div className="bg-white rounded-lg p-4 mb-4">
                <h4 className="font-bold text-gray-900 mb-2">
                  ⚠️ Warning: This action is irreversible
                </h4>
                <ul className="text-sm text-gray-700 space-y-1 mb-4 list-disc list-inside">
                  <li>All your listings will be permanently removed</li>
                  <li>Your bids and auction history will be deleted</li>
                  <li>You will lose access to all purchased items</li>
                  <li>Your subscription will be cancelled</li>
                  <li>All personal data will be erased</li>
                </ul>
                <p className="text-sm font-semibold text-red-900">
                  Type{" "}
                  <span className="font-mono bg-red-100 px-2 py-1 rounded">
                    DELETE
                  </span>{" "}
                  to confirm:
                </p>
              </div>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="Type DELETE to confirm"
                className="w-full px-4 py-3 border-2 border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent mb-3"
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteConfirmText("");
                  }}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleteConfirmText !== "DELETE"}
                  className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-colors ${
                    deleteConfirmText === "DELETE"
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Permanently Delete Account
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <span className="font-semibold">Need help?</span> If you're having
            issues with your account, please{" "}
            <a href="/contact" className="underline hover:text-blue-700">
              contact our support team
            </a>{" "}
            before taking any irreversible actions.
          </p>
        </div>
      </div>
    </div>
  );
}

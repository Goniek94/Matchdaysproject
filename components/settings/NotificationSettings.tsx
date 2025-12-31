import { Bell } from "lucide-react";
import { useState } from "react";

export default function NotificationSettings() {
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    newBids: true,
    outbid: true,
    auctionEnding: true,
    auctionWon: true,
    newMessages: true,
    priceDrops: false,
    newsletter: true,
    promotions: false,
  });

  const handleToggle = (key: keyof typeof notifications) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Notification settings updated:", notifications);
  };

  const NotificationToggle = ({
    label,
    description,
    enabled,
    onChange,
  }: {
    label: string;
    description: string;
    enabled: boolean;
    onChange: () => void;
  }) => (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
      <div className="flex-1">
        <div className="font-semibold text-gray-900">{label}</div>
        <div className="text-sm text-gray-600">{description}</div>
      </div>
      <button
        type="button"
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          enabled ? "bg-blue-600" : "bg-gray-300"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <Bell className="text-gray-700" size={24} />
        <h2 className="text-2xl font-bold text-gray-900">
          Notification Settings
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Notification Channels */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Notification Channels
          </h3>
          <div className="space-y-2">
            <NotificationToggle
              label="Email Notifications"
              description="Receive notifications via email"
              enabled={notifications.emailNotifications}
              onChange={() => handleToggle("emailNotifications")}
            />
            <NotificationToggle
              label="Push Notifications"
              description="Receive push notifications in browser"
              enabled={notifications.pushNotifications}
              onChange={() => handleToggle("pushNotifications")}
            />
            <NotificationToggle
              label="SMS Notifications"
              description="Receive important alerts via SMS"
              enabled={notifications.smsNotifications}
              onChange={() => handleToggle("smsNotifications")}
            />
          </div>
        </div>

        {/* Auction Notifications */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Auction Notifications
          </h3>
          <div className="space-y-2">
            <NotificationToggle
              label="New Bids"
              description="When someone bids on your listing"
              enabled={notifications.newBids}
              onChange={() => handleToggle("newBids")}
            />
            <NotificationToggle
              label="Outbid Alerts"
              description="When you're outbid on an auction"
              enabled={notifications.outbid}
              onChange={() => handleToggle("outbid")}
            />
            <NotificationToggle
              label="Auction Ending Soon"
              description="Reminders for auctions ending soon"
              enabled={notifications.auctionEnding}
              onChange={() => handleToggle("auctionEnding")}
            />
            <NotificationToggle
              label="Auction Won"
              description="When you win an auction"
              enabled={notifications.auctionWon}
              onChange={() => handleToggle("auctionWon")}
            />
          </div>
        </div>

        {/* Other Notifications */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Other Notifications
          </h3>
          <div className="space-y-2">
            <NotificationToggle
              label="New Messages"
              description="When you receive a new message"
              enabled={notifications.newMessages}
              onChange={() => handleToggle("newMessages")}
            />
            <NotificationToggle
              label="Price Drops"
              description="When items on your watchlist drop in price"
              enabled={notifications.priceDrops}
              onChange={() => handleToggle("priceDrops")}
            />
            <NotificationToggle
              label="Newsletter"
              description="Weekly newsletter with platform updates"
              enabled={notifications.newsletter}
              onChange={() => handleToggle("newsletter")}
            />
            <NotificationToggle
              label="Promotions"
              description="Special offers and promotions"
              enabled={notifications.promotions}
              onChange={() => handleToggle("promotions")}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
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

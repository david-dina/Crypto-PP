import React, { useState } from "react";
import toast from "react-hot-toast";

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PasswordModal: React.FC<PasswordModalProps> = ({ isOpen, onClose }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Handle Save Password
  const handleSavePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("All fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/user/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const result = await response.json();
      if (response.ok) {
        toast.success("Password updated successfully!");
        onClose();
      } else {
        toast.error(result.message || "Failed to update password.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="rounded-lg bg-white dark:bg-gray-dark p-6 shadow-lg w-full max-w-md">
            <h2 className="text-lg font-medium mb-4 text-dark dark:text-white">
              Change Password
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-dark dark:text-white">
                  Old Password
                </label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full rounded-lg border px-4 py-2 bg-gray-100 text-black dark:bg-dark-2 dark:text-white"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-dark dark:text-white">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-lg border px-4 py-2 bg-gray-100 text-black dark:bg-dark-2 dark:text-white"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-dark dark:text-white">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-lg border px-4 py-2 bg-gray-100 text-black dark:bg-dark-2 dark:text-white"
                />
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <button
                onClick={handleSavePassword}
                className="w-full rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary-dark"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save Password"}
              </button>
              <button
                onClick={onClose}
                className="w-full rounded-lg border px-4 py-2 text-dark hover:bg-gray-100 dark:border-dark-3 dark:text-white dark:hover:bg-dark-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PasswordModal;

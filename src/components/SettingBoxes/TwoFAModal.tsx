import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface TwoFAModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TwoFAModal: React.FC<TwoFAModalProps> = ({ isOpen, onClose }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch QR Code when modal opens
  useEffect(() => {
    if (isOpen) {
      const fetchQRCode = async () => {
        setIsLoading(true);
        try {
          const response = await fetch("/api/2fa/generate");
          const result = await response.json();

          if (result.qrCodeUrl) {
            setQrCodeUrl(result.qrCodeUrl);
          } else {
            toast.error("Failed to generate QR code.");
          }
        } catch (error) {
          toast.error("Error fetching QR code.");
        } finally {
          setIsLoading(false);
        }
      };

      fetchQRCode();
    }
  }, [isOpen]);

  // Handle Verification Code Submission
  const handleVerifyCode = async () => {
    if (!verificationCode) {
      toast.error("Please enter the verification code.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/2fa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: verificationCode }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("2FA enabled successfully!");
        setIsEnabled(true);
        onClose();
      } else {
        toast.error(result.message || "Invalid verification code.");
      }
    } catch (error) {
      toast.error("Error verifying code.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Disable 2FA
  const handleDisable2FA = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/2fa/disable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();

      if (result.success) {
        toast.success("2FA disabled successfully!");
        setIsEnabled(false);
        onClose();
      } else {
        toast.error(result.message || "Failed to disable 2FA.");
      }
    } catch (error) {
      toast.error("Error disabling 2FA.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="rounded-lg bg-white p-6 shadow-lg w-full max-w-md">
            <h2 className="text-lg font-medium mb-4">Two-Factor Authentication</h2>
            {isLoading ? (
              <p className="text-center">Loading...</p>
            ) : (
              <>
                {!isEnabled ? (
                  <>
                    <p className="mb-4 text-sm text-gray-600">
                      Scan the QR code below using your authenticator app (e.g., Google Authenticator).
                    </p>
                    {qrCodeUrl && (
                      <div className="flex justify-center mb-4">
                        <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48" />
                      </div>
                    )}

                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Enter Verification Code:
                    </label>
                    <input
                      type="text"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      className="w-full mb-4 rounded-lg border px-4 py-2"
                      placeholder="Enter code"
                    />

                    <button
                      onClick={handleVerifyCode}
                      className="w-full rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary-dark"
                    >
                      Verify and Enable
                    </button>
                  </>
                ) : (
                  <>
                    <p className="mb-4 text-sm text-gray-600">
                      Two-Factor Authentication is currently enabled.
                    </p>
                    <button
                      onClick={handleDisable2FA}
                      className="w-full rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                    >
                      Disable 2FA
                    </button>
                  </>
                )}
              </>
            )}

            <button
              onClick={onClose}
              className="mt-4 w-full rounded-lg border px-4 py-2 hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default TwoFAModal;

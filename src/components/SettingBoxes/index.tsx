"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { createClient } from "@supabase/supabase-js";
import Loader from "../common/Loader";
import CheckboxOne from "../FormElements/Checkboxes/CheckboxOne";
import TwoFAModal from "./TwoFAModal";
import PasswordModal from "./PasswordModal";
import BusinessSettings from "./BusinessSettings";

// Supabase Setup
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  password?: string;
  bio: string;
  phoneNumber: string;
  avatarUrl: string;
  role: "USER" | "BUSINESS";
  twoFactorEnabled: boolean;
  sendEmailNotifications: boolean;
  sendInAppNotifications: boolean;
}

const SettingsPage = () => {
  const [userData, setUserData] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"profile" | "business">("profile");
  const [formData, setFormData] = useState({});
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isTwoFAModalOpen, setTwoFAModalOpen] = useState(false);
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);

  // Fetch User Data
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/user/settings");
      if (response.ok) {
        const result = await response.json();
        setUserData(result.user);
        setIsLoading(false);

        if (result.user.role === "BUSINESS") {
          setActiveTab("business");
        }
      } else {
        toast.error("Please sign in to access settings.");
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleAvatarPreview = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) {
      toast.error("No file selected.");
      return;
    }

    try {
      const { data, error } = await supabase.storage
        .from("avatars")
        .upload(`avatars/${userData?.id}`, avatarFile, { upsert: true });

      if (error) throw error;

      const avatarUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${data.path}`;
      setFormData({ ...formData, avatarUrl });
      toast.success("Avatar uploaded successfully!");
    } catch (error) {
      toast.error("Failed to upload avatar.");
    }
  };

  const handleSave = async () => {
    const response = await fetch("/api/user/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      toast.success("Settings updated successfully!");
    } else {
      toast.error("Failed to update settings.");
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="min-h-screen rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card p-6">
      <div className="flex border-b border-stroke mb-6 dark:border-dark-3">
        <button
          className={`mr-4 py-2 pb-4 ${
            activeTab === "profile" ? "border-b-2 border-primary" : ""
          }`}
          onClick={() => setActiveTab("profile")}
        >
          Profile Settings
        </button>
        <button
          className={`py-2 ${
            activeTab === "business" ? "border-b-2 border-primary" : ""
          }`}
          onClick={() => setActiveTab("business")}
        >
          Business Settings
        </button>
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <form className="space-y-6">
          <div>
            <label className="block mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              defaultValue={userData?.name}
              onChange={handleInputChange}
              className="w-full rounded-lg border px-4 py-2 bg-gray-100 text-black dark:bg-dark-2 dark:text-white"
            />
          </div>

          <div>
            <label className="block mb-2">Username</label>
            <input
              type="text"
              name="username"
              defaultValue={userData?.username}
              onChange={handleInputChange}
              className="w-full rounded-lg border px-4 py-2 bg-gray-100 text-black dark:bg-dark-2 dark:text-white"
            />
          </div>

          <div>
            <label className="block mb-2">Email</label>
            <input
              type="email"
              name="email"
              defaultValue={userData?.email}
              onChange={handleInputChange}
              className="w-full rounded-lg border px-4 py-2 bg-gray-100 text-black dark:bg-dark-2 dark:text-white"
            />
          </div>

          <div>
            <label className="block mb-2">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              defaultValue={userData?.phoneNumber}
              onChange={handleInputChange}
              className="w-full rounded-lg border px-4 py-2 bg-gray-100 text-black dark:bg-dark-2 dark:text-white"
            />
          </div>


          <CheckboxOne
            label="Enable 2FA"
            checked={userData?.twoFactorEnabled}
            onChange={() => setTwoFAModalOpen(true)}
            name="Enable2FA"
          />

          <CheckboxOne
            label="Enable Email Notifications"
            checked={userData?.sendEmailNotifications}
            onChange={handleInputChange}
            name="sendEmailNotifications"
          />

          <CheckboxOne
            label="Enable In-App Notifications"
            checked={userData?.sendInAppNotifications}
            onChange={handleInputChange}
            name="sendInAppNotifications"
          />
          <button
            type="button"
            onClick={() => setPasswordModalOpen(true)}
            className="w-full bg-primary text-white px-2 py-2 rounded-lg"
          >
            Change Password
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="w-full bg-primary text-white px-4 py-2 rounded-lg mb-4"
          >
            Save Changes
          </button>
        </form>
      )}

      {activeTab === "business" && <div className="p-4"><BusinessSettings userData={userData}/></div>}

      {isTwoFAModalOpen && (
        <TwoFAModal
          isOpen={isTwoFAModalOpen}
          onClose={() => setTwoFAModalOpen(false)}
        />
      )}
      {isPasswordModalOpen && (
  <PasswordModal
    isOpen={isPasswordModalOpen}
    onClose={() => setPasswordModalOpen(false)}
  />
)}

    </div>
  );
};

export default SettingsPage;

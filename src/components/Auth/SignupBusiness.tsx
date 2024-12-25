"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import generateRandomString from "@/libs/generateRandomString";

// Import form components
import InputGroup from "@/components/FormElements/InputGroup";
import SelectGroupOne from "../FormElements/SelectGroup/SelectGroupOne";

const SignupBusiness = () => {
  const [data, setData] = useState({
    businessName: "",
    email: "",
    username: "",
    password: "",
    reEnterPassword: "",
    category: "",
    agreeTerms: false, // Added for ToS and Privacy Agreement
  });

  const [loading, setLoading] = useState(false);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<null | boolean>(
    null
  ); // Tracks username availability

  const { businessName, email, username, password, reEnterPassword, category, agreeTerms } = data;
  const router = useRouter();

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;

    setData({
      ...data,
      [name]: type === "checkbox" ? checked : value, // Handles checkbox updates
    });

    // Reset availability when username changes
    if (name === "username") {
      setUsernameAvailable(null); // Reset availability status
    }
  };

  // Debounced Username Check
  useEffect(() => {
    const delay = setTimeout(() => {
      if (username.trim() !== "") {
        checkUsernameAvailability(username);
      }
    }, 500); // 500ms delay

    return () => clearTimeout(delay); // Cleanup if the user types again
  }, [username]); // Runs whenever username changes

  // Check username availability
  const checkUsernameAvailability = async (username: string) => {
    setCheckingUsername(true); // Start checking
    try {
      const res = await axios.get(`/api/signups/usernames?username=${username}`);
      setUsernameAvailable(res.data.available); // Set availability
    } catch (error) {
      console.error("Error checking username:", error);
      setUsernameAvailable(false); // Assume taken on error
    } finally {
      setCheckingUsername(false); // End checking
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate fields
    if (!businessName.trim() || !email || !username || !password || !reEnterPassword || !category) {
      return toast.error("Please fill in all fields!");
    }
    if (password !== reEnterPassword) {
      return toast.error("Passwords do not match");
    }
    if (!usernameAvailable) {
      return toast.error("Username is not available!");
    }
    if (!agreeTerms) {
      return toast.error("You must agree to the Terms and Privacy Policy.");
    }

    setLoading(true);
    try {
      const res = await axios.post(`/api/business/signup`, {
        businessName,
        username,
        email,
        password,
        category,
      });

      if (res.status === 200 || res.status === 201) {
        toast.success("Business Registered Successfully.");
        setLoading(false);
        return router.push("/auth/verify-email");
      } else {
        toast.error(res.data.message);
      }
    } catch (error: any) {
      console.error(error.response.data);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Business Name */}
      <InputGroup
        label="Business Name"
        placeholder="Enter your business name"
        name="businessName"
        value={businessName}
        onChange={handleChange}
      />

      {/* Username */}
      <InputGroup
        label="Username"
        placeholder="Choose a username"
        name="username"
        value={username}
        onChange={handleChange}
      />
      <div className="mt-1 text-sm">
        {checkingUsername ? (
          <span className="text-gray-500 dark:text-gray-400">Checking availability...</span>
        ) : usernameAvailable === true ? (
          <span className="text-green-500">Username is available!</span>
        ) : usernameAvailable === false ? (
          <span className="text-red-500">Username is already taken.</span>
        ) : null}
      </div>

      {/* Email */}
      <InputGroup
        label="Email"
        placeholder="Enter your email"
        name="email"
        value={email}
        onChange={handleChange}
        type="email"
      />

      {/* Password */}
      <InputGroup
        label="Password"
        placeholder="Enter your password"
        name="password"
        value={password}
        onChange={handleChange}
        type="password"
      />

      {/* Re-enter Password */}
      <InputGroup
        label="Re-enter Password"
        placeholder="Re-enter your password"
        name="reEnterPassword"
        value={reEnterPassword}
        onChange={handleChange}
        type="password"
      />

      {/* Business Category */}
      <SelectGroupOne
        label="Business Category"
        name="category"
        value={category}
        onChange={handleChange}
        options={[
          { value: "", label: "Select a category" },
          { value: "ecommerce", label: "E-Commerce" },
          { value: "subscription", label: "Subscription Service" },
          { value: "entertainment", label: "Entertainment" },
          { value: "finance", label: "Finance & Investments" },
          { value: "education", label: "Education & E-Learning" },
          { value: "saas", label: "SaaS (Software as a Service)" },
          { value: "gaming", label: "Gaming & Esports" },
          { value: "consulting", label: "Consulting & Professional Services" },
          { value: "retail", label: "Retail & Marketplaces" },
          { value: "real_estate", label: "Real Estate" },
          { value: "travel", label: "Travel & Hospitality" },
          { value: "logistics", label: "Logistics & Transportation" },
          { value: "marketing", label: "Marketing & Advertising" },
          { value: "media", label: "Media & Publishing" },
          { value: "nonprofit", label: "Nonprofit & Charity" },
          { value: "fashion", label: "Fashion & Apparel" },
          { value: "beauty", label: "Beauty & Cosmetics" },
          { value: "food", label: "Food & Beverage" },
          { value: "blockchain", label: "Blockchain & Crypto" },
          { value: "iot", label: "IoT (Internet of Things)" },
          { value: "cybersecurity", label: "Cybersecurity" },
          { value: "other", label: "Other" },
        ]}
      />

      {/* Terms & Privacy Agreement */}
      <div className="mb-5 flex items-center gap-2">
        <input
          type="checkbox"
          id="agreeTerms"
          name="agreeTerms"
          checked={agreeTerms}
          onChange={handleChange}
          className="h-5 w-5 rounded border border-gray-300 text-primary focus:ring-primary"
        />
        <label htmlFor="agreeTerms" className="text-dark dark:text-white">
          I agree to the{" "}
          <a href="/terms" className="text-primary underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" className="text-primary underline">
            Privacy Policy
          </a>
          .
        </label>
      </div>

      {/* Submit Button */}
      <div className="mb-5">
        <button
          type="submit"
          disabled={loading || checkingUsername}
          className="w-full rounded-lg bg-primary p-4 text-white transition hover:bg-opacity-90"
        >
          Register Business
        </button>
      </div>
    </form>
  );
};

export default SignupBusiness;

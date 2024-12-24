import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

const SignupWithPassword = () => {
  const [data, setData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    reEnterPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [checkingUsername, setCheckingUsername] = useState(false); // Tracks username check state
  const [usernameAvailable, setUsernameAvailable] = useState<null | boolean>(
    null
  ); // Tracks username availability

  const { name, username, email, password, reEnterPassword } = data;
  const router = useRouter();

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Update form data
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Trigger username check only if the field is username
    if (name === "username") {
      setUsernameAvailable(null); // Reset availability
      if (value.trim().length > 0) {
        checkUsername(value); // Call username checker
      }
    }
  };

  // Check username availability
  const checkUsername = async (username: string) => {
    setCheckingUsername(true); // Start loading
    try {
      const res = await axios.get(
        `${process.env.DATABASE_SITE_URL}/check-username?username=${username}`
      );

      // Assume endpoint returns { available: true/false }
      setUsernameAvailable(res.data.available);
    } catch (error) {
      console.error(error);
      setUsernameAvailable(false); // Treat errors as "username not available"
    }
    setCheckingUsername(false); // End loading
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation
    if (
      !name.trim() ||
      !username.trim() ||
      !email ||
      !password ||
      !reEnterPassword
    ) {
      return toast.error("Please fill in all fields!");
    }

    if (password !== reEnterPassword) {
      return toast.error("Passwords do not match!");
    }

    if (!usernameAvailable) {
      return toast.error("Username is already taken!");
    }

    setLoading(true);
    try {
      const res = await axios.post(`${process.env.DATABASE_SITE_URL}/signup`, {
        name,
        username,
        email,
        password,
      });

      const { userId } = res.data;

      if (res.status === 200 || res.status === 201) {
        toast.success("User has been registered!");
        setLoading(false);

        // Redirect to email verification
        await fetch(`/api/signup?userId=${userId}`);
        return router.push("/auth/verify-email");
      } else {
        toast.error(res.data.message);
        setLoading(false);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occurred");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Full Name */}
      <div className="mb-4">
        <label
          htmlFor="name"
          className="mb-2.5 block font-medium text-dark dark:text-white"
        >
          Full Name
        </label>
        <input
          type="text"
          placeholder="Enter your full name"
          value={name}
          name="name"
          onChange={handleChange}
          className="w-full rounded-lg border border-stroke bg-transparent py-[15px] pl-6 pr-11 font-medium text-dark outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
        />
      </div>

      {/* Username */}
      <div className="mb-4">
        <label
          htmlFor="username"
          className="mb-2.5 block font-medium text-dark dark:text-white"
        >
          Username
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="Choose a username"
            value={username}
            name="username"
            onChange={handleChange}
            className={`w-full rounded-lg border py-[15px] pl-6 pr-11 font-medium text-dark outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary ${
              usernameAvailable === false
                ? "border-red-500 focus:border-red-500"
                : usernameAvailable === true
                ? "border-green-500 focus:border-green-500"
                : "border-stroke"
            }`}
          />
          {checkingUsername && (
            <span className="absolute right-4.5 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
              Checking...
            </span>
          )}
          {usernameAvailable !== null && !checkingUsername && (
            <span
              className={`absolute right-4.5 top-1/2 -translate-y-1/2 ${
                usernameAvailable ? "text-green-500" : "text-red-500"
              }`}
            >
              {usernameAvailable ? "✓ Available" : "✗ Taken"}
            </span>
          )}
        </div>
      </div>

      {/* Email */}
      <div className="mb-4">
        <label
          htmlFor="email"
          className="mb-2.5 block font-medium text-dark dark:text-white"
        >
          Email
        </label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          name="email"
          onChange={handleChange}
          className="w-full rounded-lg border border-stroke bg-transparent py-[15px] pl-6 pr-11 font-medium text-dark outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
        />
      </div>

      {/* Password */}
      <div className="mb-4">
        <label
          htmlFor="password"
          className="mb-2.5 block font-medium text-dark dark:text-white"
        >
          Password
        </label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          name="password"
          onChange={handleChange}
          className="w-full rounded-lg border border-stroke bg-transparent py-[15px] pl-6 pr-11 font-medium text-dark outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
        />
      </div>

      {/* Confirm Password */}
      <div className="mb-6">
        <label
          htmlFor="reEnterPassword"
          className="mb-2.5 block font-medium text-dark dark:text-white"
        >
          Re-enter Password
        </label>
        <input
          type="password"
          placeholder="Re-enter your password"
          value={reEnterPassword}
          name="reEnterPassword"
          onChange={handleChange}
          className="w-full rounded-lg border border-stroke bg-transparent py-[15px] pl-6 pr-11 font-medium text-dark outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
        />
      </div>

      {/* Submit Button */}
      <div className="mb-5">
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary p-4 font-medium text-white transition hover:bg-opacity-90"
        >
          Create account
          {loading && (
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent"></span>
          )}
        </button>
      </div>
      {/* Business Signup Link */}
      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        Are you a business?{" "}
        <a
          href="/auth/business-signup"
          className="text-primary hover:underline"
        >
          Create a Business Account
        </a>
      </div>
    </form>
  );
};

export default SignupWithPassword;

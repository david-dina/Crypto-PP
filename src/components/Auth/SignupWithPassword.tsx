import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import generateRandomString from "@/hooks/generateRandomString";

const SignupWithPassword = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    reEnterPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<null | boolean>(
    null
  ); // Tracks username availability

  const { name, email, username, password, reEnterPassword } = data;
  const router = useRouter();

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Update form data
    setData({
      ...data,
      [name]: value,
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
    if (!name.trim() || !email || !username || !password || !reEnterPassword) {
      return toast.error("Please fill in all fields!");
    }
    if (password !== reEnterPassword) {
      return toast.error("Passwords do not match");
    }
    if (!usernameAvailable) {
      return toast.error("Username is not available!");
    }

    setLoading(true);
    const code = generateRandomString();
    try {
      const res = await axios.post(`/api/signups`, {
        name,
        username,
        email,
        password,
        code,
      });

      if (res.status === 200 || res.status === 201) {
        toast.success("Successfully Registered.");
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
      {/* Name Input */}
      <div className="mb-4">
        <label htmlFor="name" className="mb-2.5 block font-medium text-dark dark:text-white">
          Name
        </label>
        <input
          type="text"
          placeholder="Enter your full name"
          value={name}
          name="name"
          onChange={handleChange}
          className="w-full rounded-lg border border-stroke bg-transparent py-[15px] px-6 font-medium text-dark outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
        />
      </div>

      {/* Username Input */}
      <div className="mb-4">
        <label htmlFor="username" className="mb-2.5 block font-medium text-dark dark:text-white">
          Username
        </label>
        <input
          type="text"
          placeholder="Enter a username"
          value={username}
          name="username"
          onChange={handleChange}
          className="w-full rounded-lg border border-stroke bg-transparent py-[15px] px-6 font-medium text-dark outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
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
      </div>

      {/* Email Input */}
      <div className="mb-4">
        <label htmlFor="email" className="mb-2.5 block font-medium text-dark dark:text-white">
          Email
        </label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          name="email"
          onChange={handleChange}
          className="w-full rounded-lg border border-stroke bg-transparent py-[15px] px-6 font-medium text-dark outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
        />
      </div>

      {/* Password Input */}
      <div className="mb-4">
        <label htmlFor="password" className="mb-2.5 block font-medium text-dark dark:text-white">
          Password
        </label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          name="password"
          onChange={handleChange}
          className="w-full rounded-lg border border-stroke bg-transparent py-[15px] px-6 font-medium text-dark outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
        />
      </div>

      {/* Re-Enter Password Input */}
      <div className="mb-4">
        <label htmlFor="reEnterPassword" className="mb-2.5 block font-medium text-dark dark:text-white">
          Re-type Password
        </label>
        <input
          type="password"
          placeholder="Re-enter your password"
          value={reEnterPassword}
          name="reEnterPassword"
          onChange={handleChange}
          className="w-full rounded-lg border border-stroke bg-transparent py-[15px] px-6 font-medium text-dark outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
        />
      </div>

      {/* Submit Button */}
      <div className="mb-5">
        <button
          type="submit"
          disabled={loading || checkingUsername}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary p-4 font-medium text-white transition hover:bg-opacity-90"
        >
          Create Account
          {loading && (
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent"></span>
          )}
        </button>
      </div>
    </form>
  );
};

export default SignupWithPassword;

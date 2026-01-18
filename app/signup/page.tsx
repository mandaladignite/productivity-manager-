"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";

export default function Signup() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await api.auth.register({ name, email, password });
      
      // Token is stored via interceptor, and cookie is set by backend
      // Store token in localStorage as fallback
      if (response.token && typeof window !== "undefined") {
        localStorage.setItem("token", response.token);
      }

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Registration failed. Please try again.");
      console.error("Registration error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Signup Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {/* Logo & Welcome */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-xl bg-blue-600 flex items-center justify-center mb-4">
              <span className="text-white text-2xl font-bold">PM</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Get Started</h1>
            <p className="text-gray-500 mt-1">Create your free account</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Signup Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white text-gray-900 placeholder-gray-500"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white text-gray-900 placeholder-gray-500"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Create Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white text-gray-900 placeholder-gray-500"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Use at least 6 characters
              </p>
            </div>

            {/* Terms & Privacy */}
            <div className="flex items-start">
              <input
                type="checkbox"
                id="terms"
                required
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-700">
                I agree to the{" "}
                <a href="#" className="text-blue-600 hover:text-blue-800">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-blue-600 hover:text-blue-800">
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Create Account Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Onboarding Features */}
          <div className="mt-8 pt-8 border-t border-gray-100">
            <h3 className="text-sm font-medium text-gray-700 mb-4">
              Start your productivity journey
            </h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5 mr-3">
                  <svg
                    className="w-3 h-3 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-sm text-gray-600">
                  Track tasks and habits in one place
                </span>
              </div>
              <div className="flex items-start">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5 mr-3">
                  <svg
                    className="w-3 h-3 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-sm text-gray-600">
                  Visualize progress with insights
                </span>
              </div>
              <div className="flex items-start">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5 mr-3">
                  <svg
                    className="w-3 h-3 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-sm text-gray-600">
                  Join thousands improving daily
                </span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="my-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Already have an account?</span>
            </div>
          </div>

          {/* Sign In */}
          <div className="text-center">
            <p className="text-gray-600">
              Already registered?{" "}
              <Link href="/login" className="font-medium text-blue-600 hover:text-blue-800 ml-1">
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>© 2023 Productivity Manager. All rights reserved.</p>
          <p className="mt-1">
            <a href="#" className="hover:text-gray-700">
              Help Center
            </a>
            <span className="mx-2">•</span>
            <a href="#" className="hover:text-gray-700">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

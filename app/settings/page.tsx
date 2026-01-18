"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AppLayout from "@/components/layout/AppLayout";
import BottomNav from "@/components/navigation/BottomNav";
import Button from "@/components/ui/Button";
import Loading from "@/components/ui/Loading";
import api from "@/lib/api";

export default function Settings() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.auth.getCurrentUser();
      setUser(response.user);
      setName(response.user?.name || "");
      setEmail(response.user?.email || "");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load user data");
      console.error("Error fetching user:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.auth.logout();
      localStorage.removeItem("token");
      router.push("/login");
    } catch (err: any) {
      console.error("Error logging out:", err);
      // Still redirect even if logout fails
      localStorage.removeItem("token");
      router.push("/login");
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="max-w-4xl mx-auto">
          <Loading />
        </div>
      </AppLayout>
    );
  }

  return (
    <>
      <AppLayout>
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Settings</h1>
                <p className="text-gray-500 mt-1">Manage your account and preferences</p>
              </div>
              <div className="mt-4 md:mt-0 flex gap-3">
                <Button 
                  variant="secondary" 
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Settings Grid */}
          <div className="space-y-8">
            {/* Section 1: Profile */}
            <section className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-surface-50">
                <h2 className="font-semibold text-gray-800 text-lg">Profile</h2>
                <p className="text-sm text-gray-500 mt-1">Manage your personal information</p>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  {/* Avatar */}
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-2xl font-medium text-gray-600">
                        {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                      </span>
                    </div>
                    <div>
                      <Button variant="secondary">Change Photo</Button>
                      <p className="text-xs text-gray-500 mt-2">JPG, PNG or GIF, max 2MB</p>
                    </div>
                  </div>

                  {/* Form Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                      <textarea
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32 resize-none bg-white text-gray-900"
                        defaultValue="Productivity enthusiast and project manager. Focused on building effective workflows."
                      ></textarea>
                      <p className="text-xs text-gray-500 mt-2">
                        Brief description for your profile
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2: Preferences */}
            <section className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-surface-50">
                <h2 className="font-semibold text-gray-800 text-lg">Preferences</h2>
                <p className="text-sm text-gray-500 mt-1">Customize your experience</p>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Language */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Language
                      </label>
                      <div className="relative">
                        <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white text-gray-900">
                          <option selected>English</option>
                          <option>Spanish</option>
                          <option>French</option>
                          <option>German</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Timezone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Timezone
                      </label>
                      <div className="relative">
                        <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white text-gray-900">
                          <option selected>GMT-5: Eastern Time (ET)</option>
                          <option>GMT-8: Pacific Time (PT)</option>
                          <option>GMT+0: Greenwich Mean Time (GMT)</option>
                          <option>GMT+1: Central European Time (CET)</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Notifications */}
                  <div className="pt-6 border-t border-gray-100">
                    <h3 className="font-medium text-gray-800 mb-4">Notifications</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-700">Email Notifications</div>
                          <div className="text-sm text-gray-500">Receive updates via email</div>
                        </div>
                        <div className="relative">
                          <input type="checkbox" id="emailNotif" className="sr-only" defaultChecked />
                          <label
                            htmlFor="emailNotif"
                            className="block w-12 h-6 rounded-full bg-blue-600 cursor-pointer transition-colors"
                          >
                            <span className="block w-5 h-5 mt-0.5 ml-0.5 rounded-full bg-white transition-transform duration-300 transform translate-x-6"></span>
                          </label>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-700">Push Notifications</div>
                          <div className="text-sm text-gray-500">Receive in-app notifications</div>
                        </div>
                        <div className="relative">
                          <input type="checkbox" id="pushNotif" className="sr-only" />
                          <label
                            htmlFor="pushNotif"
                            className="block w-12 h-6 rounded-full bg-gray-300 cursor-pointer transition-colors hover:bg-gray-400"
                          >
                            <span className="block w-5 h-5 mt-0.5 ml-0.5 rounded-full bg-white transition-transform duration-300"></span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3: Security */}
            <section className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-surface-50">
                <h2 className="font-semibold text-gray-800 text-lg">Security</h2>
                <p className="text-sm text-gray-500 mt-1">Manage your account security</p>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Change Password
                    </label>
                    <div className="space-y-4">
                      <input
                        type="password"
                        placeholder="Current Password"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                      />
                      <input
                        type="password"
                        placeholder="New Password"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                      />
                      <input
                        type="password"
                        placeholder="Confirm New Password"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                      />
                    </div>
                    <Button variant="primary" className="mt-4 bg-gray-800 hover:bg-gray-900">
                      Update Password
                    </Button>
                  </div>

                  {/* Two-Factor Authentication */}
                  <div className="pt-6 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-700">Two-Factor Authentication</div>
                        <div className="text-sm text-gray-500">Add an extra layer of security</div>
                      </div>
                      <div className="relative">
                        <input type="checkbox" id="twoFactor" className="sr-only" />
                        <label
                          htmlFor="twoFactor"
                          className="block w-12 h-6 rounded-full bg-gray-300 cursor-pointer transition-colors hover:bg-gray-400"
                        >
                          <span className="block w-5 h-5 mt-0.5 ml-0.5 rounded-full bg-white transition-transform duration-300"></span>
                        </label>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-3">
                      When enabled, you'll need to enter a code from your authenticator app when
                      signing in.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Footer Actions */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="text-sm text-gray-500">
                <p>All changes are automatically saved to draft.</p>
              </div>
              <div className="mt-4 md:mt-0 flex gap-3">
                <Button variant="secondary">Discard Changes</Button>
                <Button variant="primary" className="bg-gray-800 hover:bg-gray-900">
                  Save All Settings
                </Button>
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
      <BottomNav />
    </>
  );
}

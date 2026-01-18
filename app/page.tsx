"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle, TrendingUp, Zap, ArrowRight, BarChart3 } from "lucide-react";
import Button from "@/components/ui/Button";

export default function LandingPage() {
  const router = useRouter();

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Habit Tracking",
      description: "Build consistency with daily habit tracking. Track streaks and celebrate your progress.",
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Productivity Insights",
      description: "Get insights into your productivity patterns and make data-driven improvements.",
    },
  ];

  const benefits = [
    "Track habits in one place",
    "Visualize progress with insights",
    "Build consistent daily routines",
    "Stay organized and focused",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                <span className="text-white text-lg font-bold">PM</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Productivity Manager</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                Sign In
              </Link>
              <Button
                onClick={() => router.push("/signup")}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Take Control of Your
            <span className="text-blue-600"> Productivity</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            The all-in-one platform to track habits and boost productivity. 
            Build better routines and achieve your goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => router.push("/signup")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              onClick={() => router.push("/login")}
              variant="secondary"
              className="px-8 py-3 text-lg"
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Stay Productive
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Powerful features designed to help you manage your time, build habits, and achieve your goals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Why Choose Productivity Manager?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Join thousands of users who are improving their productivity every day. 
                Our platform makes it easy to stay organized and focused on what matters.
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-lg">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                    PM
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">All-in-One Platform</div>
                    <div className="text-sm text-gray-600">Track habits and boost productivity</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
                  <TrendingUp className="w-12 h-12 text-green-600" />
                  <div>
                    <div className="font-semibold text-gray-900">Track Your Progress</div>
                    <div className="text-sm text-gray-600">Visualize your productivity with insights</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-lg">
                  <Zap className="w-12 h-12 text-purple-600" />
                  <div>
                    <div className="font-semibold text-gray-900">Build Better Habits</div>
                    <div className="text-sm text-gray-600">Consistency is key to success</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Boost Your Productivity?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Start your free account today and take the first step towards a more organized and productive life.
          </p>
          <Button
            onClick={() => router.push("/signup")}
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
          >
            Get Started for Free
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <span className="text-white text-sm font-bold">PM</span>
              </div>
              <span className="text-gray-900 font-semibold">Productivity Manager</span>
            </div>
            <div className="flex gap-6 text-sm text-gray-600">
              <Link href="#" className="hover:text-gray-900 transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-gray-900 transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="hover:text-gray-900 transition-colors">
                Contact
              </Link>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-gray-500">
            © 2024 Productivity Manager. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

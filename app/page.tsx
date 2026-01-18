"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle, TrendingUp, Zap, ArrowRight, BarChart3, Calendar, Target, Users, Sparkles, Shield, Clock } from "lucide-react";
import Button from "@/components/ui/Button";

export default function LandingPage() {
  const router = useRouter();

  const features = [
    {
      icon: <Zap className="w-7 h-7" />,
      title: "Smart Habit Tracking",
      description: "Build lasting habits with intelligent tracking, reminders, and streak visualization.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <BarChart3 className="w-7 h-7" />,
      title: "Productivity Analytics",
      description: "Gain deep insights into your productivity patterns with beautiful, actionable charts.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <Calendar className="w-7 h-7" />,
      title: "Smart Scheduling",
      description: "Plan your day efficiently with AI-powered scheduling that adapts to your rhythm.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <Target className="w-7 h-7" />,
      title: "Goal Setting",
      description: "Set, track, and achieve your goals with milestone tracking and progress updates.",
      color: "from-orange-500 to-red-500"
    }
  ];

  const benefits = [
    { text: "30% average productivity increase", icon: <TrendingUp className="w-5 h-5" /> },
    { text: "Join 10,000+ successful users", icon: <Users className="w-5 h-5" /> },
    { text: "94% user satisfaction rate", icon: <Sparkles className="w-5 h-5" /> },
    { text: "Bank-level security", icon: <Shield className="w-5 h-5" /> },
    { text: "Save 12+ hours weekly", icon: <Clock className="w-5 h-5" /> },
    { text: "Available on all devices", icon: <Zap className="w-5 h-5" /> }
  ];

  const testimonials = [
    {
      name: "Alex Johnson",
      role: "Software Engineer",
      content: "Productivity Manager transformed how I work. My daily output increased by 40% in just 2 months!",
      avatar: "AJ"
    },
    {
      name: "Sarah Chen",
      role: "Entrepreneur",
      content: "The habit tracking feature alone was worth it. Finally built a consistent morning routine.",
      avatar: "SC"
    },
    {
      name: "Marcus Rivera",
      role: "Student",
      content: "Perfect for balancing studies and personal projects. The insights helped me optimize my schedule.",
      avatar: "MR"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  ProManage
                </span>
                <div className="text-xs text-gray-500 font-medium">by Productivity Manager</div>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Features
              </Link>
              <Link href="#testimonials" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Testimonials
              </Link>
              <Link href="#pricing" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Pricing
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <Button
                onClick={() => router.push("/login")}
                variant="ghost"
                className="text-gray-700 hover:text-gray-900"
              >
                Sign In
              </Button>
              <Button
                onClick={() => router.push("/signup")}
                className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl transition-all"
              >
                Start Free Trial
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            Join 10,000+ productive professionals
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Transform Your
            <span className="block">
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Productivity Journey
              </span>
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            The intelligent platform that helps you build better habits, achieve more, 
            and find balance in your daily life.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button
              onClick={() => router.push("/signup")}
              className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-10 py-4 text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all group"
            >
              Start Free 14-Day Trial
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              onClick={() => router.push("/login")}
              variant="secondary"
              className="px-10 py-4 text-lg font-semibold rounded-xl border-2"
            >
              Book a Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
            {benefits.slice(0, 4).map((benefit, index) => (
              <div key={index} className="text-center p-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center mx-auto mb-3">
                  <div className="text-blue-600">
                    {benefit.icon}
                  </div>
                </div>
                <p className="text-sm text-gray-600 font-medium">{benefit.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Everything You Need to
              <span className="text-blue-600"> Succeed</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful features designed with one goal: to help you become your most productive self.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative p-8 bg-white rounded-2xl border border-gray-200 hover:border-transparent hover:shadow-2xl transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg`}>
                    <div className="text-white">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <button className="text-blue-600 font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                      Learn more
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Loved by
              <span className="text-blue-600"> Productive People</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See what our users have to say about their productivity transformation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="p-8 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                    <span className="text-blue-700 font-bold text-lg">{testimonial.avatar}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.content}"</p>
                <div className="flex gap-1 mt-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500" />
            <div className="relative px-8 py-16 md:py-20 text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Transform Your Productivity?
              </h2>
              <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                Join thousands who've already taken control of their time and achieved more.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  onClick={() => router.push("/signup")}
                  className="bg-white text-blue-600 hover:bg-gray-100 px-10 py-4 text-lg font-bold rounded-xl shadow-2xl hover:shadow-3xl transition-all group"
                >
                  Start Free 14-Day Trial
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
                </Button>
                <Button
                  onClick={() => router.push("/login")}
                  variant="ghost"
                  className="text-white border-2 border-white/30 hover:bg-white/10 px-10 py-4 text-lg font-semibold rounded-xl"
                >
                  Schedule a Demo
                </Button>
              </div>
              
              <p className="mt-8 text-sm text-blue-200">
                No credit card required • Cancel anytime • 24/7 Support
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">ProManage</span>
              </div>
              <p className="text-gray-400">
                Empowering individuals and teams to achieve their full potential through intelligent productivity tools.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-bold text-lg mb-6">Product</h4>
              <ul className="space-y-3">
                <li><Link href="#" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Updates</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Roadmap</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold text-lg mb-6">Company</h4>
              <ul className="space-y-3">
                <li><Link href="#" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Press</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold text-lg mb-6">Legal</h4>
              <ul className="space-y-3">
                <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Cookie Policy</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">GDPR</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
            © 2024 ProManage. All rights reserved. Made with ❤️ for productive people everywhere.
          </div>
        </div>
      </footer>
    </div>
  );
}

function Star(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}
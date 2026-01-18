"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AppLayout from "@/components/layout/AppLayout";
import BottomNav from "@/components/navigation/BottomNav";
import Drawer from "@/components/ui/Drawer";
import HabitForm from "@/components/forms/HabitForm";
import Card from "@/components/ui/Card";
import Loading from "@/components/ui/Loading";
import { TrendingUp, Activity, Target, AlertCircle, Calendar, BarChart3, TrendingDown } from "lucide-react";
import api, { Habit } from "@/lib/api";

export default function Dashboard() {
  const router = useRouter();
  const [isHabitDrawerOpen, setIsHabitDrawerOpen] = useState(false);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Calculate completion percentages for different time periods
  const calculateCompletionRate = (habits: Habit[], startDate: Date, endDate: Date): number => {
    if (habits.length === 0) return 0;
    
    let totalCompletions = 0;
    let totalPossible = 0;
    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    habits.forEach((habit) => {
      const completions = habit.completionHistory?.filter((entry) => {
        const entryDate = new Date(entry.date);
        entryDate.setHours(0, 0, 0, 0);
        return entryDate >= startDate && entryDate <= endDate && entry.completed;
      }).length || 0;
      
      totalCompletions += completions;
      totalPossible += daysDiff;
    });
    
    return totalPossible > 0 ? Math.round((totalCompletions / totalPossible) * 100) : 0;
  };

  // Daily completion (today)
  const dailyCompletion = (() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return calculateCompletionRate(habits, today, today);
  })();

  // Weekly completion (last 7 days)
  const weeklyCompletion = (() => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 6);
    weekAgo.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return calculateCompletionRate(habits, weekAgo, today);
  })();

  // Monthly completion (current month)
  const monthlyCompletion = (() => {
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return calculateCompletionRate(habits, monthStart, today);
  })();

  // Yearly completion (current year)
  const yearlyCompletion = (() => {
    const yearStart = new Date();
    yearStart.setMonth(0, 1);
    yearStart.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return calculateCompletionRate(habits, yearStart, today);
  })();

  useEffect(() => {
    fetchDashboardData();
    const handleOpenHabitDrawer = () => setIsHabitDrawerOpen(true);
    
    window.addEventListener("openHabitDrawer", handleOpenHabitDrawer);
    
    return () => {
      window.removeEventListener("openHabitDrawer", handleOpenHabitDrawer);
    };
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      const habitsResponse = await api.habits.getAll();
      
      setHabits(habitsResponse.habits || []);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load dashboard data");
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleHabitSubmit = async (data: any) => {
    try {
      setError("");
      await api.habits.create({
        name: data.name,
        description: data.description || "",
        frequency: "daily",
        timeOfDay: data.timeOfDay || "anytime",
        goalType: data.goalType || "none",
        goalTarget: data.goalTarget || undefined,
        goalDate: data.goalDate || undefined,
      });
      setIsHabitDrawerOpen(false);
      await fetchDashboardData();
      router.push("/habits");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create habit");
      console.error("Error creating habit:", err);
    }
  };

  // Calculate today's completion for the widget
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const completedHabitsToday = habits.filter((h) => {
    return h.completionHistory?.some((entry) => {
      const entryDate = new Date(entry.date);
      entryDate.setHours(0, 0, 0, 0);
      return entryDate.getTime() === today.getTime() && entry.completed;
    });
  }).length;

  const habitCompletionRate = dailyCompletion;

  return (
    <>
      <AppLayout>
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Situational Awareness
            </h1>
            <p className="text-gray-700">Quick overview and action dashboard</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <Card>
              <Loading />
            </Card>
          ) : (
            <>
              {/* Completion Statistics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {/* Daily Completion */}
                <Card className="p-6" variant="elevated">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{dailyCompletion}%</div>
                  <div className="text-sm text-gray-600 mb-3">Daily Completion</div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        dailyCompletion >= 80 ? "bg-green-500" :
                        dailyCompletion >= 60 ? "bg-blue-500" :
                        dailyCompletion >= 40 ? "bg-yellow-500" :
                        "bg-red-500"
                      }`}
                      style={{ width: `${dailyCompletion}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    {completedHabitsToday} of {habits.length} completed today
                  </div>
                </Card>

                {/* Weekly Completion */}
                <Card className="p-6" variant="elevated">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-purple-600" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{weeklyCompletion}%</div>
                  <div className="text-sm text-gray-600 mb-3">Weekly Completion</div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        weeklyCompletion >= 80 ? "bg-green-500" :
                        weeklyCompletion >= 60 ? "bg-blue-500" :
                        weeklyCompletion >= 40 ? "bg-yellow-500" :
                        "bg-red-500"
                      }`}
                      style={{ width: `${weeklyCompletion}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    Last 7 days average
                  </div>
                </Card>

                {/* Monthly Completion */}
                <Card className="p-6" variant="elevated">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{monthlyCompletion}%</div>
                  <div className="text-sm text-gray-600 mb-3">Monthly Completion</div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        monthlyCompletion >= 80 ? "bg-green-500" :
                        monthlyCompletion >= 60 ? "bg-blue-500" :
                        monthlyCompletion >= 40 ? "bg-yellow-500" :
                        "bg-red-500"
                      }`}
                      style={{ width: `${monthlyCompletion}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    This month's progress
                  </div>
                </Card>

                {/* Yearly Completion */}
                <Card className="p-6" variant="elevated">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                      <Target className="w-5 h-5 text-orange-600" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{yearlyCompletion}%</div>
                  <div className="text-sm text-gray-600 mb-3">Yearly Completion</div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        yearlyCompletion >= 80 ? "bg-green-500" :
                        yearlyCompletion >= 60 ? "bg-blue-500" :
                        yearlyCompletion >= 40 ? "bg-yellow-500" :
                        "bg-red-500"
                      }`}
                      style={{ width: `${yearlyCompletion}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    This year's progress
                  </div>
                </Card>
              </div>

              {/* Widget Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Widget 1: Habit Completion */}
                <Card className="p-6" variant="elevated">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-gray-900">Today's Progress</h2>
                    <span className="text-gray-600 text-sm">Daily</span>
                  </div>
                  <div className="flex-grow flex items-center justify-center my-4">
                    <div className="relative w-32 h-32">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-3xl font-bold text-gray-900">{dailyCompletion}%</div>
                      </div>
                      <svg
                        className="w-full h-full transform -rotate-90"
                        viewBox="0 0 100 100"
                      >
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="#e5e7eb"
                          strokeWidth="8"
                          fill="none"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke={
                            dailyCompletion >= 80 ? "#10b981" :
                            dailyCompletion >= 60 ? "#3b82f6" :
                            dailyCompletion >= 40 ? "#f59e0b" :
                            "#ef4444"
                          }
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray="251.2"
                          strokeDashoffset={251.2 * (1 - dailyCompletion / 100)}
                          strokeLinecap="round"
                          className="transition-all duration-500"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {habits.slice(0, 2).map((habit) => {
                      const isCompleted = habit.completionHistory?.some((entry) => {
                        const entryDate = new Date(entry.date);
                        entryDate.setHours(0, 0, 0, 0);
                        return entryDate.getTime() === today.getTime() && entry.completed;
                      });
                      return (
                        <div key={habit._id || habit.id} className="flex justify-between text-sm">
                          <span className="text-gray-700 truncate">{habit.name}</span>
                          <span className={`font-semibold ${isCompleted ? "text-green-600" : "text-gray-400"}`}>
                            {isCompleted ? "✓" : "○"}
                          </span>
                        </div>
                      );
                    })}
                    {habits.length === 0 && (
                      <div className="text-sm text-gray-500 py-2">No habits yet</div>
                    )}
                  </div>
                </Card>

                {/* Widget 2: Completion Comparison */}
                <Card className="p-6" variant="elevated">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-gray-900">Completion Trends</h2>
                    <Activity className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Daily</span>
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${dailyCompletion}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-semibold text-gray-900 w-12 text-right">{dailyCompletion}%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Weekly</span>
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-purple-500 h-2 rounded-full"
                            style={{ width: `${weeklyCompletion}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-semibold text-gray-900 w-12 text-right">{weeklyCompletion}%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Monthly</span>
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${monthlyCompletion}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-semibold text-gray-900 w-12 text-right">{monthlyCompletion}%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Yearly</span>
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-orange-500 h-2 rounded-full"
                            style={{ width: `${yearlyCompletion}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-semibold text-gray-900 w-12 text-right">{yearlyCompletion}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Trend</span>
                      <span className={`font-medium flex items-center gap-1 ${
                        weeklyCompletion > dailyCompletion ? "text-green-600" :
                        weeklyCompletion < dailyCompletion ? "text-red-600" :
                        "text-gray-600"
                      }`}>
                        {weeklyCompletion > dailyCompletion ? (
                          <>
                            <TrendingUp className="w-3 h-3" />
                            Improving
                          </>
                        ) : weeklyCompletion < dailyCompletion ? (
                          <>
                            <TrendingDown className="w-3 h-3" />
                            Declining
                          </>
                        ) : (
                          "Stable"
                        )}
                      </span>
                    </div>
                  </div>
                </Card>

                {/* Widget 3: Summary Stats */}
                <Card className="p-6" variant="elevated">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-gray-900">Summary</h2>
                    <AlertCircle className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Total Habits</span>
                        <span className="font-semibold text-gray-900">{habits.length}</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Completed Today</span>
                        <span className="font-semibold text-green-600">{completedHabitsToday}/{habits.length}</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Best Performance</span>
                        <span className="font-semibold text-gray-900">
                          {Math.max(dailyCompletion, weeklyCompletion, monthlyCompletion, yearlyCompletion)}%
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Average Rate</span>
                        <span className="font-semibold text-gray-900">
                          {Math.round((dailyCompletion + weeklyCompletion + monthlyCompletion + yearlyCompletion) / 4)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

          {/* Action Section */}
          <Card className="mt-8 p-6" variant="elevated">
            <h2 className="font-semibold text-gray-900 mb-4">Recommended Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-green-200 bg-green-50 rounded-lg cursor-pointer hover:bg-green-100 transition-colors">
                <div className="font-semibold text-green-900 text-sm mb-2">
                  Schedule focus time
                </div>
                <p className="text-green-700 text-xs">Based on productivity patterns</p>
              </div>
              <div className="p-4 border border-purple-200 bg-purple-50 rounded-lg cursor-pointer hover:bg-purple-100 transition-colors">
                <div className="font-semibold text-purple-900 text-sm mb-2">
                  Plan tomorrow
                </div>
                <p className="text-purple-700 text-xs">Set up for successful morning</p>
              </div>
            </div>
          </Card>

              {/* Footer Note */}
              <div className="mt-6 text-center text-gray-600 text-sm">
                Last updated: {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} • Auto-refresh every 15 min
              </div>
            </>
          )}
        </div>
      </AppLayout>

      {/* Habit Creation Drawer */}
      <Drawer
        isOpen={isHabitDrawerOpen}
        onClose={() => setIsHabitDrawerOpen(false)}
        title="Create New Habit"
        footer={null}
      >
        <HabitForm
          onSubmit={handleHabitSubmit}
          onCancel={() => setIsHabitDrawerOpen(false)}
        />
      </Drawer>

      <BottomNav />
    </>
  );
}

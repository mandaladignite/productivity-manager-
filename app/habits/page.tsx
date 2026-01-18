"use client";

import { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import BottomNav from "@/components/navigation/BottomNav";
import Drawer from "@/components/ui/Drawer";
import HabitForm from "@/components/forms/HabitForm";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Loading from "@/components/ui/Loading";
import api, { Habit as APIHabit } from "@/lib/api";
import { transformHabitsFromAPI, UIHabit } from "@/lib/habitUtils";
import { 
  Zap, 
  Plus, 
  Check, 
  Flame, 
  TrendingUp, 
  Calendar,
  Target,
  Trophy,
  Trash2,
  BarChart3,
  Activity,
  TrendingDown,
  Clock,
  Award
} from "lucide-react";

export default function HabitTracker() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [habits, setHabits] = useState<UIHabit[]>([]);
  const [rawHabits, setRawHabits] = useState<APIHabit[]>([]); // Store raw API data for analytics
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Calculate analytics
  const completedCount = habits.filter((h) => h.completed).length;
  const completionRate = habits.length > 0 
    ? Math.round((completedCount / habits.length) * 100) 
    : 0;
  const maxStreak = habits.length > 0 
    ? Math.max(...habits.map((h) => h.streak), 0) 
    : 0;

  // Calculate completion rates using raw API data with completionHistory
  const calculateCompletionRateForPeriod = (startDate: Date, endDate: Date): number => {
    if (rawHabits.length === 0) return 0;
    
    let totalCompletions = 0;
    let totalPossible = 0;
    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    rawHabits.forEach((habit) => {
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
    return calculateCompletionRateForPeriod(today, today);
  })();

  // Weekly completion (last 7 days)
  const weeklyCompletion = (() => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 6);
    weekAgo.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return calculateCompletionRateForPeriod(weekAgo, today);
  })();

  // Monthly completion (current month)
  const monthlyCompletion = (() => {
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return calculateCompletionRateForPeriod(monthStart, today);
  })();

  // Yearly completion (current year)
  const yearlyCompletion = (() => {
    const yearStart = new Date();
    yearStart.setMonth(0, 1);
    yearStart.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return calculateCompletionRateForPeriod(yearStart, today);
  })();

  // Calculate additional analytics
  const totalCompletions = habits.reduce((sum, h) => sum + (h.completions || 0), 0);
  const avgStreak = habits.length > 0 
    ? Math.round(habits.reduce((sum, h) => sum + h.streak, 0) / habits.length) 
    : 0;
  const habitsWithGoals = habits.filter((h) => h.goalType && h.goalType !== "none").length;
  const activeStreaks = habits.filter((h) => h.streak > 0).length;
  const perfectDays = habits.filter((h) => h.completed && h.streak > 0).length;

  useEffect(() => {
    fetchHabits();
    const handleOpenDrawer = () => setIsDrawerOpen(true);
    window.addEventListener("openHabitDrawer", handleOpenDrawer);
    return () => window.removeEventListener("openHabitDrawer", handleOpenDrawer);
  }, []);

  const fetchHabits = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.habits.getAll();
      const apiHabits = response.habits || [];
      setRawHabits(apiHabits); // Store raw data for analytics
      const transformedHabits = transformHabitsFromAPI(apiHabits);
      setHabits(transformedHabits);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load habits");
      console.error("Error fetching habits:", err);
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
        frequency: data.frequency || "daily",
        timeOfDay: data.timeOfDay || "anytime",
        goalType: data.goalType || "none",
        goalTarget: data.goalType !== "none" ? data.goalTarget : undefined,
        goalDate: data.goalType !== "none" ? data.goalDate : undefined,
      });
      setIsDrawerOpen(false);
      await fetchHabits(); // Refresh list
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create habit");
      console.error("Error creating habit:", err);
    }
  };

  const toggleHabit = async (id: string | number) => {
    try {
      setError("");
      await api.habits.toggleCompletion(String(id));
      await fetchHabits(); // Refresh list to get updated streak and completion status
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to toggle habit completion");
      console.error("Error toggling habit:", err);
    }
  };

  const deleteHabit = async (id: string | number) => {
    if (!confirm("Are you sure you want to delete this habit?")) {
      return;
    }

    try {
      setError("");
      await api.habits.delete(String(id));
      await fetchHabits(); // Refresh list
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete habit");
      console.error("Error deleting habit:", err);
    }
  };

  const calculateGoalProgress = (habit: UIHabit): number => {
    if (!habit.goalTarget || habit.completions === undefined) return 0;
    return Math.min(100, Math.round((habit.completions / habit.goalTarget) * 100));
  };

  const getStreakIcon = (streak: number) => {
    if (streak >= 30) return <Flame className="w-5 h-5 text-orange-500" />;
    if (streak >= 14) return <Zap className="w-5 h-5 text-yellow-500" />;
    return <Flame className="w-5 h-5 text-gray-400" />;
  };

  return (
    <>
      <AppLayout>
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Habit Tracker
                </h1>
                <p className="text-gray-600">Build consistency, one day at a time</p>
              </div>
              <div className="mt-4 md:mt-0">
                <Button
                  onClick={() => setIsDrawerOpen(true)}
                  className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  New Habit
                </Button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Zap className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900">{habits.length}</div>
                <div className="text-sm text-gray-600 mt-1">Active Habits</div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-blue-600">{completionRate}%</div>
                <div className="text-sm text-gray-600 mt-1">Today's Progress</div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Flame className="w-5 h-5 text-orange-500" />
                </div>
                <div className="text-3xl font-bold text-orange-600">{maxStreak}</div>
                <div className="text-sm text-gray-600 mt-1">Best Streak</div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Trophy className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-3xl font-bold text-purple-600">{weeklyCompletion}%</div>
                <div className="text-sm text-gray-600 mt-1">Weekly Avg</div>
              </Card>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Habit List */}
            <div className="lg:col-span-2 space-y-4">
              {loading ? (
                <Card className="p-12 text-center">
                  <Loading />
                </Card>
              ) : habits.length === 0 ? (
                <Card className="p-12 text-center">
                  <Zap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No habits yet</h3>
                  <p className="text-gray-600 mb-6">
                    Start building positive routines by tracking your daily habits.
                  </p>
                  <Button onClick={() => setIsDrawerOpen(true)} className="bg-green-600 hover:bg-green-700">
                    Add First Habit
                  </Button>
                </Card>
              ) : (
                habits.map((habit) => {
                  const goalProgress = calculateGoalProgress(habit);
                  const daysUntilGoal = habit.goalDate 
                    ? Math.ceil((new Date(habit.goalDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                    : null;

                  return (
                    <Card key={habit.id} className="p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-4">
                        {/* Checkbox */}
                        <button
                          onClick={() => toggleHabit(habit.id)}
                          className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all mt-1 ${
                            habit.completed
                              ? "bg-green-500 border-green-500"
                              : "border-gray-300 hover:border-green-400 bg-white"
                          }`}
                        >
                          {habit.completed && <Check className="w-4 h-4 text-white" />}
                        </button>

                        {/* Habit Info */}
                        <div className="flex-grow min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div className="flex-grow min-w-0">
                              <h3 className={`text-lg font-semibold ${habit.completed ? "line-through text-gray-500" : "text-gray-900"}`}>
                                {habit.name}
                              </h3>
                              <p className="text-sm text-gray-600 mt-1">
                                {habit.description} • {habit.time}
                              </p>
                            </div>
                            {/* Delete Button */}
                            <button
                              onClick={() => deleteHabit(habit.id)}
                              className="p-2 text-gray-400 hover:text-red-600 transition-colors flex-shrink-0"
                              aria-label="Delete habit"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Streak & Goal Info */}
                          <div className="flex items-center gap-4 flex-wrap mt-3">
                            <div className="flex items-center gap-1.5 text-sm text-gray-700">
                              {getStreakIcon(habit.streak)}
                              <span className="font-medium">{habit.streak} day streak</span>
                            </div>

                            {/* Goal Progress */}
                            {habit.goalType !== "none" && habit.goalTarget && (
                              <div className="flex items-center gap-2 text-sm">
                                <Target className="w-4 h-4 text-blue-600" />
                                <span className="text-gray-700">
                                  {habit.completions || 0}/{habit.goalTarget} completed
                                </span>
                                <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-blue-500 rounded-full transition-all"
                                    style={{ width: `${goalProgress}%` }}
                                  ></div>
                                </div>
                                <span className="text-gray-600 text-xs">{goalProgress}%</span>
                              </div>
                            )}
                          </div>

                          {/* Goal Date Info */}
                          {habit.goalType !== "none" && habit.goalDate && daysUntilGoal !== null && (
                            <div className="mt-3 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                              <div className="flex items-center gap-2 text-sm">
                                <Calendar className="w-4 h-4 text-blue-600" />
                                <span className="text-blue-900 font-medium">
                                  {habit.goalType === "monthly" && "Monthly goal: "}
                                  {habit.goalType === "yearly" && "Yearly goal: "}
                                  {habit.goalType === "custom" && "Goal by: "}
                                  {new Date(habit.goalDate).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: habit.goalType === "yearly" ? "numeric" : undefined,
                                  })}
                                </span>
                                {daysUntilGoal > 0 && (
                                  <span className="text-blue-600 text-xs">
                                    ({daysUntilGoal} days left)
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  );
                })
              )}

              {/* Add Habit Button */}
              {habits.length > 0 && (
                <button
                  onClick={() => setIsDrawerOpen(true)}
                  className="w-full p-6 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:text-gray-900 hover:border-gray-400 hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  <span className="font-medium">Add New Habit</span>
                </button>
              )}
            </div>

            {/* Right Column: Stats & Insights */}
            <div className="space-y-6">
              {/* Analytics Section */}
              <Card title="Analytics Overview">
                <div className="space-y-4">
                  {/* Completion Rates */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Completion Rates</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Daily</span>
                          <span className="font-semibold text-gray-900">{dailyCompletion || completionRate}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all"
                            style={{ width: `${dailyCompletion || completionRate}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Weekly</span>
                          <span className="font-semibold text-gray-900">{weeklyCompletion}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-purple-500 h-2 rounded-full transition-all"
                            style={{ width: `${weeklyCompletion}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Monthly</span>
                          <span className="font-semibold text-gray-900">{monthlyCompletion}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full transition-all"
                            style={{ width: `${monthlyCompletion}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Yearly</span>
                          <span className="font-semibold text-gray-900">{yearlyCompletion}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-orange-500 h-2 rounded-full transition-all"
                            style={{ width: `${yearlyCompletion}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold text-gray-900">{totalCompletions}</div>
                      <div className="text-xs text-gray-600">Total Completions</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold text-gray-900">{avgStreak}</div>
                      <div className="text-xs text-gray-600">Avg Streak</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold text-gray-900">{activeStreaks}</div>
                      <div className="text-xs text-gray-600">Active Streaks</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold text-gray-900">{habitsWithGoals}</div>
                      <div className="text-xs text-gray-600">With Goals</div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Today's Progress */}
              <Card title="Today's Progress">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm text-gray-700 mb-2">
                      <span className="font-medium">{completedCount} of {habits.length} completed</span>
                      <span className="font-semibold text-gray-900">{completionRate}%</span>
                    </div>
                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-500"
                        style={{ width: `${completionRate}%` }}
                      ></div>
                    </div>
                  </div>
                  {completionRate === 100 && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-center">
                      <Trophy className="w-6 h-6 text-green-600 mx-auto mb-1" />
                      <p className="text-sm font-medium text-green-900">Perfect day! 🎉</p>
                    </div>
                  )}
                </div>
              </Card>

              {/* Performance Trend */}
              <Card title="Performance Trend">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-gray-700">Current Rate</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{completionRate}%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <TrendingUp className={`w-4 h-4 ${
                        weeklyCompletion >= completionRate ? "text-green-600" : "text-gray-400"
                      }`} />
                      <span className="text-sm text-gray-700">Weekly Avg</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{weeklyCompletion}%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-purple-600" />
                      <span className="text-sm text-gray-700">Best Performance</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {Math.max(completionRate || dailyCompletion, weeklyCompletion, monthlyCompletion, yearlyCompletion)}%
                    </span>
                  </div>
                </div>
              </Card>

              {/* Active Goals */}
              <Card title="Active Goals">
                <div className="space-y-3">
                  {habits
                    .filter((h) => h.goalType !== "none")
                    .slice(0, 3)
                    .map((habit) => {
                      const progress = calculateGoalProgress(habit);
                      return (
                        <div key={habit.id} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-900">{habit.name}</span>
                            <span className="text-xs text-gray-600">{progress}%</span>
                          </div>
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500 rounded-full transition-all"
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                          <div className="flex items-center justify-between mt-2 text-xs text-gray-600">
                            <span>{habit.completions || 0}/{habit.goalTarget} done</span>
                            {habit.goalDate && (
                              <span>
                                {new Date(habit.goalDate) > new Date() 
                                  ? `${Math.ceil((new Date(habit.goalDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days left`
                                  : "Expired"}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  {habits.filter((h) => h.goalType !== "none").length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No active goals. Set goals for your habits to track progress!
                    </p>
                  )}
                </div>
              </Card>

              {/* Top Streaks */}
              <Card title="Top Streaks">
                <div className="space-y-3">
                  {habits
                    .sort((a, b) => b.streak - a.streak)
                    .slice(0, 3)
                    .map((habit, idx) => (
                      <div key={habit.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                              idx === 0
                                ? "bg-orange-500"
                                : idx === 1
                                ? "bg-gray-400"
                                : "bg-amber-600"
                            }`}
                          >
                            {idx + 1}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 text-sm">{habit.name}</div>
                            <div className="text-xs text-gray-600">{habit.streak} days</div>
                          </div>
                        </div>
                        <Flame className="w-5 h-5 text-orange-500" />
                      </div>
                    ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </AppLayout>

      {/* Habit Creation Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Create New Habit"
        footer={null}
      >
        <HabitForm
          onSubmit={handleHabitSubmit}
          onCancel={() => setIsDrawerOpen(false)}
        />
      </Drawer>

      <BottomNav />
    </>
  );
}

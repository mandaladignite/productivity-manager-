import { Habit as APIHabit } from "./api";

export interface UIHabit {
  id: string | number;
  name: string;
  description: string;
  streak: number;
  completed: boolean;
  time: string;
  goalType?: "none" | "monthly" | "yearly" | "custom";
  goalTarget?: number;
  goalDate?: string;
  completions?: number;
}

/**
 * Transform a single habit from API format to UI format
 */
export function transformHabitFromAPI(apiHabit: APIHabit): UIHabit {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const isCompletedToday = apiHabit.completionHistory?.some((entry) => {
    const entryDate = new Date(entry.date);
    entryDate.setHours(0, 0, 0, 0);
    return entryDate.getTime() === today.getTime() && entry.completed;
  }) || false;

  return {
    id: apiHabit._id || apiHabit.id || "",
    name: apiHabit.name,
    description: apiHabit.description || "",
    streak: apiHabit.currentStreak || apiHabit.streak || 0,
    completed: isCompletedToday,
    time: apiHabit.timeOfDay || "anytime",
    goalType: apiHabit.goalType || "none",
    goalTarget: apiHabit.goalTarget,
    goalDate: apiHabit.goalDate,
    completions: apiHabit.completions || 0,
  };
}

/**
 * Transform multiple habits from API format to UI format
 */
export function transformHabitsFromAPI(apiHabits: APIHabit[]): UIHabit[] {
  return apiHabits.map(transformHabitFromAPI);
}

/**
 * Check if a habit is completed today
 */
export function isHabitCompletedToday(habit: APIHabit): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return habit.completionHistory?.some((entry) => {
    const entryDate = new Date(entry.date);
    entryDate.setHours(0, 0, 0, 0);
    return entryDate.getTime() === today.getTime() && entry.completed;
  }) || false;
}

/**
 * Calculate completion rate for habits
 */
export function calculateCompletionRate(habits: APIHabit[]): number {
  if (habits.length === 0) return 0;
  
  const completedToday = habits.filter(isHabitCompletedToday).length;
  return Math.round((completedToday / habits.length) * 100);
}

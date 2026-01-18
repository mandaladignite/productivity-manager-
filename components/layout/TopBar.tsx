"use client";

import { useRouter } from "next/navigation";
import { Plus, User } from "lucide-react";

export default function TopBar() {
  const router = useRouter();
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleQuickAddHabit = () => {
    const event = new CustomEvent("openHabitDrawer");
    window.dispatchEvent(event);
  };

  const handleProfileClick = () => {
    router.push("/settings");
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4 flex-wrap gap-4">
        {/* Date */}
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-gray-900">{currentDate}</h2>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Quick Add Habit */}
          <button
            onClick={handleQuickAddHabit}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium shadow-sm"
            aria-label="Add new habit"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Habit</span>
          </button>

          {/* Profile Avatar */}
          <button
            onClick={handleProfileClick}
            className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-medium hover:ring-2 ring-blue-500/50 transition-all shadow-sm cursor-pointer"
            aria-label="Go to settings"
          >
            <User className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}

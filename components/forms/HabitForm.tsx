"use client";

import { useState } from "react";
import Button from "../ui/Button";
import { Calendar } from "lucide-react";

interface HabitFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
}

export default function HabitForm({ onSubmit, onCancel, initialData }: HabitFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    frequency: initialData?.frequency || "daily",
    timeOfDay: initialData?.timeOfDay || "morning",
    goalType: initialData?.goalType || "none",
    goalTarget: initialData?.goalTarget || null,
    goalDate: initialData?.goalDate || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleGoalTypeChange = (type: string) => {
    setFormData({ ...formData, goalType: type, goalTarget: null, goalDate: "" });
  };

  const calculateGoalDate = (type: string): string => {
    const today = new Date();
    if (type === "monthly") {
      const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
      return nextMonth.toISOString().split("T")[0];
    } else if (type === "yearly") {
      const nextYear = new Date(today.getFullYear() + 1, 0, 1);
      return nextYear.toISOString().split("T")[0];
    }
    return "";
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Habit Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Morning meditation"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          id="description"
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Add details about this habit..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none bg-white text-gray-900 placeholder-gray-500"
        />
      </div>

      {/* Frequency & Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-2">
            Frequency
          </label>
          <select
            id="frequency"
            value={formData.frequency}
            onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white text-gray-900"
          >
            <option value="daily">Daily</option>
            <option value="weekdays">Weekdays</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>

        <div>
          <label htmlFor="timeOfDay" className="block text-sm font-medium text-gray-700 mb-2">
            Time of Day
          </label>
          <select
            id="timeOfDay"
            value={formData.timeOfDay}
            onChange={(e) => setFormData({ ...formData, timeOfDay: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white text-gray-900"
          >
            <option value="morning">Morning</option>
            <option value="afternoon">Afternoon</option>
            <option value="evening">Evening</option>
            <option value="anytime">Anytime</option>
          </select>
        </div>
      </div>

      {/* Goal Setting */}
      <div className="border-t border-gray-200 pt-6">
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Set a Goal (Optional)
        </label>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                handleGoalTypeChange("monthly");
                setFormData({ ...formData, goalType: "monthly", goalDate: calculateGoalDate("monthly") });
              }}
              className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
                formData.goalType === "monthly"
                  ? "border-green-500 bg-green-50 text-green-700"
                  : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
              }`}
            >
              Monthly Goal
            </button>
            <button
              type="button"
              onClick={() => {
                handleGoalTypeChange("yearly");
                setFormData({ ...formData, goalType: "yearly", goalDate: calculateGoalDate("yearly") });
              }}
              className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
                formData.goalType === "yearly"
                  ? "border-green-500 bg-green-50 text-green-700"
                  : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
              }`}
            >
              Yearly Goal
            </button>
          </div>
          <button
            type="button"
            onClick={() => handleGoalTypeChange("custom")}
            className={`w-full px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
              formData.goalType === "custom"
                ? "border-green-500 bg-green-50 text-green-700"
                : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
            }`}
          >
            Custom Date Goal
          </button>
        </div>

        {/* Goal Target Input */}
        {(formData.goalType === "monthly" || formData.goalType === "yearly" || formData.goalType === "custom") && (
          <div className="mt-4 space-y-4">
            <div>
              <label htmlFor="goalTarget" className="block text-sm font-medium text-gray-700 mb-2">
                Target Completions <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="goalTarget"
                required
                min="1"
                value={formData.goalTarget || ""}
                onChange={(e) => setFormData({ ...formData, goalTarget: parseInt(e.target.value) })}
                placeholder="e.g., 30"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                How many times do you want to complete this habit?
              </p>
            </div>

            {/* Custom Date Picker */}
            {formData.goalType === "custom" && (
              <div>
                <label htmlFor="goalDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Target Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="goalDate"
                    required
                    value={formData.goalDate}
                    onChange={(e) => setFormData({ ...formData, goalDate: e.target.value })}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900"
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            )}

            {/* Display auto-calculated date for monthly/yearly */}
            {(formData.goalType === "monthly" || formData.goalType === "yearly") && formData.goalDate && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  <span className="font-medium">Target Date:</span>{" "}
                  {new Date(formData.goalDate).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={() => handleGoalTypeChange("none")}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Remove goal
            </button>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" className="bg-green-600 hover:bg-green-700">
          {initialData ? "Update Habit" : "Create Habit"}
        </Button>
      </div>
    </form>
  );
}

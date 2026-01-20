"use client";

import { useState, useEffect } from "react";
import { Info, AlertCircle, Repeat, Clock, Tag, Bell } from "lucide-react";
import api from "@/lib/api";

interface TaskFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
  date: string; // Required date for the task
}

export default function TaskForm({ onSubmit, onCancel, initialData, date }: TaskFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    type: initialData?.type || "binary",
    quantity: initialData?.quantity !== undefined && initialData?.quantity !== null ? initialData.quantity : "",
    value: initialData?.value !== undefined && initialData?.value !== null ? initialData.value : "",
    // Recurring options
    isRecurring: initialData?.isRecurring || false,
    repeatFrequency: initialData?.repeatPattern?.frequency || "daily",
    repeatInterval: initialData?.repeatPattern?.interval || 1,
    repeatEndDate: initialData?.repeatPattern?.endDate || "",
    repeatDaysOfWeek: initialData?.repeatPattern?.daysOfWeek || [],
    // Other options
    priority: initialData?.priority || "medium",
    tags: initialData?.tags?.join(", ") || "",
    reminderEnabled: initialData?.reminder?.enabled || false,
    reminderTime: initialData?.reminder?.reminderTime || "",
    duration: initialData?.duration || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      alert("Please enter a task title");
      return;
    }

    if (formData.type === "count" && !formData.quantity) {
      alert("Please enter a quantity for count-based tasks");
      return;
    }

    if (formData.type === "value" && (formData.value === "" || formData.value === null || formData.value === undefined)) {
      alert("Please enter a value for value-based tasks");
      return;
    }

    const taskData: any = {
      title: formData.title.trim(),
      description: formData.description || "",
      date,
      type: formData.type,
      quantity: formData.type === "count" && formData.quantity !== "" ? parseInt(formData.quantity) : null,
      value: formData.type === "value" && formData.value !== "" ? parseFloat(formData.value) : null,
      // Recurring options
      isRecurring: formData.isRecurring,
      priority: formData.priority,
      duration: formData.duration !== "" ? parseInt(formData.duration) : null,
      tags: formData.tags ? formData.tags.split(",").map((tag: string) => tag.trim()).filter((tag: string) => tag.length > 0) : [],
      reminder: {
        enabled: formData.reminderEnabled,
        reminderTime: formData.reminderTime ? new Date(`${date}T${formData.reminderTime}`).toISOString() : null,
      },
    };

    // Add repeat pattern if recurring
    if (formData.isRecurring) {
      taskData.repeatPattern = {
        frequency: formData.repeatFrequency,
        interval: parseInt(formData.repeatInterval) || 1,
        endDate: formData.repeatEndDate ? new Date(formData.repeatEndDate).toISOString() : null,
        daysOfWeek: formData.repeatDaysOfWeek.length > 0 ? formData.repeatDaysOfWeek : null,
      };
    }

    onSubmit(taskData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Task Title *
        </label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="What needs to be done?"
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-500"
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Description (Optional)
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Add details..."
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-500"
        />
      </div>

      {/* Type */}
      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
          Task Type *
        </label>
          <select
            id="type"
            value={formData.type}
            onChange={(e) => {
              setFormData({
                ...formData,
                type: e.target.value,
                quantity: "",
                value: "",
              });
            }}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
          >
          <option value="binary">Binary (Yes/No)</option>
          <option value="count">Count-Based</option>
          <option value="value">Value-Based</option>
        </select>
        <p className="mt-1 text-xs text-gray-500">
          {formData.type === "binary" && "Simple completion task"}
          {formData.type === "count" && "Task with a quantity (e.g., 5 workouts)"}
          {formData.type === "value" && "Task with a measurable value (e.g., ₹1000, 2kg)"}
        </p>
      </div>

      {/* Quantity (for count-based) */}
      {formData.type === "count" && (
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
            Quantity *
          </label>
          <input
            type="number"
            id="quantity"
            min="1"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            placeholder="1"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-500"
          />
        </div>
      )}

      {/* Value (for value-based) */}
      {formData.type === "value" && (
        <div>
          <label htmlFor="value" className="block text-sm font-medium text-gray-700 mb-2">
            Value *
          </label>
          <input
            type="number"
            id="value"
            step="0.01"
            value={formData.value}
            onChange={(e) => setFormData({ ...formData, value: e.target.value })}
            placeholder="0.00"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-500"
          />
        </div>
      )}

      {/* Recurring Task Options */}
      <div className="border-t pt-4">
        <div className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            id="isRecurring"
            checked={formData.isRecurring}
            onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="isRecurring" className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Repeat className="w-4 h-4" />
            Make this a recurring task
          </label>
        </div>

        {formData.isRecurring && (
          <div className="ml-6 space-y-4 pl-4 border-l-2 border-gray-200">
            <div>
              <label htmlFor="repeatFrequency" className="block text-sm font-medium text-gray-700 mb-2">
                Repeat Frequency *
              </label>
              <select
                id="repeatFrequency"
                value={formData.repeatFrequency}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    repeatFrequency: e.target.value as any,
                    repeatDaysOfWeek: e.target.value === "weekly" ? [] : formData.repeatDaysOfWeek,
                  });
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
              >
                <option value="daily">Daily</option>
                <option value="weekdays">Weekdays (Mon-Fri)</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            {formData.repeatFrequency === "weekly" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Days of Week *
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: 0, label: "Sun" },
                    { value: 1, label: "Mon" },
                    { value: 2, label: "Tue" },
                    { value: 3, label: "Wed" },
                    { value: 4, label: "Thu" },
                    { value: 5, label: "Fri" },
                    { value: 6, label: "Sat" },
                  ].map((day) => (
                    <button
                      key={day.value}
                      type="button"
                      onClick={() => {
                        const days = formData.repeatDaysOfWeek.includes(day.value)
                          ? formData.repeatDaysOfWeek.filter((d: number) => d !== day.value)
                          : [...formData.repeatDaysOfWeek, day.value];
                        setFormData({ ...formData, repeatDaysOfWeek: days });
                      }}
                      className={`px-3 py-1 rounded-lg text-sm ${
                        formData.repeatDaysOfWeek.includes(day.value)
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {day.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {(formData.repeatFrequency === "daily" || formData.repeatFrequency === "weekly" || formData.repeatFrequency === "monthly") && (
              <div>
                <label htmlFor="repeatInterval" className="block text-sm font-medium text-gray-700 mb-2">
                  Repeat Every (interval)
                </label>
                <input
                  type="number"
                  id="repeatInterval"
                  min="1"
                  value={formData.repeatInterval}
                  onChange={(e) => setFormData({ ...formData, repeatInterval: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                />
                <p className="mt-1 text-xs text-gray-500">
                  {formData.repeatFrequency === "daily" && "Every N days"}
                  {formData.repeatFrequency === "weekly" && "Every N weeks"}
                  {formData.repeatFrequency === "monthly" && "Every N months"}
                </p>
              </div>
            )}

            <div>
              <label htmlFor="repeatEndDate" className="block text-sm font-medium text-gray-700 mb-2">
                End Date (Optional)
              </label>
              <input
                type="date"
                id="repeatEndDate"
                value={formData.repeatEndDate}
                onChange={(e) => setFormData({ ...formData, repeatEndDate: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
              />
              <p className="mt-1 text-xs text-gray-500">Leave empty to repeat indefinitely</p>
            </div>
          </div>
        )}
      </div>

      {/* Other Options */}
      <div className="border-t pt-4 space-y-4">
        <div>
          <label htmlFor="priority" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            Priority
          </label>
          <select
            id="priority"
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label htmlFor="duration" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Clock className="w-4 h-4" />
            Duration (minutes)
          </label>
          <input
            type="number"
            id="duration"
            min="0"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            placeholder="e.g., 30"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-500"
          />
        </div>

        <div>
          <label htmlFor="tags" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Tag className="w-4 h-4" />
            Tags
          </label>
          <input
            type="text"
            id="tags"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            placeholder="work, personal, urgent (comma-separated)"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-500"
          />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              id="reminderEnabled"
              checked={formData.reminderEnabled}
              onChange={(e) => setFormData({ ...formData, reminderEnabled: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="reminderEnabled" className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Bell className="w-4 h-4" />
              Set Reminder
            </label>
          </div>
          {formData.reminderEnabled && (
            <input
              type="time"
              id="reminderTime"
              value={formData.reminderTime}
              onChange={(e) => setFormData({ ...formData, reminderTime: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
            />
          )}
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="flex items-center justify-end gap-2 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {initialData ? "Update Task" : "Create Task"}
        </button>
      </div>
    </form>
  );
}

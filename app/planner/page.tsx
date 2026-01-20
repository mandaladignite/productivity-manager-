"use client";

import { useState, useEffect } from "react";
import { Calendar, Plus, CheckCircle, Circle, ChevronLeft, ChevronRight } from "lucide-react";
import api from "@/lib/api";
import TaskForm from "@/components/forms/TaskForm";
import Card from "@/components/ui/Card";
import Loading from "@/components/ui/Loading";
import Drawer from "@/components/ui/Drawer";
import AppLayout from "@/components/layout/AppLayout";
import BottomNav from "@/components/navigation/BottomNav";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

interface Task {
  _id: string;
  title: string;
  description?: string;
  date: string;
  type: "binary" | "count" | "value";
  quantity?: number;
  value?: number;
  completed: boolean;
  completedAt?: string;
}

function PlannerPageContent() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    fetchDailyPlanner();
  }, [selectedDate]);

  const fetchDailyPlanner = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.dailyPlanner.get(selectedDate);
      setTasks(response.tasks || []);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load daily planner");
      console.error("Error fetching daily planner:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskSubmit = async (data: any) => {
    try {
      setError("");
      if (editingTask) {
        await api.tasks.update(editingTask._id, data);
      } else {
        await api.tasks.create(data);
      }
      setIsDrawerOpen(false);
      setEditingTask(null);
      await fetchDailyPlanner();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save task");
      console.error("Error saving task:", err);
    }
  };

  const handleToggleCompletion = async (taskId: string) => {
    try {
      setError("");
      await api.tasks.toggleCompletion(taskId);
      await fetchDailyPlanner();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to toggle task");
      console.error("Error toggling task:", err);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm("Are you sure you want to delete this task?")) {
      return;
    }
    try {
      setError("");
      await api.tasks.delete(taskId);
      await fetchDailyPlanner();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete task");
      console.error("Error deleting task:", err);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsDrawerOpen(true);
  };

  const handleCreateTask = () => {
    setEditingTask(null);
    setIsDrawerOpen(true);
  };

  const navigateDate = (days: number) => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + days);
    setSelectedDate(date.toISOString().split("T")[0]);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading && tasks.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <>
      <AppLayout>
        <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Daily Planner</h1>
            <p className="text-gray-600 mt-1">{formatDate(selectedDate)}</p>
          </div>
          <button
            onClick={handleCreateTask}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            Add Task
          </button>
        </div>

        {/* Date Navigation */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => navigateDate(-1)}
            className="p-2 hover:bg-gray-200 rounded-lg"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
          />
          <button
            onClick={() => navigateDate(1)}
            className="p-2 hover:bg-gray-200 rounded-lg"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => setSelectedDate(new Date().toISOString().split("T")[0])}
            className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Today
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Tasks */}
        <Card title="Daily Tasks">
          {tasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p>No tasks for this day.</p>
              <p className="text-sm mt-1">Create a task to get started.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task._id}
                  className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => handleToggleCompletion(task._id)}
                      className="mt-1"
                    >
                      {task.completed ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h3
                            className={`font-medium ${
                              task.completed ? "line-through text-gray-500" : "text-gray-900"
                            }`}
                          >
                            {task.title}
                          </h3>
                          {task.description && (
                            <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                          )}
                          <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                            {task.type === "count" && task.quantity && (
                              <span>Quantity: {task.quantity}</span>
                            )}
                            {task.type === "value" && task.value !== null && (
                              <span>Value: {task.value}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditTask(task)}
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteTask(task._id)}
                            className="text-sm text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Task Form Drawer */}
      <Drawer 
        isOpen={isDrawerOpen} 
        onClose={() => {
          setIsDrawerOpen(false);
          setEditingTask(null);
        }}
        title={editingTask ? "Edit Task" : "Create Task"}
      >
        <div className="p-6">
          <TaskForm
            onSubmit={handleTaskSubmit}
            onCancel={() => {
              setIsDrawerOpen(false);
              setEditingTask(null);
            }}
            initialData={editingTask || undefined}
            date={selectedDate}
          />
        </div>
      </Drawer>
      </AppLayout>
      <BottomNav />
    </>
  );
}

export default function PlannerPage() {
  return (
    <ProtectedRoute>
      <PlannerPageContent />
    </ProtectedRoute>
  );
}

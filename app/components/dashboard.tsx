"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaskList } from "./task-list";
import { KanbanBoard } from "./kanban-board";
import { TaskForm } from "./task-form";
import { Button } from "@/components/ui/button";

export type Task = {
  id: string;
  title: string;
  description?: string;
  status: "To Do" | "In Progress" | "Completed";
  priority: "Low" | "Medium" | "High";
  dueDate?: Date;
};

export default function DashboardOne() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false); // Modal visibility state
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (task: Omit<Task, "id">) => {
    const newTask = { ...task, id: Date.now().toString() };
    setTasks([...tasks, newTask]);
  };

  const updateTask = (updatedTask: Task) => {
    setTasks(
      tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  return (
    <div className="container mx-auto p-4 text-black">
      <h1 className="text-3xl font-bold mb-4">Task Management Dashboard</h1>
      <Tabs defaultValue="list">
        <TabsList className="mb-4">
          <TabsTrigger value="list">Task List</TabsTrigger>
          <TabsTrigger value="kanban">Kanban Board</TabsTrigger>
        </TabsList>

        {/* Button to open the TaskForm modal */}
        <Button onClick={() => setIsFormOpen(true)} className="mb-4">
          Create New Task
        </Button>

        <TabsContent value="list">
          <TaskList
            tasks={tasks}
            onEditTask={(task) => {
              setEditingTask(task);
              setIsFormOpen(true); // Open form with the task for editing
            }}
            onDeleteTask={deleteTask}
          />
        </TabsContent>
        <TabsContent value="kanban">
          <KanbanBoard tasks={tasks} onUpdateTask={updateTask} />
        </TabsContent>
      </Tabs>

      {/* TaskForm Modal */}
      <TaskForm
        isOpen={isFormOpen} // Controls if the modal is open
        onClose={() => {
          setIsFormOpen(false);
          setEditingTask(null); // Reset editing task when closed
        }}
        onSubmit={(task) => {
          if (editingTask) {
            updateTask({ ...task, id: editingTask.id });
          } else {
            addTask(task);
          }
          setIsFormOpen(false);
          setEditingTask(null);
        }}
        initialTask={editingTask} // Pass the task for editing if exists
      />
    </div>
  );
}

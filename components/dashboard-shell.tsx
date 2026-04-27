"use client";

import { useEffect, useState } from "react";
import { createClient } from "../lib/supabase-client";

type Task = {
  id: string;
  title: string;
  completed: boolean;
};

type DashboardShellProps = {
  initialPlan?: unknown;
  sharedView?: boolean;
};

export function DashboardShell({ initialPlan, sharedView }: DashboardShellProps) {
  void initialPlan;
  void sharedView;

  const supabase = createClient();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTasks() {
      const { data, error } = await supabase
        .from("tasks")
        .select("id, title, completed")
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error loading tasks:", error.message);
        setLoading(false);
        return;
      }

      setTasks(data ?? []);
      setLoading(false);
    }

    fetchTasks();
  }, [supabase]);

  async function addTask() {
    const title = prompt("Введите задачу:");

    if (!title) return;

    const { data, error } = await supabase
      .from("tasks")
      .insert([
        {
          title,
          completed: false,
          priority: "normal",
        },
      ])
      .select("id, title, completed")
      .single();

    if (error) {
      alert("Ошибка: " + error.message);
      return;
    }

    if (data) {
      setTasks((prev) => [...prev, data]);
    }
  }

  async function toggleTask(task: Task) {
    const { error } = await supabase
      .from("tasks")
      .update({ completed: !task.completed })
      .eq("id", task.id);

    if (error) {
      alert("Ошибка: " + error.message);
      return;
    }

    setTasks((prev) =>
      prev.map((item) =>
        item.id === task.id
          ? { ...item, completed: !item.completed }
          : item
      )
    );
  }

  if (loading) {
    return <div style={{ padding: 20 }}>Loading...</div>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Easy Progress</h1>

      <button onClick={addTask}>+ New task</button>

      <ul>
        {tasks.map((task) => (
          <li
            key={task.id}
            onClick={() => toggleTask(task)}
            style={{
              cursor: "pointer",
              marginTop: 10,
              textDecoration: task.completed ? "line-through" : "none",
            }}
          >
            {task.title}
          </li>
        ))}
      </ul>
    </div>
  );
}

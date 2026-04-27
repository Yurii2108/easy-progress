"use client";

import { useEffect, useState } from "react";
import { createClient } from "../lib/supabase-client";

type Task = {
  id: string;
  title: string;
  completed: boolean;
};

export function DashboardShell() {
  const supabase = createClient();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // загрузка задач
  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    const { data, error } = await supabase.from("tasks").select("*");

    if (!error && data) {
      setTasks(data);
    }

    setLoading(false);
  }

  // добавление задачи
  async function addTask() {
    const title = prompt("Введите задачу:");
    if (!title) return;

    const { data, error } = await supabase
      .from("tasks")
      .insert([{ title, completed: false }])
      .select();

    if (!error && data) {
      setTasks((prev) => [...prev, ...data]);
    }
  }

  // переключение выполнения
  async function toggleTask(task: Task) {
    await supabase
      .from("tasks")
      .update({ completed: !task.completed })
      .eq("id", task.id);

    fetchTasks();
  }

  if (loading) return <div>Loading...</div>;

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

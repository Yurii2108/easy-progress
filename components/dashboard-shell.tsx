"use client";

import { Check, Copy, Lock, Plus, Share2, Users } from "lucide-react";
import { useMemo, useState } from "react";
import type { Folder, Note, Plan, Task } from "../lib/types";

type Props = {
  initialPlan: Plan;
  sharedView?: boolean;
};

export function DashboardShell({ initialPlan, sharedView = false }: Props) {
  const [plan, setPlan] = useState(initialPlan);
  const [activeFolderId, setActiveFolderId] = useState(plan.folders[0]?.id);
  const activeFolder = plan.folders.find(folder => folder.id === activeFolderId) ?? plan.folders[0];
  const todayNotes = plan.folders.flatMap(folder => folder.notes).filter(note => note.dueDate === "2026-04-27");
  const activeNotes = activeFolder?.notes ?? [];

  const stats = useMemo(() => getStats(plan), [plan]);

  function toggleTask(noteId: string, taskId: string) {
    setPlan(current => ({
      ...current,
      folders: current.folders.map(folder => ({
        ...folder,
        notes: folder.notes.map(note => note.id !== noteId ? note : {
          ...note,
          tasks: note.tasks.map(task => task.id !== taskId ? task : {
            ...task,
            status: task.status === "done" ? "todo" : "done"
          })
        })
      }))
    }));
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand-row">
          <span className="brand-dot" />
          <strong>Easy Progress</strong>
        </div>

        <button className="button primary wide">
          <Plus size={16} /> New note
        </button>

        <nav className="folder-nav">
          {plan.folders.map(folder => (
            <button
              key={folder.id}
              className={folder.id === activeFolder?.id ? "folder active" : "folder"}
              onClick={() => setActiveFolderId(folder.id)}
            >
              <span>{folder.name}</span>
              <small>{folder.notes.length}</small>
            </button>
          ))}
        </nav>
      </aside>

      <section className="main-panel">
        <header className="topbar">
          <div>
            <p className="eyebrow">Today</p>
            <h1>Focus on what moves the plan forward.</h1>
          </div>
          <div className="topbar-actions">
            <button className="button secondary"><Users size={16} /> Invite</button>
            <button className="button secondary"><Share2 size={16} /> Share</button>
          </div>
        </header>

        <section className="stats-grid">
          <Metric label="Progress" value={`${stats.percent}%`} hint={`${stats.done} of ${stats.total} completed`} />
          <Metric label="Remaining" value={String(stats.remaining)} hint="Open tasks" />
          <Metric label="Urgent" value={String(stats.urgent)} hint="Needs attention" tone="urgent" />
        </section>

        <section className="progress-card">
          <div className="progress-head">
            <strong>{stats.percent}%</strong>
            <span>{stats.done} / {stats.total}</span>
          </div>
          <div className="progress-track">
            <span style={{ width: `${stats.percent}%` }} />
          </div>
        </section>

        <section className="content-grid">
          <div className="today-panel">
            <div className="section-head">
              <div>
                <p className="eyebrow">Primary</p>
                <h2>Today tasks</h2>
              </div>
              <button className="button primary">Continue</button>
            </div>
            <TaskList notes={todayNotes.length ? todayNotes : activeNotes} onToggle={toggleTask} />
          </div>

          <div className="notes-panel">
            <div className="section-head">
              <div>
                <p className="eyebrow">Folder</p>
                <h2>{activeFolder?.name}</h2>
              </div>
            </div>
            <div className="note-stack">
              {activeNotes.map(note => (
                <article className="note-card" key={note.id}>
                  <strong>{note.title}</strong>
                  <p>{note.body}</p>
                  <small>{note.tasks.filter(task => task.status === "done").length} / {note.tasks.length} done</small>
                </article>
              ))}
            </div>
          </div>
        </section>
      </section>

      <aside className="share-panel">
        <div className="share-card">
          <div className="share-icon"><Lock size={18} /></div>
          <h2>{sharedView ? "Shared plan" : "Private workspace"}</h2>
          <p>Generate view-only or editable links, invite friends, and let them duplicate or collaborate.</p>
          <button className="button secondary wide"><Copy size={16} /> Copy share link</button>
        </div>
      </aside>
    </main>
  );
}

function Metric({ label, value, hint, tone }: { label: string; value: string; hint: string; tone?: "urgent" }) {
  return (
    <article className={tone === "urgent" ? "metric urgent" : "metric"}>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{hint}</small>
    </article>
  );
}

function TaskList({ notes, onToggle }: { notes: Note[]; onToggle: (noteId: string, taskId: string) => void }) {
  return (
    <div className="task-list">
      {notes.flatMap(note => note.tasks.map(task => (
        <button key={task.id} className={`task-row ${task.status}`} onClick={() => onToggle(note.id, task.id)}>
          <span className="task-check">{task.status === "done" ? <Check size={14} /> : null}</span>
          <span>
            <strong>{task.title}</strong>
            <small>{note.title}</small>
          </span>
          <em>{task.priority}</em>
        </button>
      )))}
    </div>
  );
}

function getStats(plan: Plan) {
  const tasks: Task[] = plan.folders.flatMap((folder: Folder) => folder.notes.flatMap(note => note.tasks));
  const done = tasks.filter(task => task.status === "done").length;
  const total = tasks.length;
  return {
    done,
    total,
    remaining: total - done,
    urgent: tasks.filter(task => task.priority === "urgent" && task.status !== "done").length,
    percent: total ? Math.round((done / total) * 100) : 0
  };
}

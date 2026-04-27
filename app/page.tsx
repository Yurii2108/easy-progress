import Link from "next/link";

export default function HomePage() {
  return (
    <main className="marketing-shell">
      <nav className="marketing-nav">
        <span className="brand-mark">Easy Progress</span>
        <Link href="/dashboard" className="button primary">Open app</Link>
      </nav>
      <section className="marketing-hero">
        <p className="eyebrow">Planner for real work</p>
        <h1>Tasks, notes, reminders, and shared plans in one calm workspace.</h1>
        <p className="hero-copy">
          Built for students and small teams who need daily focus, progress visibility, and easy collaboration.
        </p>
        <div className="hero-actions">
          <Link href="/dashboard" className="button primary">Start planning</Link>
          <Link href="/plan/demo" className="button secondary">View shared plan</Link>
        </div>
      </section>
    </main>
  );
}

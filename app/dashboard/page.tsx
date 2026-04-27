import { DashboardShell } from "../../components/dashboard-shell";
import { demoPlan } from "../../lib/demo-data";

export default function DashboardPage() {
  return <DashboardShell initialPlan={demoPlan} />;
}

import { DashboardShell } from "../../../components/dashboard-shell";
import { demoPlan } from "../../../lib/demo-data";

export default async function SharedPlanPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return <DashboardShell initialPlan={{ ...demoPlan, shareToken: token }} sharedView />;
}

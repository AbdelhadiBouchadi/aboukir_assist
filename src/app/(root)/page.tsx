import { dashboardStats } from '@/lib/data';
import {
  getDashboardStats,
  getConversations,
  getMonthlyConversationStats,
  getResponseDistribution,
} from '@/lib/actions';
import { ConversationChart } from '@/components/shared/Dashboard/ConversationChart';
import { ResponseChart } from '@/components/shared/Dashboard/ResponseChart';
import { RecentConversations } from '@/components/shared/Dashboard/RecentConversations';
import StatCard from '@/components/shared/Dashboard/StatCard';

export default async function Home() {
  const [dashboardData, conversations, monthlyStats, responseStats] =
    await Promise.all([
      getDashboardStats(),
      getConversations(),
      getMonthlyConversationStats(),
      getResponseDistribution(),
    ]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Aperçu des performances de votre automatisation WhatsApp.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {dashboardStats.map((stat, index) => {
          let value = 0;
          switch (index) {
            case 0:
              value = dashboardData.totalPatients;
              break;
            case 1:
              value = dashboardData.conversationsToday;
              break;
            case 2:
              value = dashboardData.responseRate;
              break;
            case 3:
              value = dashboardData.matchAccuracy;
              break;
          }

          return (
            <StatCard
              key={stat.title}
              title={stat.title}
              value={value}
              suffix={stat.suffix}
              change={stat.change}
              changeType={stat.changeType}
              iconName={stat.iconName}
              color={stat.color}
              delay={index}
            />
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ConversationChart data={monthlyStats} />
        <ResponseChart data={responseStats} />
      </div>

      <RecentConversations conversations={conversations} />
    </div>
  );
}

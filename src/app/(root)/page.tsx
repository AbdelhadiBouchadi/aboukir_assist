import {
  dashboardStats,
  demoConversations,
  monthlyConversationStats,
  responseDistribution,
} from '@/lib/data';
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
          Overview of your WhatsApp automation performance.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {dashboardStats.map((stat, index) => {
          return (
            <StatCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
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
        <ConversationChart data={monthlyConversationStats} />
        <ResponseChart data={responseDistribution} />
      </div>

      <RecentConversations conversations={demoConversations} />
    </div>
  );
}

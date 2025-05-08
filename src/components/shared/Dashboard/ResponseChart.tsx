'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

interface ResponseChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
}

export function ResponseChart({ data }: ResponseChartProps) {
  const colors = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
  ];

  return (
    <Card className="bg-card/20">
      <CardHeader className="pb-2">
        <CardTitle>Distribution des réponses</CardTitle>
        <CardDescription>
          Répartition des réponses automatisées et manuelles
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${value}%`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

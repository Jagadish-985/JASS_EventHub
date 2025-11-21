'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { skillData } from '@/lib/data';

const chartConfig = {
  'AI/ML': {
    label: 'AI/ML',
    color: 'hsl(var(--primary))',
  },
  'Web Dev': {
    label: 'Web Dev',
    color: 'hsl(var(--accent))',
  },
  'Design': {
    label: 'Design',
    color: 'hsl(var(--secondary-foreground))',
  },
   'Career': {
    label: 'Career',
    color: 'hsl(var(--muted-foreground))',
  },
};

export default function SkillGapChart() {
  return (
    <div className="h-[400px] w-full">
      <ChartContainer config={chartConfig} className="h-full w-full">
        <ResponsiveContainer>
        <BarChart data={skillData} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="AI/ML" fill="var(--color-AI/ML)" radius={4} />
          <Bar dataKey="Web Dev" fill="var(--color-Web Dev)" radius={4} />
          <Bar dataKey="Design" fill="var(--color-Design)" radius={4} />
          <Bar dataKey="Career" fill="var(--color-Career)" radius={4} />
        </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}

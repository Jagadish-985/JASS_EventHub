import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import SkillGapChart from './skill-gap-chart';

export default function AnalyticsPage() {
  return (
    <div className="animate-in fade-in-50">
      <PageHeader
        title="Skill Gap Analysis"
        description="Analyze student event engagement to identify skill gaps and inform curriculum planning."
      />

      <Card>
        <CardHeader>
          <CardTitle>Event Engagement by Skill Category</CardTitle>
          <CardDescription>Monthly attendance trends across different event types.</CardDescription>
        </CardHeader>
        <CardContent>
          <SkillGapChart />
        </CardContent>
      </Card>
    </div>
  );
}

import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, FileDown, Pin, Users } from 'lucide-react';

export default function ReportsPage() {
  return (
    <div className="animate-in fade-in-50">
      <PageHeader
        title="Report Generation"
        description="Generate comprehensive event reports with a single click."
      />
      
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Generate a New Report</CardTitle>
              <CardDescription>Select an event to generate its report.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select an event" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="event-1">AI in the Modern World</SelectItem>
                  <SelectItem value="event-2">Advanced UX Design Workshop</SelectItem>
                  <SelectItem value="event-3">Annual Tech Career Fair</SelectItem>
                </SelectContent>
              </Select>
              <Button className="w-full">
                <FileDown className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Generated Report Preview</CardTitle>
              <CardDescription>This is a preview of your generated report. Select an event to begin.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-center text-muted-foreground py-12">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="flex flex-col items-center gap-2 p-4 bg-muted/50 rounded-lg">
                  <Users className="h-8 w-8 text-primary" />
                  <h4 className="font-semibold">Attendance Data</h4>
                  <p className="text-sm">Detailed attendance statistics.</p>
                </div>
                <div className="flex flex-col items-center gap-2 p-4 bg-muted/50 rounded-lg">
                  <Pin className="h-8 w-8 text-primary" />
                  <h4 className="font-semibold">Geolocated Photos</h4>
                  <p className="text-sm">Event photos with location tags.</p>
                </div>
                <div className="flex flex-col items-center gap-2 p-4 bg-muted/50 rounded-lg">
                  <BarChart className="h-8 w-8 text-primary" />
                  <h4 className="font-semibold">Procurement Data</h4>
                  <p className="text-sm">Analytics on procurement.</p>
                </div>
              </div>
              <p className="mt-6">Select an event and click 'Generate Report' to see the data.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

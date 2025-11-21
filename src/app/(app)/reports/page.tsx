'use client';
import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, FileDown, Pin, Users, Loader2 } from 'lucide-react';
import { useFirebase } from '@/firebase';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query } from 'firebase/firestore';
import { useMemoFirebase } from '@/firebase/provider';
import type { Event } from '@/lib/types';

export default function ReportsPage() {
  const { firestore, user } = useFirebase();
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [reportData, setReportData] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const eventsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(collection(firestore, 'users', user.uid, 'events'));
  }, [firestore, user]);

  const { data: events, isLoading: isLoadingEvents } = useCollection<Event>(eventsQuery);

  const handleGenerateReport = () => {
    if (!selectedEventId) return;
    setIsGenerating(true);
    // In a real app, you would fetch report data from a backend service.
    // Here we'll simulate it with a delay.
    setTimeout(() => {
      const event = events?.find(e => e.id === selectedEventId);
      setReportData({
        eventName: event?.name,
        attendance: Math.floor(Math.random() * 200) + 50,
        photos: Math.floor(Math.random() * 50) + 10,
        procurement: (Math.random() * 5000 + 1000).toFixed(2),
      });
      setIsGenerating(false);
    }, 1500);
  };

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
              <Select onValueChange={setSelectedEventId} disabled={isLoadingEvents || isGenerating}>
                <SelectTrigger>
                  <SelectValue placeholder={isLoadingEvents ? "Loading events..." : "Select an event"} />
                </SelectTrigger>
                <SelectContent>
                  {events && events.length > 0 ? (
                    events.map(event => (
                      <SelectItem key={event.id} value={event.id}>{event.name}</SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-events" disabled>No events found</SelectItem>
                  )}
                </SelectContent>
              </Select>
              <Button className="w-full" onClick={handleGenerateReport} disabled={!selectedEventId || isGenerating}>
                {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileDown className="mr-2 h-4 w-4" />}
                {isGenerating ? 'Generating...' : 'Generate Report'}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>{reportData ? `Report for ${reportData.eventName}` : 'Generated Report Preview'}</CardTitle>
              <CardDescription>{reportData ? 'Here is a summary of your event.' : 'Select an event to begin.'}</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center text-center text-muted-foreground h-full min-h-[300px]">
              {isGenerating ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                  <p>Compiling your report...</p>
                </div>
              ) : reportData ? (
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center w-full animate-in fade-in-50">
                  <div className="flex flex-col items-center gap-2 p-4 bg-muted/50 rounded-lg">
                    <Users className="h-8 w-8 text-primary" />
                    <h4 className="font-semibold text-lg">{reportData.attendance}</h4>
                    <p className="text-sm">Attendees</p>
                  </div>
                  <div className="flex flex-col items-center gap-2 p-4 bg-muted/50 rounded-lg">
                    <Pin className="h-8 w-8 text-primary" />
                    <h4 className="font-semibold text-lg">{reportData.photos}</h4>
                    <p className="text-sm">Geolocated Photos</p>
                  </div>
                  <div className="flex flex-col items-center gap-2 p-4 bg-muted/50 rounded-lg">
                    <BarChart className="h-8 w-8 text-primary" />
                     <h4 className="font-semibold text-lg">${reportData.procurement}</h4>
                    <p className="text-sm">Procurement Cost</p>
                  </div>
                </div>
              ) : (
                <p>Select an event and click 'Generate Report' to see the data.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

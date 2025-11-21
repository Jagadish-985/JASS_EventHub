
'use client';
import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, FileDown, Pin, Users, Loader2 } from 'lucide-react';
import { useFirebase } from '@/firebase';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, where } from 'firebase/firestore';
import { useMemoFirebase } from '@/firebase/provider';
import type { Event } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function ReportsPage() {
  const { firestore, user } = useFirebase();
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [reportData, setReportData] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const eventsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(collection(firestore, 'events'), where('organizerId', '==', user.uid));
  }, [firestore, user]);

  const { data: events, isLoading: isLoadingEvents } = useCollection<Event>(eventsQuery);

  const handleGenerateReport = () => {
    if (!selectedEventId) return;
    setIsGenerating(true);
    // Mocking report generation
    setTimeout(() => {
      const event = events?.find(e => e.id === selectedEventId);
      setReportData({
        eventName: event?.name,
        attendance: Math.floor(Math.random() * 200) + 50,
        photos: Math.floor(Math.random() * 50) + 10,
        notes: "The event was a great success with high engagement.",
        procurementCost: (Math.random() * 5000 + 1000).toFixed(2),
      });
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="container mx-auto max-w-7xl animate-in fade-in-50">
      <PageHeader
        title="Report Generation"
        description="Generate comprehensive event reports with a single click."
      />
      
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Generate a New Report</CardTitle>
            <CardDescription>Select an event and add details to generate its report.</CardDescription>
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
                  <SelectItem value="no-events" disabled>No events created</SelectItem>
                )}
              </SelectContent>
            </Select>

            <div className="space-y-2">
                <label htmlFor="photos" className="text-sm font-medium">Upload Photos</label>
                <Input id="photos" type="file" multiple accept="image/*" />
                <p className="text-xs text-muted-foreground">Geotags will be extracted automatically.</p>
            </div>
             <div className="space-y-2">
                <label htmlFor="notes" className="text-sm font-medium">Notes</label>
                <Textarea id="notes" placeholder="Add any notes about the event..." />
            </div>

            <Button className="w-full" onClick={handleGenerateReport} disabled={!selectedEventId || isGenerating}>
              {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileDown className="mr-2 h-4 w-4" />}
              {isGenerating ? 'Generating...' : 'Generate PDF Report'}
            </Button>
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader>
            <CardTitle>{reportData ? `Report for: ${reportData.eventName}` : 'Generated Report Preview'}</CardTitle>
            <CardDescription>{reportData ? 'Here is a summary of your event.' : 'Select an event to begin.'}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center text-center text-muted-foreground h-full min-h-[300px]">
            {isGenerating ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p>Compiling your report...</p>
              </div>
            ) : reportData ? (
               <div className="w-full text-left space-y-4 animate-in fade-in-50">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                        <Users className="h-6 w-6 text-primary" />
                        <div>
                            <p className="font-semibold">{reportData.attendance}</p>
                            <p className="text-sm text-muted-foreground">Attendees</p>
                        </div>
                    </div>
                     <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                        <Pin className="h-6 w-6 text-primary" />
                        <div>
                            <p className="font-semibold">{reportData.photos}</p>
                            <p className="text-sm text-muted-foreground">Geolocated Photos</p>
                        </div>
                    </div>
                </div>
                <div>
                    <h4 className="font-semibold">Notes</h4>
                    <p className="text-sm text-muted-foreground p-3 bg-muted/50 rounded-lg mt-1">{reportData.notes}</p>
                </div>
                 <div>
                    <h4 className="font-semibold">Procurement Cost</h4>
                    <p className="text-sm text-muted-foreground p-3 bg-muted/50 rounded-lg mt-1">${reportData.procurementCost}</p>
                </div>
              </div>
            ) : (
              <p>Your report preview will appear here.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

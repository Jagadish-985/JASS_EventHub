
'use client';
import { useState, useRef } from 'react';
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
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Image from 'next/image';

export default function ReportsPage() {
  const { firestore, user, userRole } = useFirebase();
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [reportData, setReportData] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [notes, setNotes] = useState('');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const reportRef = useRef<HTMLDivElement>(null);


  const eventsQuery = useMemoFirebase(() => {
    if (!user) return null;
    if (userRole === 'admin') {
      return collection(firestore, 'events');
    }
    return query(collection(firestore, 'events'), where('organizerId', '==', user.uid));
  }, [firestore, user, userRole]);

  const { data: events, isLoading: isLoadingEvents } = useCollection<Event>(eventsQuery);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const imageUrls: string[] = [];
      
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (loadEvent) => {
          if(loadEvent.target?.result) {
            imageUrls.push(loadEvent.target.result as string);
            // If all files are read, update the state
            if (imageUrls.length === files.length) {
              setUploadedImages(imageUrls);
            }
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleGenerateReport = async () => {
    if (!selectedEventId) return;
    setIsGenerating(true);

    // Mocking report generation
    const event = events?.find(e => e.id === selectedEventId);
    const data = {
      eventName: event?.name,
      eventDate: new Date(event?.startTime || Date.now()).toLocaleDateString(),
      location: event?.location,
      organizer: user?.displayName,
      attendance: Math.floor(Math.random() * 200) + 50,
      photos: uploadedImages,
      notes: notes || "The event was a great success with high engagement.",
      procurementCost: (Math.random() * 5000 + 1000).toFixed(2),
    };
    setReportData(data);

    // Wait for state to update and UI to render the report preview
    setTimeout(async () => {
        if(!reportRef.current) {
            setIsGenerating(false);
            return;
        };

        try {
            const canvas = await html2canvas(reportRef.current, { scale: 2, useCORS: true, });
            const imgData = canvas.toDataURL('image/png');
            
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`EventReport-${event?.name?.replace(/\s/g, '_')}.pdf`);
        } catch (error) {
            console.error("Failed to generate PDF:", error);
        } finally {
            setIsGenerating(false);
        }
    }, 500); // Small delay to ensure the hidden div is rendered
  };

  return (
    <div className="animate-in fade-in-50">
        {/* Hidden Div for PDF Generation */}
        <div className="fixed -left-[9999px] top-0 opacity-0 pointer-events-none">
            <div ref={reportRef} className="w-[210mm] min-h-[297mm] p-8 bg-white text-black flex flex-col font-sans">
                {reportData && (
                     <div className="w-full h-full p-4 flex flex-col">
                        <header className="text-center border-b-2 border-gray-700 pb-4">
                            <h1 className="text-4xl font-bold text-gray-800">Event Report</h1>
                            <h2 className="text-2xl font-semibold text-primary">{reportData.eventName}</h2>
                        </header>
                        <main className="flex-1 mt-8 space-y-8">
                            <div className="grid grid-cols-2 gap-4 text-lg">
                                <div className="p-4 bg-gray-100 rounded-lg"><strong>Date:</strong> {reportData.eventDate}</div>
                                <div className="p-4 bg-gray-100 rounded-lg"><strong>Location:</strong> {reportData.location}</div>
                                <div className="p-4 bg-gray-100 rounded-lg"><strong>Organizer:</strong> {reportData.organizer}</div>
                                <div className="p-4 bg-gray-100 rounded-lg"><strong>Total Attendance:</strong> {reportData.attendance}</div>
                                <div className="p-4 bg-gray-100 rounded-lg"><strong>Geotagged Photos:</strong> {reportData.photos.length}</div>
                                <div className="p-4 bg-gray-100 rounded-lg"><strong>Procurement Cost:</strong> ₹{reportData.procurementCost}</div>
                            </div>

                            <div className="mt-6">
                                <h3 className="text-xl font-bold border-b border-gray-400 pb-2 mb-2 text-primary">Notes & Observations</h3>
                                <p className="text-base text-gray-700 whitespace-pre-wrap">{reportData.notes}</p>
                            </div>
                            
                            {reportData.photos.length > 0 && (
                                <div className="mt-6">
                                    <h3 className="text-xl font-bold border-b border-gray-400 pb-2 mb-4 text-primary">Geotagged Photos</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {reportData.photos.map((imgSrc: string, index: number) => (
                                            <div key={index} className="aspect-video w-full border p-1 rounded-lg">
                                                <img src={imgSrc} alt={`Report photo ${index + 1}`} className="w-full h-full object-cover rounded" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </main>
                        <footer className="mt-auto text-center pt-4 border-t border-gray-300">
                            <p className="text-2xl font-bold text-primary">EventHub+</p>
                            <p className="text-sm text-gray-500">Generated on {new Date().toLocaleDateString()}</p>
                        </footer>
                    </div>
                )}
            </div>
        </div>


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
                  <SelectItem value="no-events" disabled>No events available</SelectItem>
                )}
              </SelectContent>
            </Select>

            <div className="space-y-2">
                <label htmlFor="photos" className="text-sm font-medium">Upload Photos</label>
                <Input id="photos" type="file" multiple accept="image/*" onChange={handleImageUpload} />
                <p className="text-xs text-muted-foreground">Geotags will be extracted automatically.</p>
            </div>
             <div className="space-y-2">
                <label htmlFor="notes" className="text-sm font-medium">Notes</label>
                <Textarea id="notes" placeholder="Add any notes about the event..." value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>

            <Button className="w-full" onClick={handleGenerateReport} disabled={!selectedEventId || isGenerating}>
              {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileDown className="mr-2 h-4 w-4" />}
              {isGenerating ? 'Generating...' : 'Generate and Download PDF Report'}
            </Button>
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader>
            <CardTitle>{reportData ? `Report for: ${reportData.eventName}` : 'Generated Report Preview'}</CardTitle>
            <CardDescription>{reportData ? 'Here is a summary of your event.' : 'Select an event to begin.'}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center text-center text-muted-foreground h-full min-h-[300px]">
            {isGenerating && !reportData ? (
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
                            <p className="font-semibold">{reportData.photos.length}</p>
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
                    <p className="text-sm text-muted-foreground p-3 bg-muted/50 rounded-lg mt-1">₹{reportData.procurementCost}</p>
                </div>

                {reportData.photos.length > 0 && (
                  <div>
                    <h4 className="font-semibold">Uploaded Photos</h4>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {reportData.photos.map((imgSrc: string, index: number) => (
                        <Image key={index} src={imgSrc} alt={`upload preview ${index}`} width={100} height={100} className="object-cover rounded-md aspect-square" />
                      ))}
                    </div>
                  </div>
                )}
                 {isGenerating && reportData && (
                    <div className="flex items-center gap-2 text-primary pt-4">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <p>Downloading PDF...</p>
                    </div>
                 )}
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

    


'use client';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFirebase } from '@/firebase';
import { useCollection } from '@/firebase/firestore/use-collection';
import { useDoc } from '@/firebase/firestore/use-doc';
import { collection, query, where, getDocs, doc, documentId } from 'firebase/firestore';
import { useMemoFirebase } from '@/firebase/provider';
import type { Event, Certificate } from '@/lib/types';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Download, Linkedin, ExternalLink, Loader2 } from 'lucide-react';
import { getPersonalizedEventRecommendations, PersonalizedEventRecommendationsOutput } from '@/ai/flows/personalized-event-recommendations';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function StudentDashboardPage() {
  const { user } = useFirebase();

  return (
    <div className="animate-in fade-in-50">
      <PageHeader
        title={`Welcome, ${user?.displayName || 'Student'}!`}
        description="This is your personal hub for all event-related activities."
      />
      <Tabs defaultValue="certificates">
        <TabsList className="mb-4">
          <TabsTrigger value="registrations">My Registrations</TabsTrigger>
          <TabsTrigger value="certificates">My Certificates</TabsTrigger>
          <TabsTrigger value="recommendations">Recommended Events</TabsTrigger>
        </TabsList>
        <TabsContent value="registrations">
          <MyRegistrations />
        </TabsContent>
        <TabsContent value="certificates">
          <MyCertificates />
        </TabsContent>
        <TabsContent value="recommendations">
          <RecommendedEvents />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function MyRegistrations() {
  const { firestore, user } = useFirebase();
  const [registeredEvents, setRegisteredEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || !firestore) return;

    const fetchRegistrations = async () => {
      setIsLoading(true);
      try {
        const registrationsQuery = query(collection(firestore, 'registrations'), where('userId', '==', user.uid));
        const registrationSnap = await getDocs(registrationsQuery);
        const eventIds = registrationSnap.docs.map(doc => doc.data().eventId);

        if (eventIds.length > 0) {
          const eventsData: Event[] = [];
          for (let i = 0; i < eventIds.length; i += 30) {
              const chunk = eventIds.slice(i, i + 30);
              const eventsQuery = query(collection(firestore, 'events'), where(documentId(), 'in', chunk));
              const eventsSnap = await getDocs(eventsQuery);
              eventsSnap.forEach(doc => {
                  eventsData.push({ ...doc.data() as Event, id: doc.id });
              });
          }
          setRegisteredEvents(eventsData);
        } else {
          setRegisteredEvents([]);
        }
      } catch (error) {
        console.error("Error fetching registrations: ", error);
        setRegisteredEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRegistrations();
  }, [user, firestore]);

  if (isLoading) {
    return <p>Loading your registered events...</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Registrations</CardTitle>
        <CardDescription>Events you have registered for.</CardDescription>
      </CardHeader>
      <CardContent>
        {registeredEvents.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {registeredEvents.map(event => (
              <Link href={`/events/${event.id}`} key={event.id} className="group block">
                <Card className="overflow-hidden h-full">
                   <div className="relative h-40 w-full">
                    <Image
                      src={event.image || `https://picsum.photos/seed/${event.id}/400/250`}
                      alt={event.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      data-ai-hint="event photo"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold">{event.name}</h3>
                    <p className="text-sm text-muted-foreground">{new Date(event.startTime).toLocaleDateString()}</p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">You have not registered for any events yet.</p>
        )}
      </CardContent>
    </Card>
  );
}

function CertificateEntry({ certificate }: { certificate: Certificate }) {
  const { user, firestore } = useFirebase();
  const [isDownloading, setIsDownloading] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);

  const eventRef = useMemoFirebase(
    () => (firestore ? doc(firestore, 'events', certificate.eventId) : null),
    [firestore, certificate.eventId]
  );
  const { data: event, isLoading: isLoadingEvent } = useDoc<Event>(eventRef);

  const handleDownload = async () => {
    if (!certificateRef.current || !event) return;
    setIsDownloading(true);

    try {
        const canvas = await html2canvas(certificateRef.current, {
            scale: 3,
            useCORS: true,
            backgroundColor: '#ffffff',
        });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4',
        });
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Certificate-${event.name.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
        console.error("Failed to download certificate:", error);
    } finally {
        setIsDownloading(false);
    }
  };

  return (
    <>
      <div className="fixed -left-[9999px] top-0 opacity-0 pointer-events-none">
        <div 
          ref={certificateRef} 
          className="w-[297mm] h-[210mm] p-10 bg-white text-black flex flex-col justify-between items-center"
          style={{ fontFamily: "'Times New Roman', Times, serif" }}
        >
          <div className="w-full h-full border-8 border-blue-900 p-8 flex flex-col items-center text-center relative">
            <div className="absolute top-8 right-8 text-blue-900 font-bold text-3xl">EventHub+</div>
            <h1 className="text-6xl font-bold text-blue-900 mt-24">Certificate of Attendance</h1>
            <p className="text-2xl mt-12">This is to certify that</p>
            <p className="text-5xl font-semibold mt-6 italic text-gray-800">{user?.displayName || 'Attendee'}</p>
            <div className="w-1/2 border-b-2 border-gray-400 mt-6"></div>
            <p className="text-2xl mt-8">has successfully attended the event</p>
            <h2 className="text-4xl font-bold mt-4 text-blue-800">{event?.name}</h2>
            <div className="mt-auto flex justify-between w-full text-sm text-gray-600">
              <div>
                <p className="font-semibold border-t-2 border-gray-400 pt-2">Event Organizer</p>
                <p>RUAS</p>
              </div>
              <div>
                <p>Issued on: {new Date(certificate.issueDate).toLocaleDateString()}</p>
                <p className="text-xs mt-1 break-all">Certificate ID: {certificate.id}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between rounded-lg border p-4">
        <div>
          <p className="font-semibold">
            {isLoadingEvent ? 'Loading event name...' : `Certificate for: ${event?.name || `Event ID: ${certificate.eventId}`}`}
          </p>
          <p className="text-sm text-muted-foreground truncate">ID: {certificate.id}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" disabled>
            <ExternalLink className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleDownload} disabled={isDownloading || isLoadingEvent || !event}>
            {isDownloading || isLoadingEvent ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="icon" disabled>
            <Linkedin className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );
}

function MyCertificates() {
  const { firestore, user } = useFirebase();
  const certificatesQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(collection(firestore, 'certificates'), where('userId', '==', user.uid));
  }, [firestore, user]);

  const { data: certificates, isLoading } = useCollection<Certificate>(certificatesQuery);

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Certificates</CardTitle>
        <CardDescription>Your earned certificates from events.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && <div className="flex items-center space-x-2"><Loader2 className="h-4 w-4 animate-spin" /><span>Loading certificates...</span></div>}
        {!isLoading && certificates && certificates.length > 0 ? (
          <div className="space-y-4">
            {certificates.map(cert => (
              <CertificateEntry key={cert.id} certificate={cert} />
            ))}
          </div>
        ) : (
          !isLoading && <p className="text-muted-foreground">You have not earned any certificates yet.</p>
        )}
      </CardContent>
    </Card>
  );
}

function RecommendedEvents() {
    const { user } = useFirebase();
    const [recommendations, setRecommendations] = useState<PersonalizedEventRecommendationsOutput | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user) return;
        setLoading(true);
        // Mock data for demo purposes
        getPersonalizedEventRecommendations({
            userInterests: ['AI', 'Web Dev'],
            pastAttendance: ['Tech Conference 2024'],
        }).then(result => {
            setRecommendations(result);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, [user]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Recommended For You</CardTitle>
                <CardDescription>Events you might be interested in, powered by EventBuddy AI.</CardDescription>
            </CardHeader>
            <CardContent>
                {loading && <div className="flex items-center space-x-2"><Loader2 className="h-4 w-4 animate-spin" /><span>Generating recommendations...</span></div>}
                {recommendations && recommendations.recommendations.length > 0 ? (
                    <ul className="list-disc space-y-2 pl-5">
                        {recommendations.recommendations.map((rec, index) => (
                            <li key={index} className="text-muted-foreground">{rec}</li>
                        ))}
                    </ul>
                ) : (
                 !loading && <p className="text-muted-foreground">No recommendations available at the moment.</p>
                )}
            </CardContent>
        </Card>
    );
}

    

    
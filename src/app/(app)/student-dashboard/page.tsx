
'use client';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFirebase } from '@/firebase';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, where, getDocs, doc } from 'firebase/firestore';
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
      <Tabs defaultValue="registrations">
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
      const registrationsQuery = query(collection(firestore, 'registrations'), where('userId', '==', user.uid));
      const registrationSnap = await getDocs(registrationsQuery);
      const eventIds = registrationSnap.docs.map(doc => doc.data().eventId);

      if (eventIds.length > 0) {
        // Firestore 'in' queries are limited to 30 items. For a real app, pagination or a different data model might be needed.
        const eventsQuery = query(collection(firestore, 'events'), where('__name__', 'in', eventIds));
        const eventsSnap = await getDocs(eventsQuery);
        const eventsData = eventsSnap.docs.map(doc => ({ ...doc.data() as Event, id: doc.id }));
        setRegisteredEvents(eventsData);
      } else {
        setRegisteredEvents([]);
      }
      setIsLoading(false);
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

function CertificateEntry({ cert }: { cert: Certificate & { event?: Event } }) {
  const { user } = useFirebase();
  const [isDownloading, setIsDownloading] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!certificateRef.current || !cert.event) return;
    setIsDownloading(true);

    const canvas = await html2canvas(certificateRef.current, {
      scale: 2, // Higher scale for better quality
      backgroundColor: null, // Use element's background
    });
    const imgData = canvas.toDataURL('image/png');
    
    // A4 size in mm: 210 x 297
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Certificate-${cert.event.name.replace(/ /g, '_')}.pdf`);

    setIsDownloading(false);
  };

  return (
    <>
      {/* Hidden div for PDF generation */}
      <div className="fixed -left-[9999px] top-0">
          <div ref={certificateRef} className="w-[297mm] h-[210mm] p-8 bg-white text-black flex flex-col justify-center items-center font-sans"
              style={{ fontFamily: 'serif' }}>
              <div className="w-full h-full border-4 border-primary p-4 flex flex-col items-center text-center">
                  <h1 className="text-5xl font-bold text-primary mt-12">Certificate of Attendance</h1>
                  <p className="text-lg mt-8">This is to certify that</p>
                  <p className="text-4xl font-semibold mt-4 italic">{user?.displayName}</p>
                  <p className="text-lg mt-4">has successfully attended the event</p>
                  <h2 className="text-3xl font-bold mt-4">{cert.event?.name}</h2>
                  <p className="text-md mt-auto">Issued on: {new Date(cert.issueDate).toLocaleDateString()}</p>
                  <p className="text-xs mt-2 break-all">ID: {cert.id}</p>
              </div>
          </div>
      </div>
      
      <div className="flex items-center justify-between rounded-lg border p-4">
        <div>
          <p className="font-semibold">Certificate for: {cert.event?.name || cert.eventId}</p>
          <p className="text-sm text-muted-foreground truncate">ID: {cert.id}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" disabled>
            <ExternalLink className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleDownload} disabled={isDownloading}>
            {isDownloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
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
  const [certificatesWithEvents, setCertificatesWithEvents] = useState<(Certificate & { event?: Event })[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const certificatesQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(collection(firestore, 'certificates'), where('userId', '==', user.uid));
  }, [firestore, user]);

  const { data: certificates } = useCollection<Certificate>(certificatesQuery);

  useEffect(() => {
    if (!certificates || !firestore) {
        if(certificates === null && user) { // If certificates are loaded but null
            setIsLoading(false);
            setCertificatesWithEvents([]);
        }
        return;
    };

    const fetchEventsForCertificates = async () => {
      setIsLoading(true);
      if (certificates.length === 0) {
        setCertificatesWithEvents([]);
        setIsLoading(false);
        return;
      }
      
      const eventIds = [...new Set(certificates.map(c => c.eventId))];
      const events: Record<string, Event> = {};

      // Batch fetch events
      for (let i = 0; i < eventIds.length; i += 30) {
        const chunk = eventIds.slice(i, i + 30);
        const eventsQuery = query(collection(firestore, 'events'), where('__name__', 'in', chunk));
        const eventsSnap = await getDocs(eventsQuery);
        eventsSnap.forEach(doc => {
          events[doc.id] = { ...doc.data() as Event, id: doc.id };
        });
      }

      const certsWithData = certificates.map(cert => ({
        ...cert,
        event: events[cert.eventId],
      }));

      setCertificatesWithEvents(certsWithData);
      setIsLoading(false);
    };

    fetchEventsForCertificates();
  }, [certificates, firestore, user]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Certificates</CardTitle>
        <CardDescription>Your earned certificates from events.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && <p>Loading certificates...</p>}
        {!isLoading && certificatesWithEvents && certificatesWithEvents.length > 0 ? (
          <div className="space-y-4">
            {certificatesWithEvents.map(cert => (
              <CertificateEntry key={cert.id} cert={cert} />
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
        });
    }, [user]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Recommended For You</CardTitle>
                <CardDescription>Events you might be interested in, powered by EventBuddy AI.</CardDescription>
            </CardHeader>
            <CardContent>
                {loading && <p>Generating recommendations...</p>}
                {recommendations && (
                    <ul className="list-disc space-y-2 pl-5">
                        {recommendations.recommendations.map((rec, index) => (
                            <li key={index} className="text-muted-foreground">{rec}</li>
                        ))}
                    </ul>
                )}
            </CardContent>
        </Card>
    );
}

'use client';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFirebase } from '@/firebase';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useMemoFirebase } from '@/firebase/provider';
import type { Event, Certificate } from '@/lib/types';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Download, Linkedin, ExternalLink } from 'lucide-react';
import { getPersonalizedEventRecommendations, PersonalizedEventRecommendationsOutput } from '@/ai/flows/personalized-event-recommendations';


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
    if (!user) return;

    const fetchRegistrations = async () => {
      setIsLoading(true);
      const registrationsQuery = query(collection(firestore, 'registrations'), where('userId', '==', user.uid));
      const registrationSnap = await getDocs(registrationsQuery);
      const eventIds = registrationSnap.docs.map(doc => doc.data().eventId);

      if (eventIds.length > 0) {
        const eventsQuery = query(collection(firestore, 'events'), where('id', 'in', eventIds));
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

function MyCertificates() {
  const { firestore, user } = useFirebase();

  const certificatesQuery = useMemoFirebase(() => {
    if (!user) return null;
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
        {isLoading && <p>Loading certificates...</p>}
        {!isLoading && certificates && certificates.length > 0 ? (
          <div className="space-y-4">
            {certificates.map(cert => (
              <div key={cert.id} className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-semibold">Certificate for Event: {cert.eventId}</p>
                  <p className="text-sm text-muted-foreground truncate">ID: {cert.id}</p>
                  <p className="text-sm text-muted-foreground truncate">Hash: {cert.hash}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Linkedin className="h-4 w-4" />
                  </Button>
                </div>
              </div>
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

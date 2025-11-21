
'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { PageHeader } from '@/components/page-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFirebase, setDocumentNonBlocking, addDocumentNonBlocking } from '@/firebase';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, where, getDocs, setDoc, doc } from 'firebase/firestore';
import { useMemoFirebase } from '@/firebase/provider';
import type { Event, Registration } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { QRCodeSVG } from 'qrcode.react';

export default function OrganizerDashboardPage() {
  const { user } = useFirebase();
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'my-events';

  return (
    <div className="mx-auto w-full max-w-7xl animate-in fade-in-50">
      <PageHeader
        title="Organizer Dashboard"
        description={`Manage your events, ${user?.displayName || 'Organizer'}.`}
      />
      <Tabs defaultValue={defaultTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="create-event">Create Event</TabsTrigger>
          <TabsTrigger value="my-events">My Events</TabsTrigger>
          <TabsTrigger value="registrations">Registrations</TabsTrigger>
          <TabsTrigger value="qr-generator">QR Generator</TabsTrigger>
          <TabsTrigger value="free-section-finder">Free Section Finder</TabsTrigger>
        </TabsList>
        <TabsContent value="create-event">
          <CreateEventForm />
        </TabsContent>
        <TabsContent value="my-events">
          <MyEvents />
        </TabsContent>
        <TabsContent value="registrations">
          <RegistrationsList />
        </TabsContent>
        <TabsContent value="qr-generator">
          <QRGenerator />
        </TabsContent>
        <TabsContent value="free-section-finder">
          <FreeSectionFinder />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CreateEventForm() {
  const { firestore, user } = useFirebase();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || !firestore) return;
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const eventId = uuidv4();
    const eventData: Omit<Event, 'id'> = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      startTime: new Date(formData.get('date') as string).toISOString(),
      endTime: new Date(formData.get('date') as string).toISOString(), // Simplified for demo
      location: formData.get('venue') as string,
      category: formData.get('category') as string,
      tags: (formData.get('tags') as string).split(',').map(tag => tag.trim()),
      organizerId: user.uid,
      image: `https://picsum.photos/seed/${eventId}/600/400`,
    };

    const eventRef = doc(firestore, 'events', eventId);
    setDocumentNonBlocking(eventRef, eventData, { merge: false });
    
    toast({
      title: 'Event Created!',
      description: `${eventData.name} has been successfully created.`,
    });
    (e.target as HTMLFormElement).reset();

    setIsLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a New Event</CardTitle>
        <CardDescription>Fill out the details below.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input name="name" placeholder="Event Name" required />
          <Textarea name="description" placeholder="Event Description" required />
          <Input name="date" type="datetime-local" required />
          <Input name="venue" placeholder="Venue" required />
          <Input name="category" placeholder="Category (e.g., Technology)" />
          <Input name="tags" placeholder="Tags (comma-separated, e.g., AI, Web)" />
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Event
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function MyEvents() {
  const { firestore, user } = useFirebase();
  const eventsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(collection(firestore, 'events'), where('organizerId', '==', user.uid));
  }, [firestore, user]);
  const { data: events, isLoading } = useCollection<Event>(eventsQuery);

  return (
    <Card>
      <CardHeader><CardTitle>My Events</CardTitle></CardHeader>
      <CardContent>
        {isLoading && <p>Loading events...</p>}
        {events && events.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {events.map(event => (
              <Card key={event.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{event.name}</CardTitle>
                  <CardDescription>{new Date(event.startTime).toLocaleDateString()}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : !isLoading && <p>You have not created any events.</p>}
      </CardContent>
    </Card>
  );
}

function RegistrationsList() {
    const { firestore, user } = useFirebase();
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user || !firestore) return;
        // This is simplified. A real app would likely query registrations per event.
        const fetchRegistrations = async () => {
            const regsQuery = query(collection(firestore, 'registrations'));
            const querySnapshot = await getDocs(regsQuery);
            setRegistrations(querySnapshot.docs.map(doc => doc.data() as Registration));
            setIsLoading(false);
        };
        fetchRegistrations();
    }, [user, firestore]);

    return (
        <Card>
            <CardHeader><CardTitle>Registrations</CardTitle></CardHeader>
            <CardContent>
                {isLoading && <p>Loading...</p>}
                {!isLoading && registrations.length > 0 ? (
                    <ul>{registrations.map((r, i) => <li key={i}>{r.userId} for {r.eventId}</li>)}</ul>
                ) : !isLoading && <p>No registrations yet.</p>}
            </CardContent>
        </Card>
    );
}

function QRGenerator() {
    const [eventId, setEventId] = useState('');

    return (
        <Card>
            <CardHeader>
                <CardTitle>QR Code Generator</CardTitle>
                <CardDescription>Enter an Event ID to generate a QR code for check-in.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="event-id-qr">Event ID</Label>
                    <Input id="event-id-qr" value={eventId} onChange={(e) => setEventId(e.target.value)} placeholder="Enter Event ID" />
                </div>
                
                {eventId && (
                    <div className="mt-4 text-center p-4 bg-white rounded-md inline-block">
                        <QRCodeSVG value={eventId} size={256} />
                        <p className="mt-2 text-sm text-muted-foreground">Scan this for check-in.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

function FreeSectionFinder() {
    const timetable = {
      "CSE-A": [],
      "CSE-B": ["10:00-11:00"],
      "ECE-A": [],
      "MECH-A": ["09:00-12:00"]
    };
    
    const freeSections = Object.entries(timetable)
        .filter(([, schedule]) => schedule.length === 0)
        .map(([section]) => section);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Free Section Finder</CardTitle>
                <CardDescription>Find sections that are currently free based on timetable data.</CardDescription>
            </CardHeader>
            <CardContent>
                <h4 className="font-semibold mb-2">Available Sections:</h4>
                <ul className="list-disc pl-5">
                    {freeSections.map(section => (
                        <li key={section}>{section}</li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
}


'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { PageHeader } from '@/components/page-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFirebase, setDocumentNonBlocking, addDocumentNonBlocking } from '@/firebase';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, where, getDocs, setDoc, doc, documentId } from 'firebase/firestore';
import { useMemoFirebase } from '@/firebase/provider';
import type { Event, Registration, Attendance, User } from '@/lib/types';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"


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
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
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
         <TabsContent value="attendance">
          <AttendanceList />
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
    const imageUrl = formData.get('imageUrl') as string;

    const eventData: Omit<Event, 'id'> = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      startTime: new Date(formData.get('date') as string).toISOString(),
      endTime: new Date(formData.get('date') as string).toISOString(), // Simplified for demo
      location: formData.get('venue') as string,
      category: formData.get('category') as string,
      tags: (formData.get('tags') as string).split(',').map(tag => tag.trim()),
      organizerId: user.uid,
      image: imageUrl || `https://picsum.photos/seed/${eventId}/600/400`,
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
          <Input name="imageUrl" placeholder="Image URL (e.g., /1.jpg) - Optional" />
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
      <CardHeader>
        <CardTitle>My Events</CardTitle>
        <CardDescription>A list of events you have created.</CardDescription>
      </CardHeader>
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
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
    const [registeredUsers, setRegisteredUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const eventsQuery = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        return query(collection(firestore, 'events'), where('organizerId', '==', user.uid));
    }, [firestore, user]);
    const { data: events, isLoading: isLoadingEvents } = useCollection<Event>(eventsQuery);

    useEffect(() => {
        if (!selectedEventId || !firestore) {
            setRegisteredUsers([]);
            return;
        }

        const fetchRegistrations = async () => {
            setIsLoading(true);
            try {
                const regsQuery = query(collection(firestore, 'registrations'), where('eventId', '==', selectedEventId));
                const regsSnap = await getDocs(regsQuery);
                const userIds = regsSnap.docs.map(doc => doc.data().userId);

                if (userIds.length > 0) {
                    const usersData: User[] = [];
                    for (let i = 0; i < userIds.length; i += 30) {
                        const chunk = userIds.slice(i, i + 30);
                        const usersQuery = query(collection(firestore, 'users'), where(documentId(), 'in', chunk));
                        const usersSnap = await getDocs(usersQuery);
                        usersSnap.forEach(doc => {
                           usersData.push({ ...doc.data(), id: doc.id } as User)
                        });
                    }
                    setRegisteredUsers(usersData);
                } else {
                    setRegisteredUsers([]);
                }
            } catch (error) {
                console.error("Error fetching registered users:", error);
                setRegisteredUsers([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRegistrations();

    }, [selectedEventId, firestore]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Event Registrations</CardTitle>
                <CardDescription>View who has registered for your event.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Select onValueChange={setSelectedEventId} disabled={isLoadingEvents}>
                    <SelectTrigger>
                        <SelectValue placeholder={isLoadingEvents ? "Loading events..." : "Select an event"} />
                    </SelectTrigger>
                    <SelectContent>
                        {events && events.length > 0 ? (
                            events.map(event => (
                                <SelectItem key={event.id} value={event.id}>{event.name}</SelectItem>
                            ))
                        ) : (
                            <SelectItem value="no-events" disabled>You have no events</SelectItem>
                        )}
                    </SelectContent>
                </Select>

                {isLoading && <div className="flex items-center justify-center p-4"><Loader2 className="mr-2 h-4 w-4 animate-spin" />Loading registrations...</div>}
                
                {!isLoading && selectedEventId && registeredUsers.length === 0 && (
                    <p className="text-center text-muted-foreground pt-4">No one has registered for this event yet.</p>
                )}
                 {!isLoading && !selectedEventId && (
                    <p className="text-center text-muted-foreground pt-4">Please select an event to view registrations.</p>
                )}

                {!isLoading && registeredUsers.length > 0 && (
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {registeredUsers.map((regUser) => (
                                <TableRow key={regUser.id}>
                                    <TableCell>{regUser.name}</TableCell>
                                    <TableCell>{regUser.email}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}

function AttendanceList() {
    const { firestore, user } = useFirebase();
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
    const [attendees, setAttendees] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const eventsQuery = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        return query(collection(firestore, 'events'), where('organizerId', '==', user.uid));
    }, [firestore, user]);
    const { data: events, isLoading: isLoadingEvents } = useCollection<Event>(eventsQuery);

    useEffect(() => {
        if (!selectedEventId || !firestore) {
            setAttendees([]);
            return;
        }

        const fetchAttendees = async () => {
            setIsLoading(true);
            try {
                const attendanceQuery = query(collection(firestore, 'attendance'), where('eventId', '==', selectedEventId));
                const attendanceSnap = await getDocs(attendanceQuery);
                const userIds = attendanceSnap.docs.map(doc => doc.data().userId);

                if (userIds.length > 0) {
                    const usersData: User[] = [];
                    // Firestore 'in' query is limited to 30 items per request.
                    // We chunk the userIds array to handle more than 30 attendees.
                    for (let i = 0; i < userIds.length; i += 30) {
                        const chunk = userIds.slice(i, i + 30);
                        const usersQuery = query(collection(firestore, 'users'), where(documentId(), 'in', chunk));
                        const usersSnap = await getDocs(usersQuery);
                        usersSnap.forEach(doc => {
                           usersData.push({ ...doc.data(), id: doc.id } as User)
                        });
                    }
                    setAttendees(usersData);
                } else {
                    setAttendees([]);
                }
            } catch (error) {
                console.error("Error fetching attendees:", error);
                setAttendees([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAttendees();

    }, [selectedEventId, firestore]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Event Attendance</CardTitle>
                <CardDescription>View who has checked into your event.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Select onValueChange={setSelectedEventId} disabled={isLoadingEvents}>
                    <SelectTrigger>
                        <SelectValue placeholder={isLoadingEvents ? "Loading events..." : "Select an event"} />
                    </SelectTrigger>
                    <SelectContent>
                        {events && events.length > 0 ? (
                            events.map(event => (
                                <SelectItem key={event.id} value={event.id}>{event.name}</SelectItem>
                            ))
                        ) : (
                            <SelectItem value="no-events" disabled>You have no events</SelectItem>
                        )}
                    </SelectContent>
                </Select>

                {isLoading && <div className="flex items-center justify-center p-4"><Loader2 className="mr-2 h-4 w-4 animate-spin" />Loading attendance...</div>}
                
                {!isLoading && selectedEventId && attendees.length === 0 && (
                    <p className="text-center text-muted-foreground pt-4">No one has checked in yet for this event.</p>
                )}
                 {!isLoading && !selectedEventId && (
                    <p className="text-center text-muted-foreground pt-4">Please select an event to view attendance.</p>
                )}

                {!isLoading && attendees.length > 0 && (
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {attendees.map((attendee) => (
                                <TableRow key={attendee.id}>
                                    <TableCell>{attendee.name}</TableCell>
                                    <TableCell>{attendee.email}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
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

    
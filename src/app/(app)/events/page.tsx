'use client'
import Link from 'next/link';
import { PageHeader } from '@/components/page-header';
import { Input } from '@/components/ui/input';
import { PlusCircle, Search } from 'lucide-react';
import { EventCard } from '@/components/event-card';
import { useFirebase } from '@/firebase';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection } from 'firebase/firestore';
import { useMemoFirebase } from '@/firebase/provider';
import { Event } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function EventsPage() {
  const { firestore } = useFirebase();

  // In a real app, this query would be more complex, fetching all public events.
  // For now, it fetches from a top-level 'events' collection.
  const eventsQuery = useMemoFirebase(() => {
    return collection(firestore, 'events');
  }, [firestore]);

  const { data: events, isLoading } = useCollection<Event>(eventsQuery);

  return (
    <div className="animate-in fade-in-50">
      <PageHeader
        title="Discover Events"
        description="Browse and search for events that match your interests."
      >
        <Button asChild>
          <Link href="/organizer-dashboard?tab=create-event">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Event
          </Link>
        </Button>
      </PageHeader>
      
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search events..." className="pl-10" />
        </div>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="technology">Technology</SelectItem>
            <SelectItem value="design">Design</SelectItem>
            <SelectItem value="career">Career</SelectItem>
            <SelectItem value="competition">Competition</SelectItem>
            <SelectItem value="lecture">Lecture</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="this-week">This Week</SelectItem>
            <SelectItem value="this-month">This Month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="border rounded-xl p-4 space-y-3">
              <div className="aspect-video w-full rounded bg-muted animate-pulse" />
              <div className="h-5 w-3/4 rounded bg-muted animate-pulse" />
              <div className="h-4 w-1/2 rounded bg-muted animate-pulse" />
              <div className="h-4 w-1/3 rounded bg-muted animate-pulse" />
            </div>
          ))}
        </div>
      )}

      {!isLoading && events && events.length > 0 &&(
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}

       {!isLoading && (!events || events.length === 0) && (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <h3 className="text-xl font-semibold">No events found</h3>
          <p className="text-muted-foreground mt-2">Check back later or create a new event.</p>
        </div>
      )}
    </div>
  );
}

import { PageHeader } from '@/components/page-header';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { events } from '@/lib/data';
import { EventCard } from '@/components/event-card';

export default function EventsPage() {
  return (
    <div className="animate-in fade-in-50">
      <PageHeader
        title="Discover Events"
        description="Browse and search for events that match your interests."
      >
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search events..." className="pl-10" />
        </div>
      </PageHeader>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}

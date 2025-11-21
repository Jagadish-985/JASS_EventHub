import Image from 'next/image';
import { Calendar, MapPin } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Event } from '@/lib/types';
import { Button } from './ui/button';
import Link from 'next/link';

export function EventCard({ event }: { event: Event }) {
  const placeholderImage =
    event.image ||
    `https://picsum.photos/seed/${event.id}/600/400`;

  return (
    <Card className="flex h-full flex-col overflow-hidden rounded-xl shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-card">
      <CardHeader className="p-0">
        <Link href={`/events/${event.id}`} className="block">
            <div className="relative h-48 w-full">
              <Image
                src={placeholderImage}
                alt={event.name}
                fill
                className="object-cover"
                data-ai-hint="event photo"
              />
               <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
        </Link>
      </CardHeader>
      <CardContent className="flex-grow p-4">
         {event.category && <Badge variant="secondary" className="mb-2 uppercase text-xs tracking-wider">{event.category}</Badge>}
        <CardTitle className="text-xl font-bold tracking-tight leading-tight mb-2">{event.name}</CardTitle>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{new Date(event.startTime).toLocaleDateString('en-US', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{event.location}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full" variant="outline">
          <Link href={`/events/${event.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

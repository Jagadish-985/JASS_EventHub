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
    <Card className="flex h-full flex-col overflow-hidden rounded-xl shadow-md transition-all hover:shadow-xl hover:-translate-y-1">
      <CardHeader className="p-0">
        <Link href={`/events/${event.id}`} className="block">
            <div className="relative h-48 w-full">
              <Image
                src={placeholderImage}
                alt={event.name}
                layout="fill"
                objectFit="cover"
                className="object-cover"
                data-ai-hint="event photo"
              />
            </div>
        </Link>
        <div className="p-4 pb-2">
           {event.category && <Badge variant="outline" className="mb-2">{event.category}</Badge>}
          <CardTitle className="text-lg font-semibold tracking-tight">{event.name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4 pt-0">
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{new Date(event.startTime).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{event.location}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link href={`/events/${event.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

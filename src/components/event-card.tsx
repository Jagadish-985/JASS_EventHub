import Image from 'next/image';
import { Calendar, MapPin, Tag } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Event } from '@/lib/types';
import { Button } from './ui/button';

export function EventCard({ event }: { event: Event }) {
  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <Image
            src={event.image}
            alt={event.title}
            fill
            className="object-cover"
            data-ai-hint="event photo"
          />
        </div>
        <div className="p-6 pb-2">
          <Badge variant="secondary" className="mb-2">{event.category}</Badge>
          <CardTitle className="text-xl font-headline tracking-tight">{event.title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-6 pt-0">
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{new Date(event.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{event.location}</span>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {event.tags.map((tag) => (
            <Badge key={tag} variant="outline">{tag}</Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button className="w-full">View Details</Button>
      </CardFooter>
    </Card>
  );
}

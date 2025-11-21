'use client';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import RecommendedEvents from './recommended-events';
import { useFirebase } from '@/firebase';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, limit, query } from 'firebase/firestore';
import { useMemoFirebase } from '@/firebase/provider';
import type { Event } from '@/lib/types';
import Image from 'next/image';

export default function DashboardPage() {
  const { firestore, user } = useFirebase();

  const eventsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(
      collection(firestore, 'users', user.uid, 'events'),
      limit(3)
    );
  }, [firestore, user]);

  const { data: upcomingEvents, isLoading: isLoadingEvents } = useCollection<Event>(eventsQuery);

  if (!user) {
    return null;
  }

  return (
    <div className="animate-in fade-in-50">
      <PageHeader
        title={`Welcome back, ${user.displayName?.split(' ')[0] || 'User'}!`}
        description="Here's what's happening in your event world."
      />
      <div className="grid gap-6">
        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>Don't miss out on these events.</CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm">
                <Link href="/events">
                  View All <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {isLoadingEvents ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="aspect-[4/2.5] w-full rounded-lg bg-muted animate-pulse" />
                      <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
                      <div className="h-4 w-1/2 rounded bg-muted animate-pulse" />
                    </div>
                  ))
                ) : (
                  upcomingEvents?.map((event) => (
                    <Link href="#" key={event.id} className="group">
                      <div className="overflow-hidden rounded-lg">
                        <Image
                          src={event.image}
                          alt={event.title}
                          width={400}
                          height={250}
                          data-ai-hint="technology conference"
                          className="object-cover transition-transform group-hover:scale-105 aspect-[4/2.5]"
                        />
                      </div>
                      <h3 className="font-semibold mt-2 group-hover:text-primary">{event.title}</h3>
                      <p className="text-sm text-muted-foreground">{new Date(event.date).toLocaleDateString()}</p>
                    </Link>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>EventBuddy AI</CardTitle>
              <CardDescription>Personalized recommendations for you.</CardDescription>
            </CardHeader>
            <CardContent>
              <RecommendedEvents />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { getPersonalizedEventRecommendations, PersonalizedEventRecommendationsOutput } from '@/ai/flows/personalized-event-recommendations';
import { Button } from '@/components/ui/button';
import { Wand2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useFirebase } from '@/firebase';

export default function RecommendedEvents() {
  const { user } = useFirebase();
  const [recommendations, setRecommendations] = useState<PersonalizedEventRecommendationsOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = async () => {
    if (!user || !user.uid) return;
    setLoading(true);
    setError(null);
    try {
      // NOTE: In a real app, you would fetch user interests and past attendance from your database.
      // For now, we'll use some placeholder data.
      const result = await getPersonalizedEventRecommendations({
        userInterests: ['AI', 'Web Development', 'UX Design'],
        pastAttendance: ['Web Dev Conf 2023', 'Intro to Machine Learning'],
      });
      setRecommendations(result);
    } catch (e) {
      setError('Failed to get recommendations. Please try again.');
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRecommendations();
  }, [user]);

  return (
    <div className="space-y-4">
      {loading ? (
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
      ) : error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : (
        <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
          {recommendations?.recommendations.map((rec, index) => (
            <li key={index}>{rec}</li>
          ))}
        </ul>
      )}
      <Button onClick={fetchRecommendations} disabled={loading} size="sm" className="w-full">
        <Wand2 className="mr-2 h-4 w-4" />
        {loading ? 'Refreshing...' : 'Refresh Recommendations'}
      </Button>
    </div>
  );
}

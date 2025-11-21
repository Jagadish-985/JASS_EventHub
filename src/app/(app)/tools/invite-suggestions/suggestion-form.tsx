'use client';

import { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { suggestSectionsToInvite, SuggestSectionsToInviteOutput } from '@/ai/flows/suggest-sections-to-invite';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Wand2, Lightbulb, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const formSchema = z.object({
  eventDescription: z.string().min(20, {
    message: "Event description must be at least 20 characters.",
  }),
  timetableData: z.string().min(50, {
    message: "Timetable data must be at least 50 characters.",
  }),
})

export default function SuggestionForm() {
  const [result, setResult] = useState<SuggestSectionsToInviteOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eventDescription: "",
      timetableData: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await suggestSectionsToInvite(values);
      setResult(response);
    } catch (e) {
      setError('Failed to get suggestions. Please try again.');
      console.error(e);
    }
    setLoading(false);
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Event Details</CardTitle>
          <CardDescription>Provide details about your event and timetable data.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="eventDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., A workshop on the future of AI..." {...field} rows={5} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="timetableData"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Timetable Data</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Paste timetable data here. Include section, subject, and timings." {...field} rows={10} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                {loading ? 'Analyzing...' : 'Get Suggestions'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <Card className="h-full">
        <CardHeader>
          <CardTitle>AI-Powered Suggestions</CardTitle>
          <CardDescription>Recommended sections to invite will appear here.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading && (
            <div className="flex items-center justify-center h-full flex-col gap-4 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p>Analyzing data and generating suggestions...</p>
            </div>
          )}
          {error && <p className="text-destructive">{error}</p>}
          {result && (
            <div className="space-y-6 animate-in fade-in-50">
              <div>
                <h4 className="font-semibold mb-2">Suggested Sections</h4>
                <div className="flex flex-wrap gap-2">
                  {result.suggestedSections.map((section) => (
                    <Badge key={section} variant="default" className="text-sm px-3 py-1">{section}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2"><Lightbulb className="text-primary h-5 w-5"/>Reasoning</h4>
                <p className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-md border">{result.reasoning}</p>
              </div>
            </div>
          )}
          {!loading && !result && !error && (
             <div className="flex items-center justify-center h-full flex-col gap-4 text-muted-foreground text-center">
                <Wand2 className="h-12 w-12 text-primary/20" />
                <p>Fill out the form to get your AI-powered guest list suggestions.</p>
              </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

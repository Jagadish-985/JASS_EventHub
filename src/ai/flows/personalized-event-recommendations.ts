'use server';

/**
 * @fileOverview Provides personalized event recommendations based on user interests and past attendance.
 *
 * - getPersonalizedEventRecommendations - A function that returns personalized event recommendations.
 * - PersonalizedEventRecommendationsInput - The input type for the getPersonalizedEventRecommendations function.
 * - PersonalizedEventRecommendationsOutput - The return type for the getPersonalizedEventRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedEventRecommendationsInputSchema = z.object({
  userInterests: z
    .array(z.string())
    .describe('A list of the user interests, e.g. ["AI", "Machine Learning", "Data Science"]'),
  pastAttendance: z
    .array(z.string())
    .describe('A list of past events the user has attended, e.g. ["AI Conference 2023", "Data Science Meetup"]'),
});
export type PersonalizedEventRecommendationsInput = z.infer<
  typeof PersonalizedEventRecommendationsInputSchema
>;

const PersonalizedEventRecommendationsOutputSchema = z.object({
  recommendations: z.array(z.string()).describe('A list of personalized event recommendations.'),
});
export type PersonalizedEventRecommendationsOutput = z.infer<
  typeof PersonalizedEventRecommendationsOutputSchema
>;

export async function getPersonalizedEventRecommendations(
  input: PersonalizedEventRecommendationsInput
): Promise<PersonalizedEventRecommendationsOutput> {
  return personalizedEventRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedEventRecommendationsPrompt',
  input: {schema: PersonalizedEventRecommendationsInputSchema},
  output: {schema: PersonalizedEventRecommendationsOutputSchema},
  prompt: `You are an AI event recommendation system. Given a user's interests and past attendance, you will provide a list of personalized event recommendations.

User Interests: {{userInterests}}
Past Attendance: {{pastAttendance}}

Recommendations:`,
});

const personalizedEventRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedEventRecommendationsFlow',
    inputSchema: PersonalizedEventRecommendationsInputSchema,
    outputSchema: PersonalizedEventRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

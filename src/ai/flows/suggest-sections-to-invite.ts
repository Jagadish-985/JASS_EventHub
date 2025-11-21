/**
 * @fileOverview Recommends class sections to invite to an event based on timetable data.
 *
 * - suggestSectionsToInvite - A function that recommends class sections to invite.
 * - SuggestSectionsToInviteInput - The input type for the suggestSectionsToInvite function.
 * - SuggestSectionsToInviteOutput - The return type for the suggestSectionsToInvite function.
 */

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestSectionsToInviteInputSchema = z.object({
  eventDescription: z
    .string()
    .describe('The description of the event to suggest sections for.'),
  timetableData: z
    .string()
    .describe(
      'Timetable data including class sections, subjects, and schedules.'
    ),
});
export type SuggestSectionsToInviteInput = z.infer<
  typeof SuggestSectionsToInviteInputSchema
>;

const SuggestSectionsToInviteOutputSchema = z.object({
  suggestedSections: z
    .array(z.string())
    .describe(
      'An array of class section names that should be invited to the event.'
    ),
  reasoning: z
    .string()
    .describe('The reasoning behind suggesting these sections.'),
});
export type SuggestSectionsToInviteOutput = z.infer<
  typeof SuggestSectionsToInviteOutputSchema
>;

export async function suggestSectionsToInvite(
  input: SuggestSectionsToInviteInput
): Promise<SuggestSectionsToInviteOutput> {
  return suggestSectionsToInviteFlow(input);
}

const suggestSectionsToInvitePrompt = ai.definePrompt({
  name: 'suggestSectionsToInvitePrompt',
  input: {schema: SuggestSectionsToInviteInputSchema},
  output: {schema: SuggestSectionsToInviteOutputSchema},
  prompt: `You are an event planning assistant. Recommend class sections to invite to an event, based on the event description and timetable data provided.

Event Description: {{{eventDescription}}}

Timetable Data: {{{timetableData}}}

Suggest class sections that would be most interested in attending the event.

Respond with a list of suggestedSections and the reasoning behind the suggestions in the reasoning field.
`,
});

const suggestSectionsToInviteFlow = ai.defineFlow(
  {
    name: 'suggestSectionsToInviteFlow',
    inputSchema: SuggestSectionsToInviteInputSchema,
    outputSchema: SuggestSectionsToInviteOutputSchema,
  },
  async input => {
    const {output} = await suggestSectionsToInvitePrompt(input);
    return output!;
  }
);

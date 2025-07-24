// This file is machine-generated - edit at your own risk.

'use server';

/**
 * @fileOverview A generic AI flow for text-based interactions.
 *
 * - runGenericPlayground - A function that takes a prompt and returns an AI-generated response.
 * - GenericPlaygroundInput - The input type for the runGenericPlayground function.
 * - GenericPlaygroundOutput - The return type for the runGenericPlayground function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenericPlaygroundInputSchema = z.object({
  prompt: z.string().describe('The user input prompt.'),
  toolName: z.string().describe('The name of the tool being used.'),
  fileDataUri: z.string().optional().describe(
      "A file, if provided, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GenericPlaygroundInput = z.infer<typeof GenericPlaygroundInputSchema>;

const GenericPlaygroundOutputSchema = z.object({
  response: z.string().describe('The AI-generated response.'),
});
export type GenericPlaygroundOutput = z.infer<typeof GenericPlaygroundOutputSchema>;

export async function runGenericPlayground(input: GenericPlaygroundInput): Promise<GenericPlaygroundOutput> {
  return genericPlaygroundFlow(input);
}

const prompt = ai.definePrompt({
  name: 'genericPlaygroundPrompt',
  input: {schema: GenericPlaygroundInputSchema},
  output: {schema: GenericPlaygroundOutputSchema},
  prompt: `You are acting as the AI model for the tool: '{{toolName}}'.
  
  {{#if (eq toolName "Document Generator")}}
  Please provide a well-structured response using Markdown for formatting (e.g., headings, lists, bold text).
  {{/if}}
  
  Respond to the user's prompt naturally, as if you are that tool.

  User prompt:
  {{{prompt}}}

  {{#if fileDataUri}}
  The user has also provided a file for context. Analyze it as part of their request.
  File: {{media url=fileDataUri}}
  {{/if}}
  `,
});

const genericPlaygroundFlow = ai.defineFlow(
  {
    name: 'genericPlaygroundFlow',
    inputSchema: GenericPlaygroundInputSchema,
    outputSchema: GenericPlaygroundOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

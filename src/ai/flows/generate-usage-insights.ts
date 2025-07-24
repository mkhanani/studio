// This file is machine-generated - edit at your own risk.

'use server';

/**
 * @fileOverview AI agent that analyzes tool usage logs and generates insights.
 *
 * - generateUsageInsights - A function that analyzes tool usage logs and provides insights.
 * - GenerateUsageInsightsInput - The input type for the generateUsageInsights function.
 * - GenerateUsageInsightsOutput - The return type for the generateUsageInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateUsageInsightsInputSchema = z.object({
  logs: z.string().describe('The tool usage logs in JSON format.'),
});
export type GenerateUsageInsightsInput = z.infer<typeof GenerateUsageInsightsInputSchema>;

const GenerateUsageInsightsOutputSchema = z.object({
  insights: z.string().describe('The generated insights from the tool usage logs.'),
  recommendations: z.string().describe('Recommendations based on the generated insights.'),
});
export type GenerateUsageInsightsOutput = z.infer<typeof GenerateUsageInsightsOutputSchema>;

export async function generateUsageInsights(input: GenerateUsageInsightsInput): Promise<GenerateUsageInsightsOutput> {
  return generateUsageInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateUsageInsightsPrompt',
  input: {schema: GenerateUsageInsightsInputSchema},
  output: {schema: GenerateUsageInsightsOutputSchema},
  prompt: `You are an AI assistant that analyzes tool usage logs and provides insights and recommendations to the administrator.

  Analyze the following tool usage logs:
  {{{logs}}}

  Provide insights on which tools are most and least used, and identify usage patterns within departments. Based on these insights, give recommendations about tool assignments and resource allocation.

  Format the response as follows:
  {
    "insights": "...",
    "recommendations": "..."
  }`,
});

const generateUsageInsightsFlow = ai.defineFlow(
  {
    name: 'generateUsageInsightsFlow',
    inputSchema: GenerateUsageInsightsInputSchema,
    outputSchema: GenerateUsageInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

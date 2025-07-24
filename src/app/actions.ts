'use server';

import { generateUsageInsights, type GenerateUsageInsightsInput } from '@/ai/flows/generate-usage-insights';
import { runGenericPlayground, type GenericPlaygroundInput } from '@/ai/flows/generic-playground-flow';

export async function getUsageInsightsAction(input: GenerateUsageInsightsInput) {
  try {
    const result = await generateUsageInsights(input);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to generate insights.' };
  }
}

export async function runGenericPlaygroundAction(input: GenericPlaygroundInput) {
    try {
        const result = await runGenericPlayground(input);
        return { success: true, data: result };
    } catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, error: `Failed to get response from AI: ${errorMessage}` };
    }
}

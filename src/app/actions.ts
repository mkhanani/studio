'use server';

import { generateUsageInsights, type GenerateUsageInsightsInput } from '@/ai/flows/generate-usage-insights';

export async function getUsageInsightsAction(input: GenerateUsageInsightsInput) {
  try {
    const result = await generateUsageInsights(input);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to generate insights.' };
  }
}

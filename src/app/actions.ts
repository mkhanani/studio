'use server';

import { generateUsageInsights, type GenerateUsageInsightsInput } from '@/ai/flows/generate-usage-insights';
import { runGenericPlayground, type GenericPlaygroundInput } from '@/ai/flows/generic-playground-flow';
import { generateImage, type GenerateImageInput } from '@/ai/flows/image-generation-flow';
import { generateAudio, type GenerateAudioInput } from '@/ai/flows/audio-generation-flow';

export async function getUsageInsightsAction(input: GenerateUsageInsightsInput) {
  try {
    const result = await generateUsageInsights(input);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, error: `Failed to generate insights: ${errorMessage}` };
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

export async function generateImageAction(input: GenerateImageInput) {
    try {
        const result = await generateImage(input);
        return { success: true, data: result };
    } catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, error: `Failed to generate image: ${errorMessage}` };
    }
}

export async function generateAudioAction(input: GenerateAudioInput) {
    try {
        const result = await generateAudio(input);
        return { success: true, data: result };
    } catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, error: `Failed to generate audio: ${errorMessage}` };
    }
}

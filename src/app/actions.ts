'use server';

import { suggestMotorRpm, SuggestMotorRpmInput } from '@/ai/flows/suggest-motor-rpm';
import type { SimilarMotorData } from '@/lib/types';

export async function getAISuggestions(motor: SimilarMotorData) {
    if (!motor.equipment) {
        return { success: false, error: 'Equipment information is not available for this motor.' };
    }
    
    const input: SuggestMotorRpmInput = {
        equipment: motor.equipment,
    };
    
    try {
        const result = await suggestMotorRpm(input);
        return { success: true, suggestions: result.suggestion };
    } catch (error) {
        console.error('AI Suggestion Error:', error);
        return { success: false, error: 'Failed to get AI suggestions.' };
    }
}

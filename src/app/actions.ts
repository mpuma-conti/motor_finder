'use server';

import { suggestAlternativeMotors, SuggestAlternativeMotorsInput } from '@/ai/flows/suggest-alternative-motors';
import type { SimilarMotorData } from '@/lib/types';

export async function getAISuggestions(motor: SimilarMotorData) {
    const performanceMetrics = `Power: ${motor.power} kW, RPM: ${motor.rpm}, Power(HP): ${motor.power_hp}, Flange: ${motor.flange}`;
    
    const input: SuggestAlternativeMotorsInput = {
        motorCode: motor.motor_code,
        powerHp: motor.power_hp ?? undefined,
        rpm: motor.rpm ?? undefined,
        flange: motor.flange ?? undefined,
        performanceMetrics: performanceMetrics,
    };
    
    try {
        const result = await suggestAlternativeMotors(input);
        return { success: true, suggestions: result.suggestions };
    } catch (error) {
        console.error('AI Suggestion Error:', error);
        return { success: false, error: 'Failed to get AI suggestions.' };
    }
}

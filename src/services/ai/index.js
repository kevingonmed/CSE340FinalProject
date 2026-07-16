import { generateGroqItinerary } from './providers/groq.js';
import { generateMockItinerary } from './providers/mock.js';

const generateItinerary = async (input) => {
    const provider = (process.env.AI_PROVIDER || 'mock').toLowerCase();

    if (provider === 'groq') {
        try {
            const itinerary = await generateGroqItinerary(input);
            return { itinerary, providerUsed: 'groq', usedFallback: false };
        } catch (error) {
            console.error('Groq generation failed, falling back to mock:', error.message);
            const itinerary = generateMockItinerary(input);
            return { itinerary, providerUsed: 'mock', usedFallback: true };
        }
    }

    const itinerary = generateMockItinerary(input);
    return { itinerary, providerUsed: 'mock', usedFallback: false };
};

export { generateItinerary };

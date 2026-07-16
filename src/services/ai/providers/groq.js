import { buildTripPrompt } from '../prompt.js';

const parseJsonContent = (content) => {
    if (typeof content === 'string') {
        return JSON.parse(content);
    }
    if (typeof content === 'object' && content !== null) {
        return content;
    }
    throw new Error('Groq returned an unexpected response format.');
};

const validateItineraryShape = (itinerary, expectedTripDays) => {
    if (!itinerary || typeof itinerary !== 'object') return false;
    if (typeof itinerary.destination !== 'string' || !itinerary.destination.trim()) return false;
    if (typeof itinerary.whyPicked !== 'string' || !itinerary.whyPicked.trim()) return false;
    if (!Array.isArray(itinerary.days) || itinerary.days.length !== expectedTripDays) return false;

    for (let index = 0; index < itinerary.days.length; index += 1) {
        const day = itinerary.days[index];
        if (typeof day.dayNumber !== 'number') return false;
        if (day.dayNumber !== index + 1) return false;
        if (typeof day.title !== 'string' || !day.title.trim()) return false;
        if (!Array.isArray(day.activities) || day.activities.length === 0) return false;
        for (const activity of day.activities) {
            if (typeof activity.time !== 'string' || !activity.time.trim()) return false;
            if (typeof activity.description !== 'string' || !activity.description.trim()) return false;
            if (typeof activity.estimatedCost !== 'number' || Number.isNaN(activity.estimatedCost)) return false;
        }
    }

    return true;
};

const generateGroqItinerary = async (input) => {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        throw new Error('Missing GROQ_API_KEY environment variable.');
    }

    const model = process.env.GROQ_MODEL || 'llama-3.1-8b-instant';
    const prompt = buildTripPrompt(input);

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model,
            messages: [
                { role: 'system', content: 'Return only valid JSON.' },
                { role: 'user', content: prompt }
            ],
            response_format: { type: 'json_object' },
            temperature: 0.7
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Groq API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;
    const itinerary = parseJsonContent(content);

    if (!validateItineraryShape(itinerary, input.tripDays)) {
        throw new Error('Groq response JSON did not match the itinerary format.');
    }

    return itinerary;
};

export { generateGroqItinerary };

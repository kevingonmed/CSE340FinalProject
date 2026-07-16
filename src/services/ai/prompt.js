const buildTripPrompt = ({ homeCity, budget, travelDates, tripDays, groupType, vibe }) => `
You are an expert travel planner.
Create a realistic ${tripDays}-day travel itinerary based on this input:
- Home city: ${homeCity}
- Budget (USD): ${budget}
- Travel dates: ${travelDates}
- Group type: ${groupType}
- Preferred vibe: ${vibe}

Return ONLY valid JSON. No markdown. No extra text.

Required JSON shape:
{
  "destination": "City, Region",
  "whyPicked": "one short paragraph",
  "days": [
    {
      "dayNumber": 1,
      "title": "short day title",
      "activities": [
        {
          "time": "9:00 AM",
          "description": "activity text",
          "estimatedCost": 0
        }
      ]
    }
  ]
}

Rules:
- Exactly ${tripDays} days
- 2 to 4 activities per day
- dayNumber values must run sequentially from 1 to ${tripDays}
- estimatedCost must be a number >= 0
- Keep total cost reasonable for the provided budget
`;

export { buildTripPrompt };

const generateMockItinerary = ({ homeCity, budget, travelDates, tripDays = 3, groupType, vibe }) => {
    const destinationByVibe = {
        adventure: 'Moab, Utah',
        relax: 'Carmel-by-the-Sea, California',
        culture: 'Santa Fe, New Mexico',
        food: 'Portland, Oregon',
        nature: 'Jackson, Wyoming'
    };

    const destination = destinationByVibe[vibe] || 'Denver, Colorado';
    const budgetLevel = Number(budget) < 700 ? 'budget-friendly' : Number(budget) > 1800 ? 'premium' : 'balanced';
    const groupLabel = groupType.charAt(0).toUpperCase() + groupType.slice(1);
    const days = [];

    for (let dayNumber = 1; dayNumber <= tripDays; dayNumber += 1) {
        const isLastDay = dayNumber === tripDays;
        const dayTitle = isLastDay ? 'Wrap-Up and Return' : `Day ${dayNumber} ${vibe} Highlights`;
        const activities = isLastDay
            ? [
                { time: '9:30 AM', description: 'Relaxed morning and souvenir stop', estimatedCost: 30 },
                { time: '12:00 PM', description: `Check out and return travel (${travelDates})`, estimatedCost: 0 }
            ]
            : [
                { time: '9:00 AM', description: `Explore key ${vibe} spots in ${destination}`, estimatedCost: 25 },
                { time: '1:00 PM', description: `${groupLabel} lunch and local recommendations`, estimatedCost: 30 },
                { time: '4:30 PM', description: 'Flexible free-time activity block', estimatedCost: 15 }
            ];

        days.push({
            dayNumber,
            title: dayTitle,
            activities
        });
    }

    return {
        destination,
        whyPicked: `${destination} matches your ${vibe} vibe, ${budgetLevel} budget range, and ${groupLabel.toLowerCase()} travel style from ${homeCity}.`,
        days
    };
};

export { generateMockItinerary };

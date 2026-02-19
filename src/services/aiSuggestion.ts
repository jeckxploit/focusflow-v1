export interface FocusSuggestion {
    title: string;
    description: string;
    icon: string;
}

const suggestions: FocusSuggestion[] = [
    {
        title: "Deep Work Sprint",
        description: "Your focus is usually highest now. Try a 50-minute session.",
        icon: "target"
    },
    {
        title: "Quick Win",
        description: "Knock out a small task to build momentum.",
        icon: "zap"
    },
    {
        title: "Recovery Break",
        description: "Step away from the screen for 5 minutes. Stretch your eyes.",
        icon: "wind"
    },
    {
        title: "Review & Reflect",
        description: "Take 10 minutes to plan your next priority.",
        icon: "book-open"
    }
];

export const getDailySuggestion = (): FocusSuggestion => {
    const hour = new Date().getHours();

    if (hour < 12) return suggestions[0]; // Morning: Deep Work
    if (hour < 14) return suggestions[2]; // Mid-day: Break
    if (hour < 17) return suggestions[1]; // Afternoon: Momentum
    return suggestions[3]; // Evening: Review
};

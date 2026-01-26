"use server"

import { model } from "@/lib/gemini"

export async function chatWithConcierge(userMessage: string, tripContext: any) {
    try {
        if (!model) {
            return "I'm having trouble connecting to my brain right now. Please check the API key configuration."
        }

        // Construct a context-aware system prompt
        const systemPrompt = `
You are a high-end Travel Concierge for a user's trip to ${tripContext?.destination || "their destination"}.
Your goal is to be helpful, concise, and proactive. You have access to their itinerary.

CONTEXT:
- Destination: ${tripContext?.destination}
- Duration: ${tripContext?.duration}
- Budget: ${tripContext?.budget || "Not specified"}
- Travel Group: ${tripContext?.travelers || "Solo"}
- Itinerary Summary: ${JSON.stringify(tripContext?.itinerary || [])}

USER QUERY: ${userMessage}

INSTRUCTIONS:
- Keep answers short and conversational (networking chat style).
- If they ask for recommendations, give 2-3 specific, high-quality options compatible with their trip vibe.
- If they ask to re-plan, suggest a logical adjustment based on the itinerary.
- Be enthusiastic but professional.
`

        const result = await model.generateContent(systemPrompt)
        const response = result.response
        return response.text()
    } catch (error) {
        console.error("Concierge Error:", error)
        return "I'm sorry, I'm having a bit of trouble processing that right now. Could you ask again?"
    }
}

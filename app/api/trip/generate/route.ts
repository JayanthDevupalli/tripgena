import { NextResponse } from "next/server";
import { model, checkApiKey } from "@/lib/gemini";

export async function POST(req: Request) {
    try {
        if (!checkApiKey()) {
            return NextResponse.json(
                { error: "API Key missing. Please configure NEXT_PUBLIC_GEMINI_API_KEY." },
                { status: 500 }
            );
        }

        const { message, userProfile } = await req.json();

        const budget = userProfile?.preferences?.budget || 5000;
        const style = userProfile?.preferences?.style || "General";
        const interests = userProfile?.preferences?.interests?.join(", ") || "Everything";

        // System Prompt for Student-Centric output
        const prompt = `
      You are an expert AI Travel Agent for Indian Students. 
      Your goal is to plan a detailed, actionable trip itinerary based on the user's request.

      **User Context:**
      - Budget Limit: ₹${budget} (Strictly adhere to this. If impossible, suggest the closest alternative).
      - Vibe: ${style}
      - Interests: ${interests}
      - User Input: "${message}"

      **Response Format:**
      You must return STRICT JSON only. Do not add markdown backticks.
      The JSON structure must be:
      {
        "tripName": "Short catchy title (e.g., 'Goa on a Budget')",
        "destination": "City/Region",
        "duration": "e.g., '3 Days'",
        "totalCost": number (estimated total),
        "summary": "2-3 sentences exciting summary.",
        "highlights": ["highlight 1", "highlight 2", ...],
        "itinerary": [
            {
                "day": 1,
                "title": "Arrival & Exploration",
                "activities": [
                    { "time": "Morning", "activity": "...", "cost": number, "type": "Food/Travel/Activity" },
                    { "time": "Afternoon", "activity": "...", "cost": number, "type": "..." },
                    { "time": "Evening", "activity": "...", "cost": number, "type": "..." }
                ]
            }
        ],
        "travelTips": ["tip 1 (e.g. use student ID for discount)", "tip 2", ...]
      }

      **Rules:**
      1. Focus on *Hidden Gems* and *Street Food*. Avoid luxury hotels.
      2. Suggest *Hostels* or *Homestays*.
      3. Prices must be realistic for India in INR.
      4. If the user input is vague (e.g. "Plan a trip"), suggest a trending destination like Goa, Gokarna, or Manali based on their Vibe.
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up markdown if present (Gemini sometimes adds ```json ... ```)
        const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();

        return NextResponse.json(JSON.parse(cleanedText));

    } catch (error) {
        console.error("AI Generation Error:", error);
        return NextResponse.json(
            { error: "Failed to generate itinerary. Please try again." },
            { status: 500 }
        );
    }
}

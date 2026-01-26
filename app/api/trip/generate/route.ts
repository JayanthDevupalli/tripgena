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

        const { message, userProfile, origin, tripOptions } = await req.json();

        // Safe defaults
        const budget = tripOptions?.budget || userProfile?.preferences?.budget || 5000;
        const travelers = tripOptions?.travelers || 1;
        const startDate = tripOptions?.startDate || "Tomorrow";
        const transportMode = tripOptions?.transport || "Any";

        // Advanced Options
        const accommodation = tripOptions?.accommodation || "Any";
        const pace = tripOptions?.pace || "Balanced";
        const dietary = tripOptions?.dietary || "Any";

        const style = userProfile?.preferences?.style || "General";
        const interests = userProfile?.preferences?.interests?.join(", ") || "Everything";
        const userOrigin = origin || "India";

        // System Prompt for Student-Centric output with Geospatial Data
        const prompt = `
      You are an expert AI Travel Agent for Indian Students. 
      Your goal is to plan a detailed, actionable trip itinerary based on the new constraints.

      **User Input & Constraints:**
      - Origin: ${userOrigin}
      - Destination Request: "${message}"
      - Travel Date: Starting ${startDate}
      - Travelers: ${travelers} person(s)
      - Preferred Transport: ${transportMode} (STRICTLY ADHERE TO THIS. If "Car", do NOT suggest Train/Bus. If "Train", do NOT suggest Flight. If "Any", suggest best options).
      - Total Budget Limit: ₹${budget} (Strictly adhere to this for the WHOLE trip including travel for ${travelers} people).
      - Vibe: ${style}
      - Interests: ${interests}
      
      **Advanced Preferences:**
      - Accommodation Preference: ${accommodation} (e.g. if "Hostel", suggest Zostel/Backpacker hostels. If "Luxury", suggest Resorts).
      - Trip Pace: ${pace} (If "Relaxed", fewer activities, more chill time. If "Packed", maximize sightseeing).
      - Dietary Preference: ${dietary} (Ensure food suggestions align with this. If "Veg", do not suggest non-veg famous places unless they have good veg options).

      **Response Format:**
      You must return STRICT JSON only. Do not add markdown backticks.
      The JSON structure must be:
      {
        "tripName": "catchy title",
        "destination": "City/Region",
        "coordinates": { "lat": number, "lng": number },
        "duration": "e.g. '3 Days'",
        "totalCost": number (Total estimated cost for ALL travelers),
        "summary": "exciting summary...",
        
        // NEW: Transport Comparison (Provide at least 3 options if possible, centering on user preference)
        "transportOptions": [
            { 
                "mode": "Train", 
                "cost": number (Total for all travelers), 
                "duration": "e.g. 12h", 
                "details": "Specific Train Name & No. (e.g. Shatabdi 12009)", 
                "recommended": boolean 
            },
             { 
                "mode": "Bus", 
                "cost": number, 
                "duration": "string", 
                "details": "Specific Operator/Type (e.g. KSRTC Airavat Club Class)", 
                "recommended": boolean 
            },
            { 
                "mode": "Car", 
                "cost": number, 
                "duration": "string", 
                "details": "e.g. Zoomcar Rental / Private Taxi (Sedan)", 
                "recommended": boolean 
            }
        ],

        "highlights": ["highlight 1", "highlight 2", ...],
        "itinerary": [
            {
                "day": 1,
                "title": "Arrival & Exploration",
                "activities": [
                    { 
                        "time": "e.g. 09:00 AM", 
                        "activity": "...", 
                        "cost": number (Estimated cost per person), 
                        // STRICTLY use one of these types:
                        "type": "Travel" | "Stay" | "Food" | "Activity" | "Other",
                        "locationName": "Specific place name for map",
                        
                        // NEW: Logistics help (REQUIRED)
                        "logistics": "e.g. 'Take Auto from Station (₹50)', 'Walk 500m'",

                        "coordinates": { "lat": number, "lng": number } 
                    },
                    ...
                ]
            }
        ],
        "travelTips": ["tip 1", "tip 2", ...]
      }

      **Rules:**
      1. **REALISTIC STUDENT BUDGET**: Be stingy. Use Sleeper mechanics unless budget is high. Cost comparisons MUST be accurate for ${travelers} people.
      2. **NO HOTELS FOR DAY TRIPS**: If duration is 1 day, Stay cost must be 0.
      3. **Transport Logic - CRITICAL**:
         - **DIRECT CONNECTIVITY CHECK**: You MUST first check for direct trains/buses from **${userOrigin}** to Destination.
         - **DO NOT** suggest routing through a major hub (like Hyderabad/Secunderabad/Delhi) IF a direct option exists from ${userOrigin}.
         - If a train/bus stops at ${userOrigin}, THAT is the correct option.
         - Only suggest a hub if ${userOrigin} has NO direct connectivity.
         - **Accuracy Enforcement**:
           - **STATION CODES**: You MUST provide the specific Station Codes for the suggested train (e.g. "Kacheguda (KCG)", "Shadnagar (SHNR)").
           - **STOP VALIDATION**: Explicitly VERIFY if the suggested train has a *commercial halt* at **${userOrigin}**.
           - If a train does passes through but does not stop, DO NOT suggest it as a direct option.
           - If unsure about a stop, clearly state: "Boarding at [Nearest Major Station] recommended as direct trains may not stop at ${userOrigin}".
      4. **Coordinates**: GPS accuracy is critical.
      5. **Accuracy**: Do not hallucinate cheap flights. Be realistic.
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

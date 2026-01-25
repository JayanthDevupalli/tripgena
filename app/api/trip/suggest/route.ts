import { NextResponse } from "next/server";
import { model, checkApiKey } from "@/lib/gemini";

export async function POST(req: Request) {
    try {
        if (!checkApiKey()) {
            return NextResponse.json(
                { error: "API Key missing." },
                { status: 500 }
            );
        }

        const { origin, style, distance, budget } = await req.json();

        if (!origin) {
            return NextResponse.json({ error: "Origin is required" }, { status: 400 });
        }

        // Logic Mapping
        let distConstraint = "approx 100-200km radius";
        let timeConstraint = "within 3-5 hours";
        if (distance === "Short") {
            distConstraint = "VERY CLOSE (<50km radius)";
            timeConstraint = "within 1-2 hours";
        } else if (distance === "Long") {
            distConstraint = "within 300-600km radius";
            timeConstraint = "overnight journey allowed";
        }

        let budgetLimit = "₹5000";
        if (budget === "Mid") budgetLimit = "₹10,000";
        if (budget === "High") budgetLimit = "₹20,000+";

        const prompt = `
      You are a travel expert for Indian Students.
      Suggest 12 specific "Hidden Gem" / "Weekend Getaway" destinations near "${origin}" that fit the vibe "${style || 'Adventure'}".
      
      **User Preferences:**
      - Distance: ${distance} (${distConstraint})
      - Budget Level: ${budget} (Target: < ${budgetLimit})

      Rules:
      1. **Distance Strictness**: Destinations MUST be ${timeConstraint} from ${origin}.
      2. **Budget Strictness**: Keep costs around ${budgetLimit}.
      3. **Visuals**: Provide a specific "image_keyword" for Unsplash search.
      4. **Return STRICT JSON array**.

      Format:
      [
        {
          "name": "Destination Name",
          "budget": "${budgetLimit}",
          "vibe": "Nature",
          "desc": "Short description.",
          "category": "Hill Station",
          "image_keyword": "Specific search term"
        }
      ]
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        // Cleanup Markdown
        text = text.replace(/```json/g, "").replace(/```/g, "");

        // robust extraction
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
            text = jsonMatch[0];
        }

        return NextResponse.json(JSON.parse(text));

    } catch (error) {
        console.error("AI Suggestion Error:", error);
        return NextResponse.json(
            { error: "Failed to generate suggestions." },
            { status: 500 }
        );
    }
}

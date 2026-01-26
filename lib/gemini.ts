import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.PUBLIC_GEMINI_API_KEY || "";

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(apiKey);

// Get the generative model (flash is 
// faster/cheaper for this use case)
export const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export const checkApiKey = () => {
    if (!apiKey) {
        console.error("Gemini API Key is missing. Please set NEXT_PUBLIC_GEMINI_API_KEY in .env.local");
        return false;
    }
    return true;
};

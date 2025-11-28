import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
    try {
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ error: 'No API key configured' });
        }

        const genAI = new GoogleGenerativeAI(apiKey);

        // Try to list models
        const models = await genAI.listModels();

        return res.status(200).json({
            success: true,
            models: models,
            apiKeyPrefix: apiKey.substring(0, 10) + '...'
        });

    } catch (error) {
        return res.status(500).json({
            error: error.message,
            details: error.toString()
        });
    }
}

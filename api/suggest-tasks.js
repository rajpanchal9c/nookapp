import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { content } = req.body;

        // Validate input
        if (!content || content.trim().length === 0) {
            return res.status(400).json({ error: 'Journal content is required' });
        }

        // Check for API key
        if (!process.env.GEMINI_API_KEY) {
            console.error('GEMINI_API_KEY not configured');
            return res.status(500).json({ error: 'AI service not configured' });
        }

        // Initialize Gemini
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig: {
                temperature: 0.3, // Lower temperature for more focused output
                maxOutputTokens: 500,
            }
        });

        // Create the prompt
        const prompt = `You are a helpful assistant that extracts actionable tasks from journal entries.

Analyze this journal entry and extract clear, actionable tasks. Follow these rules:
1. Only extract tasks that are explicitly mentioned or strongly implied
2. Keep tasks concise (under 10 words each)
3. Use action verbs (e.g., "Email", "Finish", "Call", "Review")
4. Return ONLY a valid JSON array of task strings
5. If no tasks are found, return an empty array: []
6. Do not include explanations or markdown formatting

Journal entry:
${content}

Tasks (JSON array only):`;

        // Call Gemini API
        const result = await model.generateContent(prompt);
        const responseText = result.response.text().trim();

        // Parse the JSON response
        let tasks;
        try {
            // Remove markdown code blocks if present
            const cleanedResponse = responseText
                .replace(/```json\n?/g, '')
                .replace(/```\n?/g, '')
                .trim();

            tasks = JSON.parse(cleanedResponse);

            // Validate it's an array
            if (!Array.isArray(tasks)) {
                throw new Error('Response is not an array');
            }

            // Filter out empty strings and limit to 10 tasks
            tasks = tasks
                .filter(task => typeof task === 'string' && task.trim().length > 0)
                .slice(0, 10);

        } catch (parseError) {
            console.error('Failed to parse AI response:', responseText);
            return res.status(500).json({
                error: 'Failed to parse AI response',
                tasks: []
            });
        }

        // Return the tasks
        return res.status(200).json({ tasks });

    } catch (error) {
        console.error('Error in suggest-tasks API:', error);
        return res.status(500).json({
            error: 'Failed to generate task suggestions',
            message: error.message
        });
    }
}

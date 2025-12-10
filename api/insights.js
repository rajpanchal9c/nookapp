export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { entryText, mood } = req.body;

        // Validate input
        if (!entryText || entryText.trim().length === 0) {
            return res.status(200).json({
                reflection: "It seems like you haven't written much yet. Take your time—there's no rush. Sometimes the hardest part is just getting started.",
                tasks: []
            });
        }

        // Get API key from environment variable
        const apiKey = process.env.GROQ_API_KEY;

        // Check for API key
        if (!apiKey) {
            console.error('GROQ_API_KEY not configured');
            return res.status(500).json({ error: 'AI service not configured' });
        }

        // Create the prompt with empathetic tone
        const moodContext = mood ? `\n\nThe person's mood today: ${mood}` : '';
        const prompt = `You are Nook, a gentle companion for journaling. Your role is to provide empathetic reflections and identify actionable tasks.

Analyze the following journal entry and provide:
1. A brief reflection (2-4 sentences) that is warm, validating, and hopeful
2. A list of 0-5 actionable tasks mentioned or implied in the entry

REFLECTION TONE RULES:
- Be brief and conversational, like a thoughtful friend
- Acknowledge emotions and themes without diagnosing
- Use phrases like "It sounds like...", "You might be feeling...", "You could consider..."
- Avoid imperatives like "You must" or "You should"
- Highlight small wins or strengths when visible
- Keep it hopeful and grounded
- Never mention that you are AI or an assistant

TASK EXTRACTION RULES:
- Only extract clear, concrete action items
- Look for explicit or implied actions: email, call, book, clean, organize, study, review, finish, start, buy, prepare, research
- Ignore vague wishes or jokes
- Keep each task under 100 characters
- Make tasks actionable in one session
- Avoid sensitive emotional content in tasks
- If no clear tasks exist, return empty array

Return ONLY valid JSON in this exact format:
{
  "reflection": "your empathetic reflection here",
  "tasks": ["task 1", "task 2"]
}${moodContext}

Journal entry:
${entryText}`;

        // Call Groq API using fetch
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                model: 'llama-3.1-8b-instant',
                temperature: 0.5,
                max_tokens: 800,
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Groq API error:', errorText);
            return res.status(500).json({
                error: 'AI service error',
                message: `API returned ${response.status}`
            });
        }

        const data = await response.json();
        const responseText = data.choices?.[0]?.message?.content?.trim();

        if (!responseText) {
            return res.status(500).json({
                error: 'No response from AI',
                reflection: "I'm having trouble reflecting on your entry right now. Please try again in a moment.",
                tasks: []
            });
        }

        // Parse the JSON response
        let insights;
        try {
            // Remove markdown code blocks if present
            const cleanedResponse = responseText
                .replace(/```json\n?/g, '')
                .replace(/```\n?/g, '')
                .trim();

            insights = JSON.parse(cleanedResponse);

            // Validate structure
            if (!insights.reflection || typeof insights.reflection !== 'string') {
                throw new Error('Missing or invalid reflection');
            }

            if (!Array.isArray(insights.tasks)) {
                insights.tasks = [];
            }

            // Filter and limit tasks
            insights.tasks = insights.tasks
                .filter(task => typeof task === 'string' && task.trim().length > 0)
                .slice(0, 5);

        } catch (parseError) {
            console.error('Failed to parse AI response:', responseText);
            return res.status(500).json({
                error: 'Failed to parse AI response',
                reflection: "I'm having trouble processing your entry right now. Please try again.",
                tasks: []
            });
        }

        // Return the insights
        return res.status(200).json(insights);

    } catch (error) {
        console.error('Error in insights API:', error);
        return res.status(500).json({
            error: 'Failed to generate insights',
            message: error.message,
            reflection: "Something went wrong while reflecting on your entry. Please try again later.",
            tasks: []
        });
    }
}

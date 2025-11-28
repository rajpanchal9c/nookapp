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

        // Get API key from environment variable
        const apiKey = process.env.GROQ_API_KEY;

        // Check for API key
        if (!apiKey) {
            console.error('GROQ_API_KEY not configured');
            return res.status(500).json({ error: 'AI service not configured' });
        }

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
                temperature: 0.3,
                max_tokens: 500,
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
                tasks: []
            });
        }

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

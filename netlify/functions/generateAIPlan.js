const { Configuration, OpenAIApi } = require("openai");

exports.handler = async (event) => {
    // Enable CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
    };

    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: '',
        };
    }

    // Only allow POST method
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' }),
        };
    }

    try {
        const { prompt, maxTokens = 1200, temperature = 0.8 } = JSON.parse(event.body || '{}');

        if (!prompt) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Prompt is required' }),
            };
        }

        // Check if API key is configured
        if (!process.env.OPENAI_API_KEY) {
            console.error('OpenAI API key not configured');
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: 'AI service not configured' }),
            };
        }

        const configuration = new Configuration({
            apiKey: process.env.OPENAI_API_KEY,
        });
        const openai = new OpenAIApi(configuration);

        const enhancedPrompt = `
Create a comprehensive, engaging preschool lesson plan for: ${prompt}

Requirements:
- Target age: 2-5 years (preschool)
- Duration: 30-45 minutes
- Clear learning objectives aligned with early childhood development
- Detailed materials list with alternatives
- Step-by-step procedure with timing
- Differentiation strategies for various learning styles
- Extension activities for advanced learners
- Assessment methods and observation checklist
- Safety considerations
- Clean-up procedures

Format the response with clear headings and bullet points for easy reading by educators.
`;

        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: enhancedPrompt,
            temperature: Math.min(Math.max(temperature, 0), 1), // Clamp between 0 and 1
            max_tokens: Math.min(Math.max(maxTokens, 100), 2000), // Clamp between 100 and 2000
            top_p: 1,
            frequency_penalty: 0.1,
            presence_penalty: 0.1,
        });

        const generatedPlan = response.data.choices[0]?.text?.trim();

        if (!generatedPlan) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: 'Failed to generate lesson plan' }),
            };
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
                plan: generatedPlan,
                usage: response.data.usage,
                timestamp: new Date().toISOString()
            }),
        };

    } catch (error) {
        console.error('Error generating AI plan:', error);
        
        // Return appropriate error based on error type
        if (error.response?.status === 429) {
            return {
                statusCode: 429,
                headers,
                body: JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
            };
        } else if (error.response?.status === 401) {
            return {
                statusCode: 401,
                headers,
                body: JSON.stringify({ error: 'API authentication failed' }),
            };
        } else {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: 'Failed to generate lesson plan' }),
            };
        }
    }
};
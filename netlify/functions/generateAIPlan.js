const { OpenAI } = require("openai");

exports.handler = async (event) => {
    try {
        const { prompt } = JSON.parse(event.body || '{}');

        if (!prompt) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Prompt is required" }),
            };
        }

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are an expert early childhood educator who creates detailed, engaging, and developmentally appropriate lesson plans for preschool children."
                },
                {
                    role: "user",
                    content: `Create a highly detailed preschool lesson plan for: ${prompt}.

Please include:
- Clear learning objectives aligned with early childhood development standards
- A comprehensive list of materials needed
- Step-by-step procedure with timing estimates
- Teaching strategies and open-ended questions for each step
- Ideas for extending the activity or modifying for different skill levels
- A developmental checklist with observable skills (social, cognitive, language, fine/gross motor)
- Tips for adapting the lesson for different learning styles

Format the response in a clear, easy-to-follow structure that busy teachers can quickly implement.`
                }
            ],
            temperature: 0.8,
            max_tokens: 1500,
        });

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "POST, OPTIONS"
            },
            body: JSON.stringify({ plan: response.choices[0].message.content }),
        };
    } catch (error) {
        console.error('Error generating lesson plan:', error);
        
        return {
            statusCode: 500,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({ 
                error: "Failed to generate lesson plan. Please try again later." 
            }),
        };
    }
};
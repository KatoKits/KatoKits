const { OpenAI } = require("openai");

exports.handler = async (event, context) => {
    try {
        // Parse request body
        const { age, theme, skill, duration, goal, setting } = JSON.parse(event.body || '{}');

        // Validate required environment variable
        if (!process.env.OPENAI_API_KEY) {
            return {
                statusCode: 500,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ 
                    error: "OpenAI API key not configured" 
                }),
            };
        }

        // Initialize OpenAI client
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        // Create detailed prompt
        const prompt = `Create a highly detailed preschool lesson plan with the following specifications:
- Age Group: ${age}
- Theme/Topic: ${theme}
- Primary Skill Focus: ${skill}
- Duration: ${duration} minutes
- Learning Goal: ${goal || 'Age-appropriate development'}
- Setting: ${setting || 'Classroom'}

Please include:
1. Clear learning objectives (3-4 specific, measurable goals)
2. Complete materials list with alternatives
3. Step-by-step procedure with timing
4. Teaching strategies and engagement techniques
5. Open-ended questions for each activity
6. Extension activities for early finishers
7. Adaptations for different learning styles
8. Developmental checklist with observable skills (social, cognitive, language, fine/gross motor)
9. Assessment criteria and observation notes

Make the plan professional, easy to follow, and developmentally appropriate.`;

        // Generate lesson plan using modern OpenAI API
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are an expert early childhood educator with 20+ years of experience creating engaging, developmentally-appropriate lesson plans for children aged 6 months to 6 years."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            max_tokens: 2000,
            temperature: 0.7,
        });

        const plan = response.choices[0].message.content;

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
            },
            body: JSON.stringify({ 
                plan,
                metadata: {
                    age,
                    theme,
                    skill,
                    duration,
                    goal,
                    setting,
                    generatedAt: new Date().toISOString()
                }
            }),
        };

    } catch (error) {
        console.error('Error generating lesson plan:', error);
        
        return {
            statusCode: 500,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({ 
                error: "Failed to generate lesson plan",
                message: error.message 
            }),
        };
    }
};
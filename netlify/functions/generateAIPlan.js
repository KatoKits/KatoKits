const { Configuration, OpenAIApi } = require("openai");

exports.handler = async (event) => {
    const { prompt } = JSON.parse(event.body || '{}');

    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `
Create a highly detailed preschool lesson plan for: ${prompt}.
- Include clear objectives, a list of materials, and a step-by-step procedure.
- For each step, provide in-depth teaching strategies, open-ended questions, and prompts to encourage ongoing engagement and critical thinking.
- Suggest ways to extend the activity if children lose interest or finish early.
- Include a developmental checklist with specific observable skills (social, cognitive, language, fine/gross motor).
- Make the plan easy for teachers to follow and adaptable for different learning styles.
`,
        temperature: 0.8,
        max_tokens: 1200,
    });

    return {
        statusCode: 200,
        body: JSON.stringify({ plan: response.data.choices[0].text }),
    };
};
const { Configuration, OpenAIApi } = require('openai');

exports.handler = async (event) => {
  const { prompt } = JSON.parse(event.body || '{}');

  const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
  const openai = new OpenAIApi(configuration);

  const messages = [
    {
      role: 'system',
      content: 'You are an expert early childhood educator generating detailed lesson plans.'
    },
    {
      role: 'user',
      content: `Generate a full early childhood lesson plan for ${prompt}. Include objectives, materials, setup instructions, step-by-step guide, discussion questions, extension activities, a developmental checklist, and parent handout. Return the result in markdown format.`
    }
  ];

  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages,
    temperature: 0.7,
    max_tokens: 1000
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ plan: response.data.choices[0].message.content })
  };
};

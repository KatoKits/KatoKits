# Environment Variables Setup for KatoKits

This document explains how to set up and configure the required environment variables for the KatoKits application.

## Required Environment Variables

### 1. OpenAI API Configuration
```bash
OPENAI_API_KEY=sk-your-openai-api-key-here
```
- **Purpose**: Powers the AI lesson plan generation feature
- **How to get**: Sign up at [OpenAI Platform](https://platform.openai.com/api-keys)
- **Usage**: Used in `/.netlify/functions/generateAIPlan.js`

### 2. Supabase Configuration
```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```
- **Purpose**: Database operations for storing and retrieving lesson plans
- **How to get**: 
  1. Create a project at [Supabase](https://supabase.com)
  2. Go to Settings > API in your project dashboard
  3. Copy the Project URL and anon/public key
- **Usage**: Used in `/.netlify/functions/lessonPlans.js` and `/.netlify/functions/supabase-client.js`

## Setup Instructions

### For Local Development:
1. Copy `.env.example` to `.env`
2. Fill in your actual API keys and URLs
3. The `.env` file is automatically ignored by git for security

### For Netlify Deployment:
1. Go to your Netlify site dashboard
2. Navigate to Site settings > Environment variables
3. Add each environment variable individually:
   - `OPENAI_API_KEY`
   - `SUPABASE_URL` 
   - `SUPABASE_ANON_KEY`

## Database Schema (Supabase)

If using the Supabase integration, create the following table:

```sql
CREATE TABLE lesson_plans (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  age_group TEXT,
  theme TEXT,
  skill_focus TEXT,
  duration_minutes INTEGER,
  learning_goal TEXT,
  setting TEXT,
  generated_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Optional: Enable Row Level Security
ALTER TABLE lesson_plans ENABLE ROW LEVEL SECURITY;

-- Optional: Add policy for public read access
CREATE POLICY "Allow public read access" ON lesson_plans
  FOR SELECT USING (true);

-- Optional: Add policy for insert access  
CREATE POLICY "Allow public insert" ON lesson_plans
  FOR INSERT WITH CHECK (true);
```

## API Endpoints

### Generate AI Lesson Plan
- **Endpoint**: `/.netlify/functions/generateAIPlan`
- **Method**: POST
- **Body**: 
```json
{
  "age": "preschool",
  "theme": "Ocean Animals", 
  "skill": "cognitive",
  "duration": "30",
  "goal": "Identify 5 ocean animals",
  "setting": "classroom"
}
```

### Lesson Plans CRUD
- **Endpoint**: `/.netlify/functions/lessonPlans`
- **Methods**: GET (fetch), POST (save)
- **Example Response**:
```json
{
  "lesson_plans": [...],
  "total": 10
}
```

## Security Best Practices

1. **Never commit** environment variables to version control
2. **Use different keys** for development and production
3. **Regularly rotate** API keys
4. **Monitor usage** through your provider dashboards
5. **Set up billing alerts** to avoid unexpected charges

## Troubleshooting

### OpenAI API Issues:
- Check API key format (starts with `sk-`)
- Verify you have credits/billing set up
- Check rate limits in OpenAI dashboard

### Supabase Issues:
- Verify Project URL format (`https://xxx.supabase.co`)
- Check that anon key has correct permissions
- Ensure database tables exist with correct schema

### Netlify Function Issues:
- Check function logs in Netlify dashboard
- Verify environment variables are set correctly
- Test functions locally with `netlify dev`

## Example Implementation

See the live implementation at:
- AI Generator: `/ai.html`
- Backend Functions: `/netlify/functions/`
- Frontend JavaScript: Embedded in `ai.html`
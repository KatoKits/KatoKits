const { createSupabaseClient } = require('./supabase-client');

exports.handler = async (event, context) => {
    try {
        // Initialize Supabase client
        const supabase = createSupabaseClient();

        // Get request method
        const method = event.httpMethod;

        if (method === 'GET') {
            // Example: Fetch lesson plans from Supabase
            const { data: lessonPlans, error } = await supabase
                .from('lesson_plans')
                .select('*')
                .limit(10)
                .order('created_at', { ascending: false });

            if (error) {
                throw error;
            }

            return {
                statusCode: 200,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "Content-Type",
                    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                },
                body: JSON.stringify({ 
                    lesson_plans: lessonPlans,
                    total: lessonPlans.length
                }),
            };

        } else if (method === 'POST') {
            // Example: Save a generated lesson plan to Supabase
            const { plan, metadata } = JSON.parse(event.body || '{}');

            if (!plan || !metadata) {
                return {
                    statusCode: 400,
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                    body: JSON.stringify({ 
                        error: "Missing required fields: plan and metadata" 
                    }),
                };
            }

            // Insert lesson plan into Supabase
            const { data, error } = await supabase
                .from('lesson_plans')
                .insert([
                    {
                        title: `${metadata.theme} - ${metadata.age}`,
                        content: plan,
                        age_group: metadata.age,
                        theme: metadata.theme,
                        skill_focus: metadata.skill,
                        duration_minutes: parseInt(metadata.duration) || 30,
                        learning_goal: metadata.goal || null,
                        setting: metadata.setting || 'classroom',
                        generated_at: metadata.generatedAt,
                        created_at: new Date().toISOString()
                    }
                ])
                .select();

            if (error) {
                throw error;
            }

            return {
                statusCode: 201,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({ 
                    message: "Lesson plan saved successfully",
                    id: data[0].id,
                    lesson_plan: data[0]
                }),
            };

        } else if (method === 'OPTIONS') {
            // Handle preflight requests
            return {
                statusCode: 200,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "Content-Type",
                    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                },
                body: '',
            };
        }

        return {
            statusCode: 405,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({ error: "Method not allowed" }),
        };

    } catch (error) {
        console.error('Error in lesson plans function:', error);
        
        return {
            statusCode: 500,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({ 
                error: "Internal server error",
                message: error.message 
            }),
        };
    }
};
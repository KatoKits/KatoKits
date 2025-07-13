const { createSupabaseClient } = require('./supabase-client');

exports.handler = async (event, context) => {
    try {
        // Initialize Supabase client
        const supabase = createSupabaseClient();

        if (event.httpMethod === 'GET') {
            // Example: Fetch user favorites or saved lesson plans
            const { data: favorites, error } = await supabase
                .from('user_favorites')
                .select(`
                    id,
                    lesson_plan_id,
                    created_at,
                    lesson_plans (
                        title,
                        theme,
                        age_group
                    )
                `)
                .limit(20)
                .order('created_at', { ascending: false });

            if (error && error.code !== '42P01') { // Ignore table doesn't exist error
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
                    favorites: favorites || [],
                    total: favorites?.length || 0,
                    message: !favorites ? "No favorites table found - this is optional" : "Success"
                }),
            };

        } else if (event.httpMethod === 'POST') {
            // Example: Add lesson plan to user favorites
            const { lesson_plan_id, user_id } = JSON.parse(event.body || '{}');

            if (!lesson_plan_id) {
                return {
                    statusCode: 400,
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                    body: JSON.stringify({ 
                        error: "Missing lesson_plan_id" 
                    }),
                };
            }

            // Insert favorite
            const { data, error } = await supabase
                .from('user_favorites')
                .insert([
                    {
                        lesson_plan_id,
                        user_id: user_id || 'anonymous',
                        created_at: new Date().toISOString()
                    }
                ])
                .select();

            if (error && error.code !== '42P01') { // Ignore table doesn't exist error
                throw error;
            }

            return {
                statusCode: 201,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({ 
                    message: "Added to favorites successfully",
                    favorite: data?.[0] || null,
                    note: !data ? "Favorites table not found - this is optional functionality" : null
                }),
            };

        } else if (event.httpMethod === 'OPTIONS') {
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
        console.error('Error in user data function:', error);
        
        return {
            statusCode: 500,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({ 
                error: "Internal server error",
                message: error.message,
                note: "This is an example function - database setup is optional"
            }),
        };
    }
};
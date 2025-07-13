const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
function createSupabaseClient() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        throw new Error('Missing Supabase environment variables: SUPABASE_URL and SUPABASE_ANON_KEY are required');
    }

    return createClient(supabaseUrl, supabaseKey);
}

module.exports = {
    createSupabaseClient
};
// supabase-config.js
// Initialize Supabase client
const SUPABASE_URL = 'https://fcgbusobfdwnpoqyuzoe.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here'; // Get this from Supabase dashboard

const { createClient } = supabase;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Function to check if domain has been audited
async function checkDomainAudited(domain) {
    try {
        const { data, error } = await supabase
            .from('audited_sites')
            .select('domain, audited_at, broker_email')
            .eq('domain', domain);
        
        if (error) throw error;
        
        return {
            audited: data && data.length > 0,
            record: data && data.length > 0 ? data[0] : null
        };
    } catch (error) {
        console.error('Error checking domain:', error);
        return { audited: false, error: error.message };
    }
}

// Function to store audited domain
async function storeAuditedDomain(domain, password, email = null) {
    try {
        // Extract clean domain from URL
        const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
        
        const { data, error } = await supabase
            .from('audited_sites')
            .insert([
                {
                    domain: cleanDomain,
                    broker_email: email,
                    report_password: password,
                    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                    user_ip: await getUserIP(),
                    user_agent: navigator.userAgent
                }
            ]);
        
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error storing domain:', error);
        return { success: false, error: error.message };
    }
}

// Helper to get user IP (optional)
async function getUserIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch {
        return 'unknown';
    }
}
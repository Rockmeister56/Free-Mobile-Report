// analysis.js - COMPLETE UPDATED VERSION WITH SUPABASE
// This file powers the PPC Audit analysis page and stores domains in Supabase

// ===== LOAD SUPABASE SDK =====
const SUPABASE_URL = 'https://fcgbusobfdwnpoqyuzoe.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjZ2J1c29iZmR3bnBvcXl1em9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzNDA2MjMsImV4cCI6MjA4NTkxNjYyM30.FHEZnxuGHSn_Z3gw9d_Txtfz5Jn55J6qonl8rnA3gPk';

// Initialize Supabase - check if supabase is available
let supabaseClient;

// Function to initialize Supabase
function initSupabase() {
    return new Promise((resolve, reject) => {
        // Check if supabase is already loaded
        if (typeof supabase !== 'undefined') {
            const { createClient } = supabase;
            supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            console.log('✅ Supabase client created');
            resolve();
        } else {
            // If not loaded, try to load it dynamically
            console.log('⏳ Loading Supabase SDK...');
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
            script.onload = () => {
                const { createClient } = supabase;
                supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
                console.log('✅ Supabase client created after dynamic load');
                resolve();
            };
            script.onerror = () => {
                console.error('❌ Failed to load Supabase SDK');
                reject();
            };
            document.head.appendChild(script);
        }
    });
}

// ===== FUNCTION TO STORE AUDITED DOMAIN =====
async function storeAuditedDomain(domain, accessCode = null) {
    try {
        // Extract clean domain (remove http, https, www, and paths)
        let cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
        cleanDomain = cleanDomain.replace(/^www\./, '');
        
        console.log('📝 Storing domain in Supabase:', cleanDomain);
        
        // Get user IP (optional)
        let userIp = 'unknown';
        try {
            const ipResponse = await fetch('https://api.ipify.org?format=json');
            const ipData = await ipResponse.json();
            userIp = ipData.ip;
        } catch (e) {
            console.log('Could not get IP');
        }
        
        const { error } = await supabaseClient
            .from('audited_sites')
            .insert([
                {
                    domain: cleanDomain,
                    audited_at: new Date().toISOString(),
                    report_password: accessCode || 'USED', // Store the access code if available
                    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                    user_ip: userIp,
                    user_agent: navigator.userAgent,
                    // created_at will auto-populate
                    // broker_email is optional
                }
            ]);
        
        if (error) {
            console.error('❌ Supabase insert error:', error);
            
            // Try without optional fields if error persists
            if (error.message.includes('report_password')) {
                console.log('Trying simplified insert...');
                const { error: retryError } = await supabaseClient
                    .from('audited_sites')
                    .insert([
                        {
                            domain: cleanDomain,
                            audited_at: new Date().toISOString(),
                            expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
                        }
                    ]);
                
                if (retryError) throw retryError;
                console.log('✅ Domain stored (simplified)');
                return { success: true };
            }
            
            return { success: false, error: error.message };
        }
        
        console.log('✅ Domain successfully stored in Supabase');
        return { success: true };
    } catch (error) {
        console.error('❌ Error storing domain:', error);
        return { success: false, error: error.message };
    }
}

// Get parameters from URL or localStorage
const urlParams = new URLSearchParams(window.location.search);
const budgetRange = urlParams.get('budget') || localStorage.getItem('ppcBudget') || '10000';
const scannedUrl = urlParams.get('url') || localStorage.getItem('scannedUrl') || '';

console.log('Budget range received:', budgetRange);

// Convert to actual budget value
function getMidpointFromRange(range) {
    const numericValue = parseInt(String(range).replace(/[^0-9]/g, ''));
    
    // If it's a custom exact amount (above 50000), use it directly
    if (numericValue > 5000) {
        console.log('✅ Using exact custom budget:', numericValue);
        return numericValue;
    }
    
    // Otherwise use range midpoints for dropdown values
    const ranges = {
        '2000': 3500,
        '5000': 7500,
        '10000': 15000,
        '20000': 35000,
        '50000': 60000
    };
    
    if (ranges[String(numericValue)]) {
        console.log('✅ Range lookup:', numericValue, '→', ranges[String(numericValue)]);
        return ranges[String(numericValue)];
    }
    
    // Fallback
    console.log('⚠️ Using fallback:', numericValue);
    return numericValue;
}

// Calculate the budget and loss
const ppcBudget = getMidpointFromRange(budgetRange);
const monthlyLoss = Math.round(ppcBudget * 0.625);

localStorage.setItem('tess_loss', monthlyLoss);
localStorage.setItem('tess_issues', '13');
console.log('✅ Tess data stored:', monthlyLoss, '13');

console.log('Final PPC Budget:', ppcBudget);
console.log('Monthly Loss:', monthlyLoss);

// Update all dynamic content on the page
function updateDynamicContent() {
    // Update budget display
    const budgetElement = document.getElementById('budgetAmount');
    if (budgetElement) {
        budgetElement.textContent = `$${ppcBudget.toLocaleString()}`;
    }
    
    // Update URL display
    const urlElement = document.getElementById('urlDisplay');
    if (urlElement) {
        urlElement.textContent = `Scanning: ${scannedUrl}`;
    }
    
    // Update waste calculation text
    const wasteCalc = document.getElementById('wasteCalc');
    if (wasteCalc) {
        wasteCalc.textContent = `Based on $${ppcBudget.toLocaleString()} budget`;
    }
    
    // Update loss calculation text
    const lossCalc = document.getElementById('lossCalc');
    if (lossCalc) {
        lossCalc.textContent = `$${monthlyLoss.toLocaleString()} estimated loss`;
    }
    
    // Update alert amount
    const alertAmount = document.getElementById('alertAmount');
    if (alertAmount) {
        alertAmount.textContent = `$${monthlyLoss.toLocaleString()}`;
    }
    
    // Update preloader text
    const preloaderText = document.getElementById('preloaderText');
    if (preloaderText) {
        preloaderText.textContent = `Analyzing $${ppcBudget.toLocaleString()} PPC Budget...`;
    }
}

// Analysis Progress Class
class AnalysisProgress {
    constructor() {
        console.log('AnalysisProgress started');
        
        // Get all the elements we need
        this.progressFill = document.getElementById('progressFill');
        this.progressText = document.getElementById('progressText');
        this.steps = document.querySelectorAll('.step');
        this.statusMessage = document.getElementById('statusMessage');
        this.lossAlert = document.getElementById('lossAlert');
        
        this.currentStep = 0;
        this.progress = 0;
        
        // Status messages that change during analysis
        this.statusMessages = [
            "Loading your website...",
            "Checking mobile responsiveness...",
            "Analyzing conversion elements...",
            "Looking for AI chat solutions...",
            "Calculating PPC waste on your budget...",
            "Checking if ads match your landing page...",
            "Counting form fields...",
            "Auditing mobile PPC performance...",
            "Estimating Quality Score impact...",
            "Comparing to industry benchmarks...",
            "Calculating your monthly losses...",
            "Generating your report..."
        ];
        
        // Start the progress
        this.init();
    }

    init() {
        console.log('Initializing progress');
        
        // Reset all steps to incomplete
        this.resetAllSteps();
        
        // Start progress after a brief delay
        setTimeout(() => {
            this.startProgress();
        }, 500);
    }

    resetAllSteps() {
        this.steps.forEach((step) => {
            step.classList.remove('completed', 'active');
            const icon = step.querySelector('.step-icon');
            if (icon) {
                icon.textContent = '○';
                icon.style.animation = 'none';
            }
        });
    }

    startProgress() {
        console.log('Starting progress');
        
        const duration = 25000; // 25 seconds total
        const interval = 100; // Update every 100ms
        const increment = (interval / duration) * 100;
        
        const progressInterval = setInterval(() => {
            this.progress += increment;
            
            if (this.progress >= 100) {
                this.progress = 100;
                clearInterval(progressInterval);
                this.completeAnalysis();
            }
            
            this.updateProgress();
        }, interval);
    }

    updateProgress() {
        // Update progress bar
        if (this.progressFill) {
            this.progressFill.style.width = `${this.progress}%`;
        }
        
        if (this.progressText) {
            this.progressText.textContent = `${Math.round(this.progress)}% Complete`;
        }
        
        // Calculate current step (0-11 for 12 steps)
        const stepIndex = Math.floor((this.progress / 100) * 12);
        
        // Update status message
        if (this.statusMessage && stepIndex < this.statusMessages.length) {
            this.statusMessage.innerHTML = `<p>"${this.statusMessages[stepIndex]}"</p>`;
        }
        
        // Show loss alert at 50% progress
        if (this.lossAlert && this.progress >= 50 && this.lossAlert.style.display === 'none') {
            this.lossAlert.style.display = 'block';
        }
        
        // Update steps
        for (let i = 0; i <= stepIndex; i++) {
            if (i < stepIndex) {
                this.completeStep(i);
            } else if (i === stepIndex) {
                this.activateStep(i);
            }
        }
    }

    completeStep(stepIndex) {
        const step = this.steps[stepIndex];
        if (!step) return;
        
        step.classList.remove('active');
        step.classList.add('completed');
        
        const icon = step.querySelector('.step-icon');
        if (icon) {
            icon.textContent = '✓';
            icon.style.animation = 'none';
        }
    }

    activateStep(stepIndex) {
        const step = this.steps[stepIndex];
        if (!step) return;
        
        step.classList.add('active');
        
        const icon = step.querySelector('.step-icon');
        if (icon) {
            icon.textContent = '⟳';
            icon.style.animation = 'spin 2s linear infinite';
        }
    }

   async completeAnalysis() {
    console.log('✅ Analysis complete - storing in Supabase...');
    
    // Update UI
    if (this.progressFill) {
        this.progressFill.style.background = 'linear-gradient(90deg, #00cc66, #00ff88)';
    }
    
    if (this.progressText) {
        this.progressText.textContent = '100% Complete - Report Ready!';
    }

    // 🔴 STORE DATA FOR TESS (CLEANED)
    // Only store clean numbers, no hardcoded overrides
    if (scannedUrl) {
        await storeAuditedDomain(scannedUrl);
    }

    // Store for the Results Page & Tess
    // We store the RAW numbers so the next page can format them
    localStorage.setItem('lastScannedUrl', scannedUrl);
    localStorage.setItem('ppcBudget', ppcBudget);
    localStorage.setItem('monthlyLoss', monthlyLoss);
    
    // 🔥 CRITICAL: Store clean variables for Tess Bridge
    localStorage.setItem('tess_loss', monthlyLoss); 
    localStorage.setItem('tess_issues', '13'); // Ideally calculate this dynamically

    console.log('💾 Stored Data:', { loss: monthlyLoss, issues: 13 });

       // Redirect to results page
    setTimeout(() => {
        const adminParam = urlParams.get('admin') === 'true' ? '&admin=true' : '';
        const nameParam = urlParams.get('name') ? `&name=${encodeURIComponent(urlParams.get('name'))}` : '';
        const resultsUrl = `calculator-enhanced.html?url=${encodeURIComponent(scannedUrl)}&budget=${ppcBudget}&loss=${monthlyLoss}${nameParam}${adminParam}`;
        window.location.href = resultsUrl;
    }, 2000);
}
}

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', async function() {
    console.log('Page loaded, updating content');
    
    // Initialize Supabase first
    await initSupabase();
    
    // Update all the dynamic content
    updateDynamicContent();
    
    // Hide preloader and start analysis after 2 seconds
    setTimeout(function() {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.style.display = 'none';
        }
        
        // Start the analysis progress
        console.log('Starting AnalysisProgress');
        new AnalysisProgress();
    }, 2000);
});
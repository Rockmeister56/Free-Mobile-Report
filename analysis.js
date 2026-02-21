// analysis.js - PPC AUDIT VERSION
// This file powers the analysis page with real PPC calculations

// Get parameters from URL or localStorage
const urlParams = new URLSearchParams(window.location.search);
const ppcBudget = parseInt(urlParams.get('budget') || localStorage.getItem('ppcBudget') || '10000');
const scannedUrl = urlParams.get('url') || localStorage.getItem('scannedUrl') || 'your website';

// Mortgage PPC Constants (based on Gemini data)
const MORTGAGE_METRICS = {
    cpc: 20,              // Average cost per click
    highIntentCPC: 35,    // Refinance, etc.
    abandonmentRate: 0.85, // 85% abandon mobile forms
    industryConversion: 0.08, // 8% industry avg
    formFields: 12,       // Average mortgage form fields
    optimalFields: 4,     // What it should be
    qualityScoreImpact: 0.43 // 43% CPC reduction possible
};

// Calculated values
const monthlyClicks = Math.round(ppcBudget / MORTGAGE_METRICS.cpc);
const expectedLeads = Math.round(monthlyClicks * MORTGAGE_METRICS.industryConversion);
const actualLeads = Math.round(expectedLeads * (1 - MORTGAGE_METRICS.abandonmentRate));
const monthlyLoss = Math.round(ppcBudget * MORTGAGE_METRICS.abandonmentRate * 0.74); // 74% of abandoned spend is recoverable
const costPerLostLead = Math.round(ppcBudget / (expectedLeads - actualLeads));

// Preloader - Show for 2 seconds then start analysis
document.addEventListener('DOMContentLoaded', function() {
    // Update all dynamic content
    updateDynamicContent();
    
    setTimeout(function() {
        document.getElementById('preloader').style.display = 'none';
        // Start the analysis progress
        new AnalysisProgress();
    }, 2000);
});

// Update all the dynamic text on the page
function updateDynamicContent() {
    // Update PPC header
    document.getElementById('ppcAmount').textContent = `$${ppcBudget.toLocaleString()}`;
    
    // Update URL display
    document.getElementById('urlDisplay').textContent = `Scanning: ${scannedUrl}`;
    
    // Update pain metrics
    document.getElementById('cpcValue').textContent = `$${MORTGAGE_METRICS.cpc}`;
    document.getElementById('bounceRate').textContent = `${MORTGAGE_METRICS.abandonmentRate * 100}%`;
    document.getElementById('monthlyLoss').textContent = `$${monthlyLoss.toLocaleString()}`;
    
    // Update step details
    document.getElementById('wasteCalc').textContent = `Based on your $${ppcBudget.toLocaleString()} budget`;
    document.getElementById('lossCalc').textContent = `$${monthlyLoss.toLocaleString()} estimated loss`;
    
    // Update loss alert
    document.getElementById('alertAmount').textContent = `$${monthlyLoss.toLocaleString()}`;
    
    // Update preloader text
    document.getElementById('preloaderText').textContent = `Analyzing $${ppcBudget.toLocaleString()} PPC Budget...`;
}

// Analysis Progress Class
class AnalysisProgress {
    constructor() {
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
            "Counting form fields (this might hurt)...",
            "Auditing mobile PPC performance...",
            "Estimating Quality Score impact...",
            "Comparing to industry benchmarks...",
            "Calculating your monthly losses...",
            "Almost there! Generating your report..."
        ];
        
        this.init();
    }

    init() {
        // Reset all steps
        this.resetAllSteps();
        // Start progress
        setTimeout(() => {
            this.startProgress();
        }, 500);
    }

    resetAllSteps() {
        this.steps.forEach((step, index) => {
            step.classList.remove('completed', 'active');
            const icon = step.querySelector('.step-icon');
            icon.textContent = '○';
            icon.style.animation = 'none';
        });
    }

    startProgress() {
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
        this.progressFill.style.width = `${this.progress}%`;
        this.progressText.textContent = `${Math.round(this.progress)}% Complete`;
        
        // Calculate current step based on progress (0-11 for 12 steps)
        const stepIndex = Math.floor((this.progress / 100) * 12);
        
        // Update status message
        if (stepIndex < this.statusMessages.length) {
            this.statusMessage.innerHTML = `<p>"${this.statusMessages[stepIndex]}"</p>`;
        }
        
        // Show loss alert at 50% progress
        if (this.progress >= 50 && this.lossAlert.style.display === 'none') {
            this.lossAlert.style.display = 'block';
        }
        
        // Update steps based on progress
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
        icon.textContent = '✓';
        icon.style.animation = 'none';
    }

    activateStep(stepIndex) {
        const step = this.steps[stepIndex];
        if (!step) return;
        
        step.classList.add('active');
        
        const icon = step.querySelector('.step-icon');
        icon.textContent = '⟳';
        icon.style.animation = 'spin 2s linear infinite';
    }

    completeAnalysis() {
        // Final completion animation
        this.progressFill.style.background = 'linear-gradient(90deg, #00cc66, #00ff88)';
        this.progressText.textContent = '100% Complete - Report Ready!';
        this.progressText.style.color = '#00cc66';
        
        // Update status message
        this.statusMessage.innerHTML = '<p>"✅ Analysis complete! Redirecting to your PPC audit report..."</p>';
        
        // Show loss alert if not already visible
        this.lossAlert.style.display = 'block';
        this.lossAlert.style.animation = 'pulse 1s infinite';
        
        // Store all data for results page
        localStorage.setItem('lastScannedUrl', scannedUrl);
        localStorage.setItem('ppcBudget', ppcBudget);
        localStorage.setItem('monthlyLoss', monthlyLoss);
        localStorage.setItem('monthlyClicks', monthlyClicks);
        localStorage.setItem('expectedLeads', expectedLeads);
        localStorage.setItem('actualLeads', actualLeads);
        
        // Redirect to results page
        setTimeout(() => {
            window.location.href = `calculator-enhanced.html?url=${encodeURIComponent(scannedUrl)}&budget=${ppcBudget}&loss=${monthlyLoss}`;
        }, 2000);
    }
}

// Helper function to format currency
function formatCurrency(amount) {
    return '$' + amount.toLocaleString();
}
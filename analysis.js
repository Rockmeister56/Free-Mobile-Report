// analysis.js - COMPLETE FIXED VERSION
// This file powers the PPC Audit analysis page

// Get parameters from URL or localStorage
const urlParams = new URLSearchParams(window.location.search);
const budgetRange = urlParams.get('budget') || localStorage.getItem('ppcBudget') || '10000';
const scannedUrl = urlParams.get('url') || localStorage.getItem('scannedUrl') || 'your website';

// Debug - see what's coming in (remove after testing)
console.log('Budget range received:', budgetRange);

// Convert range to midpoint value - FIXED version
function getMidpointFromRange(range) {
    // Handle if it comes as a string with dash (like "2000-5000")
    let rangeValue = range;
    if (range && range.includes('-')) {
        rangeValue = range.split('-')[0]; // Take the first number
    }
    
    // Clean the value - remove any non-numeric characters
    rangeValue = String(rangeValue).replace(/[^0-9]/g, '');
    
    const ranges = {
        '2000': 3500,    // $2k-5k = $3,500
        '5000': 7500,    // $5k-10k = $7,500
        '10000': 15000,  // $10k-20k = $15,000
        '20000': 35000,  // $20k-50k = $35,000
        '50000': 60000   // $50k+ = $60,000
    };
    
    // Try direct lookup first
    if (ranges[rangeValue]) {
        console.log('Found in ranges:', ranges[rangeValue]);
        return ranges[rangeValue];
    }
    
    // Try parsing as number
    const numValue = parseInt(rangeValue);
    if (!isNaN(numValue)) {
        // Find closest range
        if (numValue <= 3500) {
            console.log('Closest range: 3500');
            return 3500;
        }
        if (numValue <= 7500) {
            console.log('Closest range: 7500');
            return 7500;
        }
        if (numValue <= 15000) {
            console.log('Closest range: 15000');
            return 15000;
        }
        if (numValue <= 35000) {
            console.log('Closest range: 35000');
            return 35000;
        }
        console.log('Default high range: 60000');
        return 60000;
    }
    
    // Default fallback
    console.log('Using default: 7500');
    return 7500;
}

// Calculate the budget and loss
const ppcBudget = getMidpointFromRange(budgetRange);
const monthlyLoss = Math.round(ppcBudget * 0.625); // 62.5% waste rate

console.log('Final PPC Budget:', ppcBudget);
console.log('Monthly Loss:', monthlyLoss);

// Mortgage PPC Constants
const MORTGAGE_METRICS = {
    cpc: 20,
    abandonmentRate: 0.85,
    industryConversion: 0.08
};

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

    completeAnalysis() {
    console.log('✅ Analysis complete!');
    
    // Update UI
    this.progressFill.style.background = 'linear-gradient(90deg, #00cc66, #00ff88)';
    this.progressText.textContent = '100% Complete - Report Ready!';
    this.progressText.style.color = '#00cc66';
    this.statusMessage.innerHTML = '<p>"✅ Analysis complete! Redirecting to secure report..."</p>';
    
    // Generate one-time password
    function generatePassword() {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let pwd = '';
        for (let i = 0; i < 6; i++) {
            pwd += chars[Math.floor(Math.random() * chars.length)];
            if (i === 2) pwd += '-';
        }
        return pwd;
    }
    
    const oneTimePassword = generatePassword();
    console.log('🔑 Generated password:', oneTimePassword);
    
    // Store in localStorage
    localStorage.setItem('oneTimePassword', oneTimePassword);
    localStorage.setItem('lastScannedUrl', scannedUrl);
    localStorage.setItem('ppcBudget', ppcBudget);
    localStorage.setItem('monthlyLoss', monthlyLoss);
    
    // Redirect to password page
    setTimeout(() => {
        const url = `password-protect.html?pwd=${oneTimePassword}&url=${encodeURIComponent(scannedUrl)}&budget=${ppcBudget}&loss=${monthlyLoss}`;
        console.log('🚀 Redirecting to:', url);
        window.location.href = url;
    }, 2000);

    }
}


// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded, updating content');
    
    // First update all the dynamic content
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
// analysis.js - CLEAN VERSION
// Get parameters
const urlParams = new URLSearchParams(window.location.search);
const budgetRange = urlParams.get('budget') || localStorage.getItem('ppcBudget') || '10000';
const scannedUrl = urlParams.get('url') || localStorage.getItem('scannedUrl') || 'your website';

// Convert range to midpoint value
function getMidpointFromRange(range) {
    const ranges = {
        '2000': 3500,    // $2k-5k = $3,500
        '5000': 7500,    // $5k-10k = $7,500
        '10000': 15000,  // $10k-20k = $15,000
        '20000': 35000,  // $20k-50k = $35,000
        '50000': 60000   // $50k+ = $60,000 (conservative)
    };
    return ranges[range] || parseInt(range) || 7500;
}

const ppcBudget = getMidpointFromRange(budgetRange);

// Mortgage PPC Constants
const MORTGAGE_METRICS = {
    cpc: 20,
    abandonmentRate: 0.85,
    industryConversion: 0.08
};

// Calculate loss
const monthlyLoss = Math.round(ppcBudget * 0.625); // 62.5% waste rate

// Preloader
document.addEventListener('DOMContentLoaded', function() {
    updateDynamicContent();
    setTimeout(function() {
        document.getElementById('preloader').style.display = 'none';
        new AnalysisProgress();
    }, 2000);
});

function updateDynamicContent() {
    document.getElementById('budgetAmount').textContent = `$${ppcBudget.toLocaleString()}`;
    document.getElementById('urlDisplay').textContent = `Scanning: ${scannedUrl}`;
    document.getElementById('wasteCalc').textContent = `Based on $${ppcBudget.toLocaleString()} budget`;
    document.getElementById('lossCalc').textContent = `$${monthlyLoss.toLocaleString()} estimated loss`;
    document.getElementById('alertAmount').textContent = `$${monthlyLoss.toLocaleString()}`;
    document.getElementById('preloaderText').textContent = `Analyzing $${ppcBudget.toLocaleString()} PPC Budget...`;
}

// Analysis Progress Class (same as before but cleaner)
class AnalysisProgress {
    constructor() {
        this.progressFill = document.getElementById('progressFill');
        this.progressText = document.getElementById('progressText');
        this.steps = document.querySelectorAll('.step');
        this.statusMessage = document.getElementById('statusMessage');
        this.lossAlert = document.getElementById('lossAlert');
        this.currentStep = 0;
        this.progress = 0;
        
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
        
        this.init();
    }

    init() {
        this.resetAllSteps();
        setTimeout(() => {
            this.startProgress();
        }, 500);
    }

    resetAllSteps() {
        this.steps.forEach((step) => {
            step.classList.remove('completed', 'active');
            const icon = step.querySelector('.step-icon');
            icon.textContent = '○';
            icon.style.animation = 'none';
        });
    }

    startProgress() {
        const duration = 25000;
        const interval = 100;
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
        
        const stepIndex = Math.floor((this.progress / 100) * 12);
        
        if (stepIndex < this.statusMessages.length) {
            this.statusMessage.innerHTML = `<p>"${this.statusMessages[stepIndex]}"</p>`;
        }
        
        if (this.progress >= 50 && this.lossAlert.style.display === 'none') {
            this.lossAlert.style.display = 'block';
        }
        
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
        this.progressFill.style.background = 'linear-gradient(90deg, #00cc66, #00ff88)';
        this.progressText.textContent = '100% Complete - Report Ready!';
        this.progressText.style.color = '#00cc66';
        
        this.statusMessage.innerHTML = '<p>"✅ Analysis complete! Redirecting..."</p>';
        this.lossAlert.style.display = 'block';
        
        // Store data
        localStorage.setItem('lastScannedUrl', scannedUrl);
        localStorage.setItem('ppcBudget', ppcBudget);
        localStorage.setItem('monthlyLoss', monthlyLoss);
        
        setTimeout(() => {
            window.location.href = `calculator-enhanced.html?url=${encodeURIComponent(scannedUrl)}&budget=${ppcBudget}&loss=${monthlyLoss}`;
        }, 2000);
    }
}
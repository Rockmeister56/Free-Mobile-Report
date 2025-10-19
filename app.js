// Mobile Audit Scoring System
class MobileAudit {
    constructor() {
        this.analyzeBtn = document.getElementById('analyzeBtn');
        this.websiteUrl = document.getElementById('websiteUrl');
        this.init();
    }

    init() {
        this.analyzeBtn.addEventListener('click', () => this.startAnalysis());
        this.websiteUrl.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.startAnalysis();
        });
    }

    startAnalysis() {
        const url = this.websiteUrl.value.trim();
        
        if (!this.isValidUrl(url)) {
            this.showError('Please enter a valid website URL (e.g., https://yoursite.com)');
            return;
        }

        this.showLoading();
        this.analyzeSite(url);
    }

    isValidUrl(url) {
        try {
            const parsed = new URL(url);
            return parsed.protocol === 'http:' || parsed.protocol === 'https:';
        } catch {
            return false;
        }
    }

    showError(message) {
        // Remove any existing error
        this.removeError();
        
        // Create error element
        const errorEl = document.createElement('div');
        errorEl.className = 'error-message';
        errorEl.textContent = message;
        errorEl.style.cssText = `
            color: #e74c3c;
            background: #fdf2f2;
            padding: 12px;
            border-radius: 8px;
            margin-top: 10px;
            border: 1px solid #fbb;
            text-align: center;
        `;
        
        this.websiteUrl.parentNode.appendChild(errorEl);
        
        // Shake animation
        this.websiteUrl.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            this.websiteUrl.style.animation = '';
        }, 500);
    }

    removeError() {
        const existingError = document.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
    }

    showLoading() {
        this.analyzeBtn.textContent = 'ANALYZING...';
        this.analyzeBtn.classList.add('loading');
        this.analyzeBtn.disabled = true;
    }

    hideLoading() {
        this.analyzeBtn.textContent = '🔍 ANALYZE MY SITE';
        this.analyzeBtn.classList.remove('loading');
        this.analyzeBtn.disabled = false;
    }

    analyzeSite(url) {
        // Simulate analysis delay
        setTimeout(() => {
            const score = this.calculateScore(url);
            this.hideLoading();
            this.showResults(score, url);
        }, 2000);
    }

    calculateScore(url) {
        // Base score - most sites score poorly intentionally
        let score = Math.floor(Math.random() * 30) + 25; // 25-55 range
        
        // Adjust based on URL characteristics (mock logic)
        if (url.includes('newclientsinc.com')) score = 28;
        if (url.includes('mortgage') || url.includes('loan')) score -= 5;
        if (url.includes('modern') || url.includes('tech')) score += 10;
        
        return Math.max(10, Math.min(100, score));
    }

    showResults(score, url) {
        // Store data for next page
        sessionStorage.setItem('auditScore', score);
        sessionStorage.setItem('auditUrl', url);
        
        // Redirect to report page
        window.location.href = 'analysis.html';
    }
}

// Add shake animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

// Initialize the audit system
document.addEventListener('DOMContentLoaded', () => {
    new MobileAudit();
});
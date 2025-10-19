// Analysis Page Progress System
class AnalysisProgress {
    constructor() {
        this.progressFill = document.getElementById('progressFill');
        this.progressText = document.getElementById('progressText');
        this.steps = document.querySelectorAll('.step');
        this.currentStep = 2; // Start from step 3 (0-indexed)
        this.progress = 0;
        this.init();
    }

    init() {
        this.startProgress();
        this.animateSteps();
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
        
        // Update steps based on progress
        if (this.progress >= 15 && this.currentStep === 2) {
            this.completeStep(2);
            this.activateStep(3);
            this.currentStep = 3;
        } else if (this.progress >= 35 && this.currentStep === 3) {
            this.completeStep(3);
            this.activateStep(4);
            this.currentStep = 4;
        } else if (this.progress >= 60 && this.currentStep === 4) {
            this.completeStep(4);
            this.activateStep(5);
            this.currentStep = 5;
        } else if (this.progress >= 85 && this.currentStep === 5) {
            this.completeStep(5);
        }
    }

    animateSteps() {
        // Initial completed steps animation
        setTimeout(() => {
            this.completeStep(0);
        }, 500);
        
        setTimeout(() => {
            this.completeStep(1);
        }, 1500);
    }

    completeStep(stepIndex) {
        const step = this.steps[stepIndex];
        step.classList.remove('active');
        step.classList.add('completed');
        
        const icon = step.querySelector('.step-icon');
        icon.textContent = '✓';
        icon.style.animation = 'none';
    }

    activateStep(stepIndex) {
        const step = this.steps[stepIndex];
        step.classList.add('active');
        
        const icon = step.querySelector('.step-icon');
        icon.textContent = '⟳';
        icon.style.animation = 'spin 2s linear infinite';
    }

    completeAnalysis() {
        // Final completion animation
        this.progressFill.style.background = 'linear-gradient(90deg, #00cc66, #00ff88)';
        this.progressText.textContent = '100% Complete - Analysis Ready!';
        this.progressText.style.color = '#00ff88';
        
        // Redirect back to calculator instead of report.html
        setTimeout(() => {
            window.location.href = 'calculator-enhanced.html';  // ← CHANGED TO CALCULATOR
        }, 1500);
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    new AnalysisProgress();
});
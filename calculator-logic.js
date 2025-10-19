// Mobile Revenue Calculator with 3X Conversion Boost
class RevenueCalculator {
    constructor() {
        this.calculateBtn = document.getElementById('calculateBtn');
        this.resultsSection = document.getElementById('resultsSection');
        this.init();
    }

    init() {
        this.calculateBtn.addEventListener('click', () => this.calculateRevenue());
        
        // Add input validation and real-time updates
        const inputs = ['monthlyVisitors', 'conversionRate', 'averageSale'];
        inputs.forEach(id => {
            document.getElementById(id).addEventListener('input', () => this.validateInputs());
        });
    }

    validateInputs() {
        const visitors = document.getElementById('monthlyVisitors').value;
        const conversion = document.getElementById('conversionRate').value;
        const saleValue = document.getElementById('averageSale').value;
        
        const isValid = visitors && conversion && saleValue;
        this.calculateBtn.disabled = !isValid;
        
        return isValid;
    }

    calculateRevenue() {
        if (!this.validateInputs()) return;

        // Get input values
        const monthlyVisitors = parseInt(document.getElementById('monthlyVisitors').value);
        const conversionRate = parseFloat(document.getElementById('conversionRate').value) / 100;
        const averageSale = parseFloat(document.getElementById('averageSale').value);

        // Calculate current revenue
        const currentRevenue = monthlyVisitors * conversionRate * averageSale;
        
        // Calculate 3X boosted revenue (Mobile-Wise AI magic!)
        const boostedConversionRate = conversionRate * 3; // 3X CONVERSION BOOST!
        const potentialRevenue = monthlyVisitors * boostedConversionRate * averageSale;
        
        // Calculate additional revenue
        const additionalRevenue = potentialRevenue - currentRevenue;

        // Display results with formatting
        this.displayResults(currentRevenue, potentialRevenue, additionalRevenue);
        
        // Show results section with smooth animation
        this.showResults();
    }

    displayResults(current, potential, additional) {
        // Format currency
        const formatCurrency = (amount) => {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(amount);
        };

        // Update DOM elements
        document.getElementById('currentRevenue').textContent = formatCurrency(current);
        document.getElementById('potentialRevenue').textContent = formatCurrency(potential);
        document.getElementById('additionalRevenue').textContent = formatCurrency(additional);
        document.getElementById('lossAmount').textContent = formatCurrency(additional);

        // Add some visual flair
        this.animateResults();
    }

    showResults() {
        this.resultsSection.style.display = 'block';
        
        // Smooth scroll to results
        setTimeout(() => {
            this.resultsSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'center'
            });
        }, 100);
    }

    animateResults() {
        const resultValues = document.querySelectorAll('.result-value');
        
        resultValues.forEach((value, index) => {
            value.style.opacity = '0';
            value.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                value.style.transition = 'all 0.6s ease';
                value.style.opacity = '1';
                value.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }
}

// Initialize calculator when page loads
document.addEventListener('DOMContentLoaded', () => {
    new RevenueCalculator();
});
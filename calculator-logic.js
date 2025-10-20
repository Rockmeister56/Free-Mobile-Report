// Calculator Logic - Enhanced Version
document.addEventListener('DOMContentLoaded', function() {
    const calculateBtn = document.getElementById('calculateBtn');
    const seeDemoBtn = document.getElementById('seeDemoBtn');
    const closePopup = document.getElementById('closePopup');
    const startDemo = document.getElementById('startDemo');
    const scheduleCall = document.getElementById('scheduleCall');
    const demoPopup = document.getElementById('demoPopup');
    const resultsSection = document.getElementById('resultsSection');

    // Close popup function
    function closePopupFunc() {
        demoPopup.style.display = 'none';
        document.body.style.overflow = ''; // Restore scrolling
    }

    // Calculate revenue
    calculateBtn.addEventListener('click', function() {
        const monthlyVisitors = parseFloat(document.getElementById('monthlyVisitors').value);
        const conversionRate = parseFloat(document.getElementById('conversionRate').value);
        const averageSale = parseFloat(document.getElementById('averageSale').value);

        // Validate inputs
        if (!monthlyVisitors || monthlyVisitors < 100) {
            alert('Please enter at least 100 monthly visitors');
            return;
        }
        
        if (!conversionRate || conversionRate < 0.1 || conversionRate > 100) {
            alert('Please enter a valid conversion rate between 0.1% and 100%');
            return;
        }
        
        if (!averageSale || averageSale < 1) {
            alert('Please enter a valid average sale value of at least $1');
            return;
        }

        // Calculate current revenue
        const currentRevenue = monthlyVisitors * (conversionRate / 100) * averageSale;
        
        // Calculate potential revenue (3X boost)
        const potentialRevenue = monthlyVisitors * ((conversionRate * 3) / 100) * averageSale;
        
        // Calculate additional revenue
        const additionalRevenue = potentialRevenue - currentRevenue;

        // Format numbers with commas
        const formatCurrency = (num) => {
            return '$' + Math.round(num).toLocaleString();
        };

        // Smart metric generator - creates unique but realistic combinations
function generateSmartMetrics() {
    // Base ranges that maintain the "poor performance" story
    const conversionRange = { min: 15, max: 30 };    // 15-30% (poor)
    const mobileTrafficRange = { min: 30, max: 50 }; // 30-50% (significant but underserved)
    const bounceRateRange = { min: 70, max: 85 };    // 70-85% (critical)
    
    // Generate random but correlated metrics
    const conversionScore = Math.floor(Math.random() * (conversionRange.max - conversionRange.min + 1)) + conversionRange.min;
    
    // Mobile traffic tends to correlate with bounce rate (higher traffic often means higher bounce)
    const mobileTraffic = Math.floor(Math.random() * (mobileTrafficRange.max - mobileTrafficRange.min + 1)) + mobileTrafficRange.min;
    
    // Bounce rate inversely correlates with conversion score
    const bounceRate = Math.floor(Math.random() * (bounceRateRange.max - bounceRateRange.min + 1)) + bounceRateRange.min;
    
    return {
        conversionScore: conversionScore,
        mobileTraffic: mobileTraffic,
        bounceRate: bounceRate
    };
}

// Smart metric generator - creates unique but realistic combinations
function generateSmartMetrics() {
    const conversionRange = { min: 15, max: 30 };
    const mobileTrafficRange = { min: 30, max: 50 };
    const bounceRateRange = { min: 70, max: 85 };
    
    const conversionScore = Math.floor(Math.random() * (conversionRange.max - conversionRange.min + 1)) + conversionRange.min;
    const mobileTraffic = Math.floor(Math.random() * (mobileTrafficRange.max - mobileTrafficRange.min + 1)) + mobileTrafficRange.min;
    const bounceRate = Math.floor(Math.random() * (bounceRateRange.max - bounceRateRange.min + 1)) + bounceRateRange.min;
    
    return { conversionScore, mobileTraffic, bounceRate };
}

function updateReportMetrics() {
    // Add a small delay to ensure DOM is ready
    setTimeout(() => {
        const conversionScoreEl = document.getElementById('conversionScore');
        const mobileTrafficEl = document.getElementById('mobileTraffic');
        const bounceRateEl = document.getElementById('bounceRate');
        
        if (conversionScoreEl && mobileTrafficEl && bounceRateEl) {
            const metrics = generateSmartMetrics();
            conversionScoreEl.textContent = metrics.conversionScore + '%';
            mobileTrafficEl.textContent = metrics.mobileTraffic + '%';
            bounceRateEl.textContent = metrics.bounceRate + '%';
            
            updateSummaryText(metrics);
        } else {
            console.log('Metrics elements not found yet, retrying...');
            // Retry after another short delay
            setTimeout(updateReportMetrics, 100);
        }
    }, 100);
}

// Update the summary text based on the metrics
function updateSummaryText(metrics) {
    const summaryElement = document.querySelector('.report-section-card p');
    if (summaryElement) {
        summaryElement.innerHTML = `Based on our analysis, your mobile site has <strong>critical performance issues</strong> (scoring only ${metrics.conversionScore}%) that are costing you significant revenue. With ${metrics.mobileTraffic}% of your traffic coming from mobile and a ${metrics.bounceRate}% bounce rate, immediate optimization could increase conversions by up to <strong>3X</strong>.`;
    }
}

// Wait for full page load
window.addEventListener('load', function() {
    updateReportMetrics();
    
    const calculateBtn = document.getElementById('calculateBtn');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', function() {
            updateReportMetrics();
        });
    }
});

// Also try on DOMContentLoaded as backup
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(updateReportMetrics, 200);
});

function updateReportMetrics() {
    const metrics = generateSmartMetrics();
    
    document.getElementById('conversionScore').textContent = metrics.conversionScore + '%';
    document.getElementById('mobileTraffic').textContent = metrics.mobileTraffic + '%';
    document.getElementById('bounceRate').textContent = metrics.bounceRate + '%';
    
    updateSummaryText(metrics); // Optional: update the text too
}

        // Update results
        document.getElementById('currentRevenue').textContent = formatCurrency(currentRevenue);
        document.getElementById('potentialRevenue').textContent = formatCurrency(potentialRevenue);
        document.getElementById('additionalRevenue').textContent = formatCurrency(additionalRevenue);
        document.getElementById('lossAmount').textContent = formatCurrency(additionalRevenue);

        // Show results section with animation
        resultsSection.style.display = 'block';
        resultsSection.scrollIntoView({ behavior: 'smooth' });
        
        // Add some visual feedback
        calculateBtn.textContent = '✓ CALCULATED!';
        calculateBtn.style.backgroundColor = '#10b981';
        setTimeout(() => {
            calculateBtn.textContent = '🚀 CALCULATE MY REVENUE LOSS';
            calculateBtn.style.backgroundColor = '';
        }, 2000);
    });

    // Show demo popup
    seeDemoBtn.addEventListener('click', function() {
        demoPopup.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    });

    // Close popup
    closePopup.addEventListener('click', closePopupFunc);

    // Schedule call - REPLACE THIS WITH YOUR ACTUAL CALENDLY/SCHEDULING URL
    scheduleCall.addEventListener('click', function() {
        window.open('https://calendly.com/your-scheduling-link', '_blank');
        closePopupFunc();
    });

    // Boost Header Button functionality
boostBtn.addEventListener('click', function() {
    // Replace with your actual demo URL
    window.open('https://your-demo-url.com', '_blank');
});

// Video placeholder click
videoPlaceholder.addEventListener('click', function() {
    // Replace with your actual video URL
    window.open('https://your-video-url.com', '_blank');
});

    // Close popup when clicking outside
    demoPopup.addEventListener('click', function(e) {
        if (e.target === demoPopup) {
            closePopupFunc();
        }
    });

    // Close popup with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closePopupFunc();
        }
    });

    // Report Form Submission
const reportForm = document.getElementById('reportForm');
const reportSuccess = document.getElementById('reportSuccess');
const closeReportSuccess = document.getElementById('closeReportSuccess');
const closeSuccessBtn = document.getElementById('closeSuccessBtn');

// Update the report form submission in calculator-logic.js
reportForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const userFirstName = document.getElementById('userFirstName').value;
    const userEmail = document.getElementById('userEmail').value;
    
    if (!userFirstName || !userEmail) {
        alert('Please enter both your first name and email address');
        return;
    }
    
    // Here you would send this data to your backend/email service
    console.log('User details:', { firstName: userFirstName, email: userEmail });
    
    // Show success popup
    reportSuccess.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Clear the form
    reportForm.reset();
});

// Close report success popup
function closeReportSuccessFunc() {
    reportSuccess.style.display = 'none';
    document.body.style.overflow = '';
}

closeReportSuccess.addEventListener('click', closeReportSuccessFunc);
closeSuccessBtn.addEventListener('click', closeReportSuccessFunc);

// Close report success when clicking outside
reportSuccess.addEventListener('click', function(e) {
    if (e.target === reportSuccess) {
        closeReportSuccessFunc();
    }
});

    // Input validation - allow only numbers
    const inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            // Remove any non-numeric characters except decimal point
            this.value = this.value.replace(/[^0-9.]/g, '');
            
            // Ensure only one decimal point
            const decimalCount = (this.value.match(/\./g) || []).length;
            if (decimalCount > 1) {
                this.value = this.value.slice(0, -1);
            }
        });
    });
});
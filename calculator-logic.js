// Calculator Logic - Enhanced Version
document.addEventListener('DOMContentLoaded', function() {
    const calculateBtn = document.getElementById('calculateBtn');
    const seeDemoBtn = document.getElementById('seeDemoBtn');
    const closePopup = document.getElementById('closePopup');
    const startDemo = document.getElementById('startDemo');
    const scheduleCall = document.getElementById('scheduleCall');
    const voiceAIBtn = document.getElementById('voiceAIBtn');
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

    // Video Teaser Functionality
const boostBtn = document.querySelector('.boost-btn');
const videoPlaceholder = document.querySelector('.video-placeholder');

boostBtn.addEventListener('click', function() {
    // Replace with your actual video URL or demo page
    window.open('https://your-video-demo-url.com', '_blank');
});

    // Schedule call - REPLACE THIS WITH YOUR ACTUAL CALENDLY/SCHEDULING URL
    scheduleCall.addEventListener('click', function() {
        window.open('https://calendly.com/your-scheduling-link', '_blank');
        closePopupFunc();
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
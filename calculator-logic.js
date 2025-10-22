// Calculator Logic - Enhanced Version with Fixed Boost Modal
document.addEventListener('DOMContentLoaded', function() {
    const calculateBtn = document.getElementById('calculateBtn');
    const seeDemoBtn = document.getElementById('seeDemoBtn');
    const closePopup = document.getElementById('closePopup');
    const startDemo = document.getElementById('startDemo');
    const scheduleCall = document.getElementById('scheduleCall');
    const demoPopup = document.getElementById('demoPopup');
    const resultsSection = document.getElementById('resultsSection');
    
    // Boost modal elements - UPDATED IDs
    const openBoostModalBtn = document.getElementById('openBoostModal');
    const boostHeaderBtn = document.getElementById('boostHeaderBtn');
    const boostModal = document.getElementById('boostModal');
    const closeBoostModalBtn = document.getElementById('closeBoostModal');
    const freeZoomDemoBtn = document.getElementById('freeZoomDemoBtn');
    
    // Get report form elements (BUT DON'T HANDLE SUBMISSION HERE - let HTML/EmailJS handle it)
    const reportSuccess = document.getElementById('reportSuccess');
    const closeReportSuccess = document.getElementById('closeReportSuccess');
    const closeSuccessBtn = document.getElementById('closeSuccessBtn');

    // ✅ SINGLE PLACE FOR ALL URLS
    const DEMO_URL = 'https://www.youtube.com/embed/JbLpXs8mdeo';
    const SCHEDULING_URL = 'https://free-mobile-report.netlify.app/zoom-scheduler';

    // ========== BOOST MODAL FUNCTIONS - ENHANCED ==========
    function openBoostModal() {
        console.log('Opening boost modal');
        if (boostModal) {
            boostModal.style.display = 'flex';
            document.body.classList.add('modal-open');
        }
    }

    function closeBoostModal() {
        console.log('Closing boost modal');
        if (boostModal) {
            boostModal.style.display = 'none';
            document.body.classList.remove('modal-open');
            resetBoostModalVideo();
        }
    }

    function resetBoostModalVideo() {
        const iframe = document.querySelector('.boost-modal-video');
        if (iframe) {
            // Properly reset YouTube video
            iframe.src = iframe.src.replace('&autoplay=1', '');
        }
    }

    // ========== BOOST MODAL EVENT LISTENERS ==========
    if (openBoostModalBtn) {
        openBoostModalBtn.addEventListener('click', openBoostModal);
    }

    if (boostHeaderBtn) {
        boostHeaderBtn.addEventListener('click', openBoostModal);
    }

    if (closeBoostModalBtn) {
        closeBoostModalBtn.addEventListener('click', closeBoostModal);
    }

    // Close boost modal when clicking overlay
    if (boostModal) {
        boostModal.addEventListener('click', (e) => {
            if (e.target === boostModal || e.target.classList.contains('boost-modal-overlay')) {
                closeBoostModal();
            }
        });
    }

    // Free Zoom Demo Button - OPEN IN NEW TAB VERSION
    if (freeZoomDemoBtn) {
        freeZoomDemoBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Free Zoom Demo button clicked');
            
            // Close the modal
            closeBoostModal();
            
            // Open scheduling page in new tab
            setTimeout(() => {
                window.open(SCHEDULING_URL, '_blank');
            }, 300);
        });
    }

    // ========== EXISTING FUNCTIONALITY ==========
    function closePopupFunc() {
        if (demoPopup) demoPopup.style.display = 'none';
        document.body.style.overflow = '';
    }

    // Smart metric generator
    function generateSmartMetrics() {
        const conversionRange = { min: 15, max: 30 };
        const mobileTrafficRange = { min: 30, max: 50 };
        const bounceRateRange = { min: 70, max: 85 };
        
        const conversionScore = Math.floor(Math.random() * (conversionRange.max - conversionRange.min + 1)) + conversionRange.min;
        const mobileTraffic = Math.floor(Math.random() * (mobileTrafficRange.max - mobileTrafficRange.min + 1)) + mobileTrafficRange.min;
        const bounceRate = Math.floor(Math.random() * (bounceRateRange.max - bounceRateRange.min + 1)) + bounceRateRange.min;
        
        return { conversionScore, mobileTraffic, bounceRate };
    }

    // Update the summary text based on the metrics
    function updateSummaryText(metrics) {
        const summaryElement = document.querySelector('.report-section-card p');
        if (summaryElement) {
            summaryElement.innerHTML = `Based on our analysis, your mobile site has <strong>critical performance issues</strong> (scoring only ${metrics.conversionScore}%) that are costing you significant revenue. With ${metrics.mobileTraffic}% of your traffic coming from mobile and a ${metrics.bounceRate}% bounce rate, immediate optimization could increase conversions by up to <strong>3X</strong>.`;
        }
    }

    function updateReportMetrics() {
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
                setTimeout(updateReportMetrics, 100);
            }
        }, 100);
    }

    // Calculate revenue
    if (calculateBtn) {
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
            const potentialRevenue = monthlyVisitors * ((conversionRate * 3) / 100) * averageSale;
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

            // Update metrics when calculating
            updateReportMetrics();

            // Show results section with animation
            if (resultsSection) {
                resultsSection.style.display = 'block';
                resultsSection.scrollIntoView({ behavior: 'smooth' });
            }
            
            // Add some visual feedback
            calculateBtn.textContent = '✓ CALCULATED!';
            calculateBtn.style.backgroundColor = '#10b981';
            setTimeout(() => {
                calculateBtn.textContent = '🚀 CALCULATE MY REVENUE LOSS';
                calculateBtn.style.backgroundColor = '';
            }, 2000);
        });
    }

    // Show demo popup
    if (seeDemoBtn) {
        seeDemoBtn.addEventListener('click', function() {
            if (demoPopup) {
                demoPopup.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            }
        });
    }

    // Close popup
    if (closePopup) {
        closePopup.addEventListener('click', closePopupFunc);
    }

    // Start Demo button
    if (startDemo) {
        startDemo.addEventListener('click', function() {
            window.open(DEMO_URL, '_blank');
            closePopupFunc();
        });
    }

    // Schedule call
    if (scheduleCall) {
        scheduleCall.addEventListener('click', function() {
            window.open(SCHEDULING_URL, '_blank');
            closePopupFunc();
        });
    }

    // REMOVED: The duplicate form submission handler that was causing the issue

    // Close report success popup
    function closeReportSuccessFunc() {
        if (reportSuccess) {
            reportSuccess.style.display = 'none';
            document.body.style.overflow = '';
        }
    }

    if (closeReportSuccess) {
        closeReportSuccess.addEventListener('click', closeReportSuccessFunc);
    }
    
    if (closeSuccessBtn) {
        closeSuccessBtn.addEventListener('click', closeReportSuccessFunc);
    }

    // Close report success when clicking outside
    if (reportSuccess) {
        reportSuccess.addEventListener('click', function(e) {
            if (e.target === reportSuccess) {
                closeReportSuccessFunc();
            }
        });
    }

    // Close popup when clicking outside
    if (demoPopup) {
        demoPopup.addEventListener('click', function(e) {
            if (e.target === demoPopup) {
                closePopupFunc();
            }
        });
    }

    // Close all modals with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closePopupFunc();
            closeReportSuccessFunc();
            closeBoostModal();
        }
    });

    // Input validation - allow only numbers
    const inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9.]/g, '');
            
            const decimalCount = (this.value.match(/\./g) || []).length;
            if (decimalCount > 1) {
                this.value = this.value.slice(0, -1);
            }
        });
    });

    // Initialize metrics on page load
    updateReportMetrics();

    // Debug info
    console.log('Boost modal elements:', {
        openBoostModalBtn: !!openBoostModalBtn,
        boostHeaderBtn: !!boostHeaderBtn,
        boostModal: !!boostModal,
        closeBoostModalBtn: !!closeBoostModalBtn,
        freeZoomDemoBtn: !!freeZoomDemoBtn
    });
});
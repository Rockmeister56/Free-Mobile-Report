// AI Demo Integration and Popup Management
class AIDemoIntegration {
    constructor() {
        this.demoPopup = document.getElementById('demoPopup');
        this.seeDemoBtn = document.getElementById('seeDemoBtn');
        this.startDemoBtn = document.getElementById('startDemo');
        this.scheduleCallBtn = document.getElementById('scheduleCall');
        this.closePopupBtn = document.getElementById('closePopup');
        this.init();
    }

    init() {
        // Event listeners for demo flow
        this.seeDemoBtn.addEventListener('click', () => this.showDemoPopup());
        this.startDemoBtn.addEventListener('click', () => this.startAIDemo());
        this.scheduleCallBtn.addEventListener('click', () => this.scheduleCall());
        this.closePopupBtn.addEventListener('click', () => this.hideDemoPopup());
        
        // Close popup when clicking outside
        this.demoPopup.addEventListener('click', (e) => {
            if (e.target === this.demoPopup) {
                this.hideDemoPopup();
            }
        });

        // Keyboard escape to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.demoPopup.style.display === 'block') {
                this.hideDemoPopup();
            }
        });
    }

    showDemoPopup() {
        this.demoPopup.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        
        // Track this conversion event
        this.trackEvent('demo_popup_opened');
    }

    hideDemoPopup() {
        this.demoPopup.style.display = 'none';
        document.body.style.overflow = 'auto'; // Re-enable scrolling
    }

    startAIDemo() {
        // Track demo start
        this.trackEvent('ai_demo_started');
        
        // Close popup
        this.hideDemoPopup();
        
        // Redirect to your AI demo page or launch demo modal
        // You can replace this URL with your actual AI demo page
        setTimeout(() => {
            // For now, show an alert - replace with actual demo launch
            alert('🚀 Launching Mobile-Wise AI Demo...\n\nThis would open your actual AI voice assistant demo where users can experience the conversation flow and see testimonials in action!');
            
            // Example of what would happen:
            // window.location.href = '/ai-demo?source=calculator';
            // OR launch your voice AI widget
            // launchVoiceAI();
        }, 500);
    }

    scheduleCall() {
        // Track schedule call click
        this.trackEvent('schedule_call_clicked');
        
        // Close popup
        this.hideDemoPopup();
        
        // Redirect to scheduling page or open calendar
        setTimeout(() => {
            // For now, show an alert - replace with actual scheduling system
            alert('📅 Scheduling Call...\n\nThis would open your calendar scheduling system (Calendly, Acuity, etc.) for the user to book a consultation call.');
            
            // Example of what would happen:
            // window.open('https://calendly.com/your-mobile-wise-ai/discovery-call', '_blank');
        }, 500);
    }

    trackEvent(eventName) {
        // Integration with your analytics (Google Analytics, Facebook Pixel, etc.)
        console.log(`📊 Analytics Event: ${eventName}`);
        
        // Example Google Analytics event
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                'event_category': 'calculator_conversion',
                'event_label': 'revenue_calculator'
            });
        }
        
        // Example Facebook Pixel event
        if (typeof fbq !== 'undefined') {
            fbq('track', eventName);
        }
    }
}

// Podcast invitation handler
class PodcastInvitation {
    constructor() {
        this.podcastElements = document.querySelectorAll('.podcast-invite');
        this.init();
    }

    init() {
        this.podcastElements.forEach(element => {
            element.addEventListener('click', () => this.handlePodcastClick());
        });
    }

    handlePodcastClick() {
        // Track podcast interest
        this.trackEvent('podcast_interest_shown');
        
        // Open podcast page or subscription modal
        setTimeout(() => {
            // For now, show an alert - replace with actual podcast page
            alert('🎧 Podcast Invitation!\n\nThis would direct users to your "Ask AI For Business" podcast page where they can subscribe and listen to episodes about AI-driven business growth.');
            
            // Example of what would happen:
            // window.open('https://yourapp.com/podcast', '_blank');
            // OR show email capture for podcast notifications
            // this.showPodcastEmailCapture();
        }, 500);
    }

    trackEvent(eventName) {
        console.log(`📊 Podcast Event: ${eventName}`);
        // Add your analytics tracking here
    }
}

// Initialize all integrations when page loads
document.addEventListener('DOMContentLoaded', () => {
    new AIDemoIntegration();
    new PodcastInvitation();
    
    // Enable calculate button if inputs are pre-filled
    const calculator = new RevenueCalculator();
    calculator.validateInputs();
});
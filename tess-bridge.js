// tess-bridge.js - FINAL STABLE VERSION
// Fixes: 1. Right Numbers, 2. Volume Up, 3. NO Text Bubbles

class TessBridge {
    constructor() {
        this.widget = document.querySelector('lemon-slice-widget');
        this.tessReady = false;

        // 👇 STEP 1: KILL BUBBLES IMMEDIATELY (CSS Injection)
        // This runs before the widget even finishes loading
        this.injectBubbleKiller();

        if (document.readyState === 'complete') {
            this.init();
        } else {
            document.addEventListener('DOMContentLoaded', () => this.init());
        }
    }

    // 🛑 NEW: Inject CSS that forces bubbles to never display
    injectBubbleKiller() {
        const style = document.createElement('style');
        style.id = 'tess-bubble-killer';
        style.innerHTML = `
            /* Target ALL possible bubble classes in Shadow DOM and Light DOM */
            lemon-slice-widget [class*="bubble"],
            lemon-slice-widget [class*="message"],
            lemon-slice-widget [class*="chat"],
            lemon-slice-widget .text-bubble,
            lemon-slice-widget .speech-bubble,
            lemon-slice-widget .agent-message {
                display: none !important; 
                visibility: hidden !important; 
                opacity: 0 !important;
                pointer-events: none !important;
            }
        `;
        document.head.appendChild(style);
        console.log('[Tess Bridge] Bubble Killer CSS Injected');
    }

    init() {
        console.log('[Tess Bridge] Initializing...');
        
        // Setup UI Listeners
        this.setupTessControls();
        this.setupEscapeProtection();

        // Run the Auto-Fix sequence
        this.autoFixTess();
    }

    // --- DATA LOGIC: READ FROM SCREEN (KEEPS RIGHT NUMBERS) ---
    getAuditData() {
        const lossEl = document.getElementById('lossAmount');
        const urlEl = document.getElementById('urlDisplay');

        // Fallback to localStorage if elements missing
        const lossText = lossEl ? lossEl.textContent : (localStorage.getItem('monthlyLoss') || '$5,000');
        const urlText = urlEl ? urlEl.textContent : (localStorage.getItem('lastScannedUrl') || 'your website');

        // Clean up URL text
        const cleanUrl = urlText.replace('Website: ', '').replace('Scanning: ', '');

        return {
            loss: lossText,
            url: cleanUrl
        };
    }

    // --- WIDGET CONTROL: YOUR WORKING LOGIC ---
    autoFixTess() {
        console.log('[Tess Bridge] Auto-fixing Tess...');
        
        setTimeout(() => {
            if (!this.widget) {
                console.warn('[Tess Bridge] Widget not ready, retrying...');
                setTimeout(() => this.autoFixTess(), 2000);
                return;
            }
            
            // Force proper state
            this.widget.setAttribute('controlled-widget-state', 'active');
            this.widget.style.width = '200px';
            this.widget.style.height = '300px';
            
            // Prepare mic and volume
            setTimeout(async () => {
                try {
                    // Turn on the mic and volume
                    await this.widget.micOn?.();
                    await this.widget.unmute?.();
                    
                    this.tessReady = true;
                    console.log('[Tess Bridge] ✅ Tess ready!');
                    
                    // Speak the data
                    this.speakAuditData();
                    
                } catch (error) {
                    console.warn('[Tess Bridge] Partial success:', error);
                }
            }, 1500);
            
        }, 1000);
    }

    // --- SPEECH LOGIC ---
    speakAuditData() {
        if (!this.tessReady) return;

        const data = this.getAuditData();
        
        // Log to console so you can verify she's saying the right thing
        console.log('[Tess Bridge] PREPARING TO SAY:', data);

        const message = `Hi! I'm Tess. I just finished the audit for ${data.url}. It looks like you're losing around ${data.loss} per month in PPC waste. That's exactly what I'm built to fix. Would you like to see how we can recover that revenue?`;

        try {
            if (typeof this.widget.sendMessage === 'function') {
                this.widget.sendMessage(message);
            }
        } catch (e) {
            console.error('[Tess Bridge] Speech error', e);
        }
    }

    // --- UI CONTROLS ---
    setupTessControls() {
        const tessImage = document.querySelector('#tess-image-link img');
        if (tessImage) {
            tessImage.addEventListener('click', (e) => {
                this.pauseTess();
            });
        }
    }

    pauseTess() {
        if (this.widget) {
            if (typeof this.widget.mute === 'function') this.widget.mute();
            this.widget.setAttribute('muted', 'true');
            this.widget.style.opacity = '0.7';
            this.showPauseIndicator();
        }
    }

    showPauseIndicator() {
        let indicator = document.getElementById('tess-paused-indicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'tess-paused-indicator';
            indicator.style.cssText = `
                position: fixed; bottom: 350px; right: 30px;
                background: rgba(0,0,0,0.7); color: white;
                padding: 4px 10px; border-radius: 20px;
                font-size: 12px; z-index: 10001;
                border: 1px solid #3b82f6;
            `;
            indicator.textContent = '⏸️ Tess paused';
            document.body.appendChild(indicator);
            setTimeout(() => indicator.remove(), 2000);
        }
    }

    setupEscapeProtection() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const anyOverlayVisible = document.querySelector('.modal, .popup, [style*="display: flex"]');
                if (anyOverlayVisible) {
                    e.stopPropagation();
                }
            }
        }, true);
    }
}

// Initialize
new TessBridge();
// tess-bridge.js - FINAL PRODUCTION VERSION
// Combines Reliable Data Reading with Aggressive Widget Control

class TessBridge {
    constructor() {
        this.widget = document.querySelector('lemon-slice-widget');
        this.tessReady = false;

        // Run immediately
        if (document.readyState === 'complete') {
            this.init();
        } else {
            document.addEventListener('DOMContentLoaded', () => this.init());
        }
    }

    init() {
        console.log('[Tess Bridge] Initializing...');
        
        // 1. Hide text bubbles IMMEDIATELY
        this.hideTextBubbles();
        
        // 2. Setup UI Listeners (Pause/Resume)
        this.setupTessControls();
        this.setupEscapeProtection();

        // 3. Run the Auto-Fix sequence (Volume/Mic/Speak)
        this.autoFixTess();
    }

    // --- DATA LOGIC: READ FROM SCREEN ---
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

    // --- WIDGET CONTROL: YOUR TRUSTED LOGIC ---
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

             // 👇 STEP 4: Force hide bubbles AFTER message
                setTimeout(() => {
                    this.forceHideBubbles();
                }, 100);
            
            // Prepare mic and volume (CRITICAL FOR VOLUME FIX)
            setTimeout(async () => {
                try {
                    // 👇 THESE LINES FIX THE VOLUME
                    await this.widget.micOn?.();
                    await this.widget.unmute?.();
                    
                    this.tessReady = true;
                    console.log('[Tess Bridge] ✅ Tess ready!');
                    
                    // Now speak the data
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
        
        const message = `Hi! I'm Tess. I just finished the audit for ${data.url}. It looks like you're losing around ${data.loss} per month in PPC waste. That's exactly what I'm built to fix. Would you like to see how we can recover that revenue?`;

        console.log('[Tess Bridge] Speaking:', message);

        try {
            if (typeof this.widget.sendMessage === 'function') {
                this.widget.sendMessage(message);
                
                // 👇 FORCE HIDE BUBBLES AGAIN AFTER SPEAKING
                setTimeout(() => this.forceHideBubbles(), 100);
            }
        } catch (e) {
            console.error('[Tess Bridge] Speech error', e);
        }
    }

    // --- UI CONTROLS ---
    setupTessControls() {
        // Pause when image is clicked
        const tessImage = document.querySelector('#tess-image-link img');
        if (tessImage) {
            tessImage.addEventListener('click', (e) => {
                console.log('[Tess Bridge] Image clicked - pausing');
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
                    console.log('[Tess Bridge] Blocking Escape from widget');
                    e.stopPropagation();
                }
            }
        }, true);
    }

    // --- BUBBLE HIDING (AGGRESSIVE) ---
    hideTextBubbles() {
        // Inject CSS immediately
        const style = document.createElement('style');
        style.id = 'tess-bubble-killer';
        style.innerHTML = `
            lemon-slice-widget [class*="bubble"],
            lemon-slice-widget [class*="message"],
            lemon-slice-widget [class*="chat"],
            .message-bubble, .text-bubble, .speech-bubble {
                display: none !important; visibility: hidden !important; opacity: 0 !important;
            }
        `;
        document.head.appendChild(style);

        // Force hide periodically
        this.forceHideBubbles();
        setInterval(() => this.forceHideBubbles(), 1000);
    }

    forceHideBubbles() {
        if (!this.widget) return;
        
        // Hide in Shadow DOM
        if (this.widget.shadowRoot) {
            this.widget.shadowRoot.querySelectorAll('[class*="bubble"], [class*="message"]').forEach(el => {
                el.style.display = 'none';
                el.style.visibility = 'hidden';
            });
        }
    }
}

// Initialize
new TessBridge();
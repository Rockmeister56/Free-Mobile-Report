// tess-bridge.js - ULTIMATE HYBRID VERSION
// Keeps the UI controls you built, but fixes the "Speaking" logic

class TessBridge {
    constructor() {
        this.widget = document.querySelector('lemon-slice-widget');
        this.tessReady = false;

        if (document.readyState === 'complete') {
            this.init();
        } else {
            document.addEventListener('DOMContentLoaded', () => this.init());
        }
    }

    init() {
        console.log('[Tess Bridge] Initialized');
        
        // 1. Setup UI interactions (Pause/Resume)
        this.setupTessControls();
        this.setupEscapeProtection();
        
        // 2. Hide text bubbles
        this.hideTextBubbles();

        // 3. Prepare Widget and Speak
        setTimeout(() => {
            this.prepareWidget();
        }, 1000);
    }

    // --- CORE FIX: READ FROM DOM ---
    getAuditData() {
        // Read directly from the page elements the user sees
        const lossEl = document.getElementById('lossAmount');
        const urlEl = document.getElementById('urlDisplay');

        // Fallback to localStorage if elements missing
        const lossText = lossEl ? lossEl.textContent : (localStorage.getItem('monthlyLoss') || '$5,000');
        const urlText = urlEl ? urlEl.textContent : (localStorage.getItem('lastScannedUrl') || 'your website');

        // Clean up URL text (remove prefixes)
        const cleanUrl = urlText.replace('Website: ', '').replace('Scanning: ', '');

        return {
            loss: lossText, // Let the TTS engine read the $ sign naturally
            url: cleanUrl
        };
    }

    // --- CORE FIX: WAIT AND SPEAK ---
    async prepareWidget() {
        if (!this.widget) return;

        // Ensure widget is active
        this.widget.setAttribute('controlled-widget-state', 'active');

        // Wait for the API to be ready
        let attempts = 0;
        while (typeof this.widget.sendMessage !== 'function' && attempts < 10) {
            await new Promise(r => setTimeout(r, 500));
            attempts++;
        }

        if (typeof this.widget.sendMessage === 'function') {
            this.tessReady = true;
            this.speakAuditData();
        } else {
            console.warn('[Tess Bridge] Widget API not available');
        }
    }

    speakAuditData() {
        if (!this.tessReady) return;

        const data = this.getAuditData();
        
        // Simple, natural message
        const message = `Hi! I'm Tess. I just finished the audit for ${data.url}. It looks like you're losing around ${data.loss} per month in PPC waste. That's exactly what I'm built to fix. Would you like to see how we can recover that revenue?`;

        console.log('[Tess Bridge] Speaking:', message);

        try {
            this.widget.sendMessage(message);
            // Hide bubbles again after speaking
            setTimeout(() => this.forceHideBubbles(), 100);
        } catch (e) {
            console.error('[Tess Bridge] Speech error', e);
        }
    }

    // --- UI CONTROLS (RESTORED) ---
    
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

    resumeTess() {
        if (this.widget) {
            if (typeof this.widget.unmute === 'function') this.widget.unmute();
            this.widget.setAttribute('muted', 'false');
            this.widget.style.opacity = '1';
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

    // --- BUBBLE HIDING (RESTORED) ---

    hideTextBubbles() {
        this.forceHideBubbles();
        const observer = new MutationObserver(() => this.forceHideBubbles());
        observer.observe(document.body, { childList: true, subtree: true });
    }

    forceHideBubbles() {
        const selectors = '[class*="bubble"], [class*="message"], [class*="chat"], .message-bubble, .text-bubble';
        document.querySelectorAll(selectors).forEach(el => {
            el.style.cssText = 'display: none !important; visibility: hidden !important;';
        });
        if (this.widget?.shadowRoot) {
            this.widget.shadowRoot.querySelectorAll(selectors).forEach(el => {
                el.style.cssText = 'display: none !important; visibility: hidden !important;';
            });
        }
    }
}

// Initialize
new TessBridge();
// tess-bridge.js - FINAL UI FIX
// Designed to work with the 'hide-ui' attribute

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
        
        // 1. Setup UI interactions
        this.setupTessControls();
        this.setupEscapeProtection();

        // 2. Run the Auto-Fix sequence
        this.autoFixTess();
    }

    // --- DATA LOGIC: READ FROM SCREEN ---
    getAuditData() {
        // 1. Try to read what the USER sees on the screen
        const lossEl = document.getElementById('lossAmount');
        const urlEl = document.getElementById('urlDisplay');

        // 2. Fallback to localStorage if DOM isn't ready
        const lossText = lossEl ? lossEl.textContent : (localStorage.getItem('monthlyLoss') || '$5,000');
        const urlText = urlEl ? urlEl.textContent : (localStorage.getItem('lastScannedUrl') || 'your website');

        // 3. Clean up URL text
        const cleanUrl = urlText.replace('Website: ', '').replace('Scanning: ', '');

        return {
            loss: lossText, 
            url: cleanUrl
        };
    }

    // --- WIDGET CONTROL ---
    autoFixTess() {
        console.log('[Tess Bridge] Auto-fixing Tess...');
        
        setTimeout(() => {
            if (!this.widget) {
                console.warn('[Tess Bridge] Widget not ready, retrying...');
                setTimeout(() => this.autoFixTess(), 2000);
                return;
            }
            
            // Ensure active state
            this.widget.setAttribute('controlled-widget-state', 'active');
            
            // Prepare mic and volume
            setTimeout(async () => {
                try {
                    // 1. Turn on Mic
                    await this.widget.micOn?.();
                    
                    // 2. Unmute
                    await this.widget.unmute?.();
                    
                    console.log('[Tess Bridge] ✅ Tess ready!');
                    
                    // 3. Speak Data
                    this.speakAuditData();
                    
                } catch (error) {
                    console.warn('[Tess Bridge] Partial success:', error);
                }
            }, 1500);
            
        }, 1000);
    }

    // --- SPEECH LOGIC ---
    speakAuditData() {
        const data = this.getAuditData();
        
        const message = `Hi! I'm Tess. I just finished the audit for ${data.url}. It looks like you're losing around ${data.loss} per month in PPC waste. That's exactly what I'm built to fix. Would you like to see how we can recover that revenue?`;

        console.log('[Tess Bridge] Speaking:', message);

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
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        window.tessBridge = new TessBridge();
    }, 2000);
});
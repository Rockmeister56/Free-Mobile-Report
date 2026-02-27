// tess-bridge.js - SURGICAL FIX
// Modeled after your working TV Network Bridge
// No aggressive DOM hacking, proper async/await flow

class TessBridge {
    constructor() {
        this.widget = document.querySelector('lemon-slice-widget');
        this.isMicOn = false;
        this.isMuted = false;
        this.init();
    }

    init() {
        console.log('[Tess Bridge] Initialized');
        
        // 1. Run the Auto-Fix sequence (Mic/Volume/Speak)
        this.autoFixTess();
        
        // 2. Setup Controls
        this.setupTessControls();
        this.setupEscapeProtection();
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

    // --- WIDGET CONTROL: GENTLE & EFFECTIVE ---
    autoFixTess() {
        console.log('[Tess Bridge] Preparing Tess...');
        
        setTimeout(() => {
            if (!this.widget) {
                console.warn('[Tess Bridge] Widget not ready, retrying...');
                setTimeout(() => this.autoFixTess(), 2000);
                return;
            }
            
            // Force proper state
            this.widget.setAttribute('controlled-widget-state', 'active');
            
            // Prepare mic and volume
            setTimeout(async () => {
                try {
                    // 1. Turn on Mic (Starts the room)
                    await this.widget.micOn?.();
                    
                    // 2. Unmute (Ensures volume)
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
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        window.tessBridge = new TessBridge();
    }, 2000);
});
// tess-bridge.js - NUCLEAR EDITION
// Fixes: 1. Right Numbers, 2. Volume Up, 3. NO Text Bubbles (Aggressive)

class TessBridge {
    constructor() {
        this.widget = document.querySelector('lemon-slice-widget');
        this.tessReady = false;

        // Run init
        if (document.readyState === 'complete') {
            this.init();
        } else {
            document.addEventListener('DOMContentLoaded', () => this.init());
        }
    }

    init() {
        console.log('[Tess Bridge] Initializing...');
        
        // 1. Inject CSS Killer
        this.injectBubbleKiller();

        // 2. Setup UI Listeners
        this.setupTessControls();
        this.setupEscapeProtection();

        // 3. Run the Auto-Fix sequence
        this.autoFixTess();
    }

    // 🛑 NEW: INJECT CSS
    injectBubbleKiller() {
        const style = document.createElement('style');
        style.innerHTML = `
            lemon-slice-widget [class*="bubble"], lemon-slice-widget [class*="message"] {
                display: none !important; visibility: hidden !important; opacity: 0 !important;
            }
        `;
        document.head.appendChild(style);
    }

    // 🛑 NEW: NUCLEAR SHADOW DOM CLEANUP
    // This physically removes bubble elements from the Shadow DOM
    nukeBubbles() {
        if (!this.widget) return;

        // 1. Try to access Shadow DOM
        if (this.widget.shadowRoot) {
            const bubbles = this.widget.shadowRoot.querySelectorAll('[class*="bubble"], [class*="message"], [class*="text"]');
            bubbles.forEach(el => {
                el.style.display = 'none';
                el.style.visibility = 'hidden';
                // Optional: Remove it entirely from existence
                // el.remove(); 
            });
        }

        // 2. Also check the light DOM (sometimes they render there)
        const lightBubbles = this.widget.querySelectorAll('[class*="bubble"], [class*="message"]');
        lightBubbles.forEach(el => {
            el.style.display = 'none';
        });
    }

    // --- DATA LOGIC ---
    getAuditData() {
        const lossEl = document.getElementById('lossAmount');
        const urlEl = document.getElementById('urlDisplay');

        const lossText = lossEl ? lossEl.textContent : (localStorage.getItem('monthlyLoss') || '$5,000');
        const urlText = urlEl ? urlEl.textContent : (localStorage.getItem('lastScannedUrl') || 'your website');
        const cleanUrl = urlText.replace('Website: ', '').replace('Scanning: ', '');

        return { loss: lossText, url: cleanUrl };
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
            
            // Force proper state
            this.widget.setAttribute('controlled-widget-state', 'active');
            
            // 👇 RUN NUKER NOW
            this.nukeBubbles();
            
            // Prepare mic and volume
            setTimeout(async () => {
                try {
                    await this.widget.micOn?.();
                    await this.widget.unmute?.();
                    
                    this.tessReady = true;
                    console.log('[Tess Bridge] ✅ Tess ready!');
                    
                    // Speak
                    this.speakAuditData();
                    
                    // Nuke bubbles again after speaking
                    setTimeout(() => this.nukeBubbles(), 100);
                    
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
            tessImage.addEventListener('click', (e) => this.pauseTess());
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
                if (anyOverlayVisible) e.stopPropagation();
            }
        }, true);
    }
}

// Initialize
new TessBridge();

// 🚀 LAUNCH THE NUKER EVERY 500ms
// This is the "Overkill" part. It checks constantly for bubbles and kills them.
setInterval(() => {
    const bridge = window.tessBridge || new TessBridge();
    bridge.nukeBubbles();
}, 500);
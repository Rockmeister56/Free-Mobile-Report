// tess-bridge.js - FINAL POLISHED VERSION
// Features: Natural Speech ("Five thousand four hundred dollars"), Proper Minimize

class TessBridge {
    constructor() {
        this.widget = document.querySelector('lemon-slice-widget');
        this.tessReady = false;
        this.isMuted = false; 

        if (document.readyState === 'complete') {
            this.init();
        } else {
            document.addEventListener('DOMContentLoaded', () => this.init());
        }
    }

    init() {
        console.log('[Tess Bridge] Initialized');
        
        this.setupTessControls();
        this.setupEscapeProtection();
        this.setupExternalControls();
        this.autoFixTess();
    }

    // --- EXTERNAL CONTROLS ---
    setupExternalControls() {
        setTimeout(() => {
            const panel = document.getElementById('tess-control-panel');
            if (panel) panel.style.opacity = '1';
        }, 3000);

        // MUTE BUTTON
        const muteBtn = document.getElementById('tess-mute-btn');
        if (muteBtn) {
            muteBtn.addEventListener('click', async () => {
                if (this.isMuted) {
                    await this.widget.unmute?.();
                    this.isMuted = false;
                    muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
                    muteBtn.style.borderColor = '#0066cc';
                } else {
                    await this.widget.mute?.();
                    this.isMuted = true;
                    muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
                    muteBtn.style.borderColor = '#ff9900';
                }
            });
        }

        // STOP BUTTON - FIXED TO MINIMIZE PROPERLY
        const stopBtn = document.getElementById('tess-stop-btn');
        if (stopBtn) {
            stopBtn.addEventListener('click', async () => {
                console.log('[Tess Bridge] Stop clicked - Minimizing');
                
                try {
                    // Try to stop speech if method exists
                    if (typeof this.widget.interrupt === 'function') {
                        await this.widget.interrupt();
                    }
                } catch (e) {
                    // Ignore errors
                }

                // 1. Turn off Mic (Stop listening)
                await this.widget.micOff?.();

                // 2. SET TO MINIMIZED (She goes to corner, stays visible)
                this.widget.setAttribute('controlled-widget-state', 'minimized');
                
                // 3. Hide control panel
                const panel = document.getElementById('tess-control-panel');
                if (panel) panel.style.display = 'none';
                
                // 4. Show restart button
                this.showRestartButton();
            });
        }
    }

    showRestartButton() {
        if (document.getElementById('tess-restart-btn')) return;

        const restartBtn = document.createElement('button');
        restartBtn.id = 'tess-restart-btn';
        restartBtn.innerHTML = '<i class="fas fa-play"></i>';
        restartBtn.title = "Resume Tess";
        restartBtn.style.cssText = `
            position: fixed; bottom: 20px; right: 20px;
            width: 50px; height: 50px; border-radius: 50%;
            border: 2px solid #00cc66; background: rgba(0,0,0,0.8);
            color: white; cursor: pointer; z-index: 9998;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        `;

        restartBtn.addEventListener('click', async () => {
            // 1. Restore widget to active
            this.widget.setAttribute('controlled-widget-state', 'active');
            
            // 2. Turn mic back on
            await this.widget.micOn?.();

            // 3. Unmute
            await this.widget.unmute?.();
            
            // 4. Show controls again
            const panel = document.getElementById('tess-control-panel');
            if (panel) panel.style.display = 'flex';
            
            restartBtn.remove();
        });

        document.body.appendChild(restartBtn);
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

    // --- FIX #2: NATURAL SPEECH LOGIC ---
    formatNumberForSpeech(text) {
        // 1. Remove $ and commas so TTS doesn't read "dollar sign"
        // Input: "$5,430" -> Output: "5430"
        const cleanNum = text.replace(/[$,]/g, '');
        
        // 2. Convert to words (simple version)
        const num = parseFloat(cleanNum);
        if (isNaN(num)) return text; // Safety check

        // Simple spoken converter
        const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
        const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
        const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

        function toWords(n) {
            if (n < 10) return ones[n];
            if (n < 20) return teens[n - 10];
            if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + ones[n % 10] : '');
            if (n < 1000) return ones[Math.floor(n / 100)] + ' hundred' + (n % 100 !== 0 ? ' ' + toWords(n % 100) : '');
            if (n < 1000000) return ones[Math.floor(n / 1000)] + ' thousand' + (n % 1000 !== 0 ? ' ' + toWords(n % 1000) : '');
            return n.toString();
        }

        // Returns "five thousand four hundred thirty"
        return toWords(Math.floor(num));
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
            
            this.widget.setAttribute('controlled-widget-state', 'active');
            
            setTimeout(async () => {
                try {
                    await this.widget.micOn?.();
                    await this.widget.unmute?.();
                    
                    console.log('[Tess Bridge] ✅ Tess ready!');
                    this.speakAuditData();
                    
                } catch (error) {
                    console.warn('[Tess Bridge] Partial success:', error);
                }
            }, 1500);
            
        }, 1000);
    }

                  speakAuditData() {
        const data = this.getAuditData();
        
        // FORMAT THE NUMBER
        const spokenLoss = this.formatNumberForSpeech(data.loss);
        
        // Construct message: Intro + Name Request + Pivot
        const message = `Hi! I'm Tess your Smart AI Guide here to help you get the most from your audit for ${data.url}. It looks like you're losing around ${spokenLoss} dollars per month in PPC waste. Before we get into your audit report, can I get your name please?`;

        console.log('[Tess Bridge] Speaking:', message);

        try {
            if (typeof this.widget.sendMessage === 'function') {
                this.widget.sendMessage(message);
            }
        } catch (e) {
            console.error('[Tess Bridge] Speech error', e);
        }
    }

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
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        window.tessBridge = new TessBridge();
    }, 2000);
});
// tess-bridge.js - FINAL PRODUCTION VERSION
// Features: Hide-UI Compatible, Natural Speech, External Controls

class TessBridge {
    constructor() {
        this.widget = document.querySelector('lemon-slice-widget');
        this.tessReady = false;
        this.isMuted = false; // Track mute state

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

        // 👇 FIX #1: We were missing this line! It tells the bridge to run the button setup.
        this.setupExternalControls();

        // 2. Run the Auto-Fix sequence
        this.autoFixTess();
    }

    // --- NEW FUNCTION: FLOATING CONTROLS ---
    setupExternalControls() {
        // Show the control panel with a fade-in
        setTimeout(() => {
            const panel = document.getElementById('tess-control-panel');
            if (panel) {
                panel.style.opacity = '1';
                console.log('[Tess Bridge] Control panel visible');
            } else {
                console.warn('[Tess Bridge] Control panel HTML not found!');
            }
        }, 3000);

        // MUTE BUTTON LOGIC
        const muteBtn = document.getElementById('tess-mute-btn');
        if (muteBtn) {
            muteBtn.addEventListener('click', async () => {
                if (this.isMuted) {
                    // Unmute
                    await this.widget.unmute?.();
                    this.isMuted = false;
                    muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
                    muteBtn.style.borderColor = '#0066cc'; // Blue
                } else {
                    // Mute
                    await this.widget.mute?.();
                    this.isMuted = true;
                    muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
                    muteBtn.style.borderColor = '#ff9900'; // Orange when muted
                }
            });
        }

        // STOP BUTTON LOGIC
        const stopBtn = document.getElementById('tess-stop-btn');
        if (stopBtn) {
            stopBtn.addEventListener('click', async () => {
                console.log('[Tess Bridge] Stop clicked');
                
                // 1. Turn off the mic (Stops her from listening/processing)
                await this.widget.micOff?.();
                
                // 2. Hide the widget completely (Better than minimized for this state)
                this.widget.setAttribute('controlled-widget-state', 'hidden');
                
                // 3. Hide the control panel
                const panel = document.getElementById('tess-control-panel');
                if (panel) panel.style.display = 'none';
                
                // 4. Show the restart button
                this.showRestartButton();
            });
        }
    }

    // Helper to show a tiny restart button if they stop her
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
            // 1. Turn mic back on
            await this.widget.micOn?.();
            
            // 2. Restore widget
            this.widget.setAttribute('controlled-widget-state', 'active');
            
            // 3. Show controls again
            const panel = document.getElementById('tess-control-panel');
            if (panel) panel.style.display = 'flex';
            
            // 4. Remove this restart button
            restartBtn.remove();
        });

        document.body.appendChild(restartBtn);
    }

    // --- DATA LOGIC: READ FROM SCREEN ---
    getAuditData() {
        const lossEl = document.getElementById('lossAmount');
        const urlEl = document.getElementById('urlDisplay');

        // Fallback to localStorage if DOM isn't ready
        const lossText = lossEl ? lossEl.textContent : (localStorage.getItem('monthlyLoss') || '$5,000');
        const urlText = urlEl ? urlEl.textContent : (localStorage.getItem('lastScannedUrl') || 'your website');

        // Clean up URL text
        const cleanUrl = urlText.replace('Website: ', '').replace('Scanning: ', '');

        return {
            loss: lossText, 
            url: cleanUrl
        };
    }

    // --- FIX #2: NATURAL NUMBER PRONUNCIATION ---
    // This converts "$5,830" into "five thousand, eight hundred thirty"
    // so she sounds more natural and less robotic.
    formatNumberForSpeech(text) {
        // Extract number from text like "$5,830" or "$1200"
        const cleanText = text.replace(/[$,]/g, ''); // Remove $ and commas
        const num = parseFloat(cleanText);

        if (isNaN(num)) return text; // If not a number, return original

        // Simple number to words converter
        const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
        const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
        const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

        if (num === 0) return 'zero';

        function numToWords(n) {
            if (n < 10) return ones[n];
            if (n < 20) return teens[n - 10];
            if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? '-' + ones[n % 10] : '');
            if (n < 1000) return ones[Math.floor(n / 100)] + ' hundred' + (n % 100 !== 0 ? ' and ' + numToWords(n % 100) : '');
            if (n < 1000000) return ones[Math.floor(n / 1000)] + ' thousand' + (n % 1000 !== 0 ? ' ' + numToWords(n % 1000) : '');
            return n.toString(); // Fallback for millions
        }

        return numToWords(Math.floor(num)) + (num % 1 !== 0 ? ' point ' + num.toString().split('.')[1] : '');
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

    // --- SPEECH LOGIC ---
    speakAuditData() {
        const data = this.getAuditData();
        
        // 👇 FORMAT THE NUMBER FOR NATURAL SPEECH
        const spokenLoss = this.formatNumberForSpeech(data.loss);
        
        // Construct message using the SPOKEN version of the number
        const message = `Hi! I'm Tess. I just finished the audit for ${data.url}. It looks like you're losing around ${spokenLoss} dollars per month in PPC waste. That's exactly what I'm built to fix. Would you like to see how we can recover that revenue?`;

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
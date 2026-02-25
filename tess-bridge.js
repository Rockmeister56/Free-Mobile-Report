// tess-bridge.js - Complete Tess Controller with Page Analysis
class TessBridge {
    constructor() {
        this.widget = document.querySelector('lemon-slice-widget');
        this.isMicOn = false;
        this.isMuted = false;
        this.isWidgetActive = true;
        this.tessReady = false;
        
        // Page analysis data
        this.auditData = {
            lossAmount: document.getElementById('lossAmount')?.textContent || '$5,000+',
            issueCount: document.querySelectorAll('.problem-item').length || 13,
            url: document.getElementById('urlDisplay')?.textContent || 'your site',
            problems: []
        };
        
        // Collect specific problems
        document.querySelectorAll('.problem-item').forEach(item => {
            this.auditData.problems.push(item.textContent.trim());
        });
        
        this.init();
    }

    // 🔥 SETUP BUTTON ACTIVATION
setupButtonActivation() {
    const tessButton = document.getElementById('tess-activator');
    
    if (!tessButton) {
        console.warn('[Tess Bridge] Button not found - check ID');
        return;
    }
    
    tessButton.addEventListener('click', async () => {
        try {
            console.log('[Tess Bridge] Button clicked');

             // 👇 ADD THESE 3 LINES HERE - REPLACING OLD DATA COLLECTION
            const auditData = window.latestAuditData || {};
            const freshLoss = auditData.loss || '$5,000+';
            const freshIssues = auditData.issues || 13;
            
            // Enlarge widget
            this.widget.style.width = '400px';
            this.widget.style.height = '600px';
            
            // Activate
            this.widget.setAttribute('controlled-widget-state', 'active');
            await new Promise(r => setTimeout(r, 800));
            
            if (typeof this.widget.activate === 'function') {
                await this.widget.activate();
            }
            
            // Mic on
            if (typeof this.widget.micOn === 'function') {
                await this.widget.micOn();
            }
            
            // Volume up
            if (typeof this.widget.volumeOn === 'function') {
                await this.widget.volumeOn();
            } else if (typeof this.widget.setVolume === 'function') {
                await this.widget.setVolume(1.0);
            }
            
            // Force attributes
            this.widget.setAttribute('mic-enabled', 'true');
            this.widget.setAttribute('volume-enabled', 'true');
            this.widget.setAttribute('muted', 'false');
            
            // Hide bubbles
            this.forceHideBubbles();
            
            // Send message
            setTimeout(() => {
                if (typeof this.widget.sendMessage === 'function') {
                    const formattedLoss = this.formatCurrency(freshLoss);
                    
                    let message = `Hi! I'm Tess. `;
                    message += `I just saw your PPC audit shows ${formattedLoss} `;
                    message += `in monthly waste from ${freshIssues} critical problems. `;
                    message += `That mobile conversion loss? I'm built to fix exactly that. `;
                    message += `Want to see how I can 5X your qualified leads starting tonight?`;
                    
                    this.widget.sendMessage(message);
                }
            }, 500);
            
        } catch (error) {
            console.error('[Tess Bridge] Error:', error);
        }
    });
}

    init() {
        console.log('[Tess Bridge] Initialized - Avatar Controls Only');
        console.log('[Tess Bridge] Audit Data:', this.auditData);
        
        // Store for other scripts
        window.tessAuditData = this.auditData;
        
        // Core fixes
        this.autoFixTess();
        this.setupEscapeProtection();
        this.setupClickHandler();
        this.hideTextBubbles();

          // 👈 ADD THIS LINE
    this.setupButtonActivation();
        
    }
    
    // 🔥 CRITICAL: Hide ALL text bubbles permanently
    hideTextBubbles() {
        // Immediate hide
        this.forceHideBubbles();
        
        // Keep hiding them as they appear
        const observer = new MutationObserver(() => {
            this.forceHideBubbles();
        });
        
        observer.observe(document.body, { childList: true, subtree: true });
        
        // Also watch shadow DOM
        setTimeout(() => {
            if (this.widget?.shadowRoot) {
                observer.observe(this.widget.shadowRoot, { childList: true, subtree: true });
            }
        }, 2000);
    }
    
    forceHideBubbles() {
        // Hide in main document
        document.querySelectorAll(
            '[class*="bubble"], [class*="message"], [class*="chat"], ' +
            '.message-bubble, .chat-bubble, .text-bubble, ' +
            '.agent-message, .speech-bubble'
        ).forEach(el => {
            el.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important;';
        });
        
        // Hide in widget shadow DOM
        if (this.widget?.shadowRoot) {
            this.widget.shadowRoot.querySelectorAll(
                '[class*="bubble"], [class*="message"], [class*="chat"]'
            ).forEach(el => {
                el.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important;';
            });
        }
    }
    
    // 🔥 Format currency for natural speech
    formatCurrency(amount) {
        // Extract numbers only
        const numStr = amount.replace(/[^0-9]/g, '');
        const num = parseInt(numStr);
        
        if (isNaN(num)) return amount;
        
        if (num >= 1000) {
            const thousands = num / 1000;
            if (Number.isInteger(thousands)) {
                return `${thousands} thousand dollars`;
            } else {
                return `${thousands.toFixed(1)} thousand dollars`;
            }
        }
        return `${num} dollars`;
    }
    
    // 🔥 CLICK HANDLER: Enlarge and speak
    setupClickHandler() {
        const tessImage = document.getElementById('tess-activator');
        if (!tessImage) return;
        
        tessImage.addEventListener('click', async () => {
            try {
                // Enlarge widget
                this.widget.style.width = '400px';
                this.widget.style.height = '600px';
                
                // Activate
                this.widget.setAttribute('controlled-widget-state', 'active');
                await new Promise(r => setTimeout(r, 800));
                
                if (typeof this.widget.activate === 'function') {
                    await this.widget.activate();
                }
                
                // Turn on mic
                if (typeof this.widget.micOn === 'function') {
                    await this.widget.micOn();
                }
                
                // Volume up
                if (typeof this.widget.volumeOn === 'function') {
                    await this.widget.volumeOn();
                } else if (typeof this.widget.setVolume === 'function') {
                    await this.widget.setVolume(1.0);
                }
                
                // Set attributes
                this.widget.setAttribute('mic-enabled', 'true');
                this.widget.setAttribute('volume-enabled', 'true');
                this.widget.setAttribute('muted', 'false');
                
                // Force hide bubbles again
                this.forceHideBubbles();
                
                // Send personalized message with formatted currency
                setTimeout(() => {
                    if (typeof this.widget.sendMessage === 'function') {
                        const formattedLoss = this.formatCurrency(this.auditData.lossAmount);
                        
                        let message = `Hi! I'm Tess. `;
                        message += `I just saw your PPC audit shows ${formattedLoss} `;
                        message += `in monthly waste from ${this.auditData.issueCount} critical problems. `;
                        
                        if (this.auditData.problems.length > 0) {
                            message += `Especially the "${this.auditData.problems[0]}" issue. `;
                        }
                        
                        message += `That mobile conversion loss? I'm built to fix exactly that. `;
                        message += `Want to see how I can 5X your qualified leads starting tonight?`;
                        
                        this.widget.sendMessage(message);
                    }
                }, 500);
                
                this.showNotification('✅ Tess activated!', 'success');
                
            } catch (error) {
                console.error('[Tess Bridge] Activation error:', error);
                this.showNotification('❌ Activation failed', 'error');
            }
        });
    }
    
    // 🔥 ESCAPE PROTECTION: Prevent widget from stealing Escape key
    setupEscapeProtection() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' || e.keyCode === 27) {
                // Check if any overlay is visible
                const anyOverlayVisible = document.querySelector('.modal, .popup, [class*="overlay"]');
                
                if (anyOverlayVisible) {
                    console.log('[Tess Bridge] Blocking Escape from widget');
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                }
            }
        }, true);
    }
    
    // 🔥 VISUAL INDICATOR - Now in header
    addTessIndicator() {
        // Find the header or create a place for it
        const header = document.querySelector('.tess-header') || document.querySelector('header') || document.body;
        
        const indicator = document.createElement('div');
        indicator.id = 'tess-status-indicator';
        indicator.style.cssText = `
            display: inline-block;
            margin-left: 15px;
            padding: 6px 15px;
            border-radius: 30px;
            font-size: 14px;
            font-weight: bold;
            background: rgba(255,68,68,0.9);
            color: white;
            border: 1px solid rgba(255,255,255,0.3);
            vertical-align: middle;
        `;
        
        // Format the loss amount nicely
        const formattedLoss = this.formatCurrency(this.auditData.lossAmount);
        indicator.innerHTML = `🔴 Tess Active · ${formattedLoss} saved`;
        
        // Find the header title/name to insert next to
        const headerTitle = document.querySelector('.tess-name, h1');
        if (headerTitle) {
            headerTitle.appendChild(indicator);
        } else {
            // Fallback - add to top of page
            document.body.insertBefore(indicator, document.body.firstChild);
        }
        
        this.indicator = indicator;
    }
    
    updateTessIndicator() {
        if (!this.indicator) return;
        
        const formattedLoss = this.formatCurrency(this.auditData.lossAmount);
        this.indicator.style.background = 'rgba(0,204,0,0.9)';
        this.indicator.innerHTML = `✅ Tess Active · ${formattedLoss} recovered`;
    }
    
    // 🔥 NOTIFICATION HELPER
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#00cc00' : type === 'error' ? '#ff4444' : '#0088ff'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 9999;
            font-family: Arial, sans-serif;
            font-size: 14px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            animation: slideIn 0.3s ease;
        `;
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
        
        // Add animation styles
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// Initialize Tess Bridge
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        window.tessBridge = new TessBridge();
        console.log('[Tess Bridge] READY - Text bubbles suppressed');
        console.log('[Tess Bridge] Analyzing:', window.tessBridge.auditData);
    }, 2000);
});

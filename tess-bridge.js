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
        
        // Add visual indicator
        this.addTessIndicator();
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
    
    // 🔥 AUTO-FIX: Prepare Tess on load
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
                    await this.widget.micOn?.();
                    await this.widget.unmute?.();
                    
                    this.tessReady = true;
                    console.log('[Tess Bridge] ✅ Tess ready!');
                    this.updateTessIndicator();
                    
                } catch (error) {
                    console.warn('[Tess Bridge] Partial success:', error);
                }
            }, 1500);
            
        }, 1000);
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
                
                // Send personalized message
                setTimeout(() => {
                    if (typeof this.widget.sendMessage === 'function') {
                        let message = `Hi! I'm Tess. `;
                        message += `I just saw your PPC audit shows ${this.auditData.lossAmount} `;
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
    
    // 🔥 VISUAL INDICATOR
    addTessIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'tess-status-indicator';
        indicator.style.cssText = `
            position: fixed;
            bottom: 350px;
            right: 30px;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            z-index: 10000;
            background: rgba(255,68,68,0.9);
            color: white;
            border: 1px solid rgba(255,255,255,0.3);
            cursor: pointer;
            transition: all 0.3s;
        `;
        
        indicator.innerHTML = `🔴 Tess · $${this.auditData.lossAmount}`;
        indicator.title = 'Click to prepare Tess';
        
        indicator.onclick = () => {
            this.autoFixTess();
        };
        
        document.body.appendChild(indicator);
        this.indicator = indicator;
    }
    
    updateTessIndicator() {
        if (!this.indicator) return;
        
        this.indicator.style.background = 'rgba(0,204,0,0.9)';
        this.indicator.innerHTML = `✅ Tess · $${this.auditData.lossAmount}`;
        this.indicator.title = 'Tess ready';
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
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

    // 🔥 GET AUDIT DATA FROM LOCALSTORAGE
getAuditData() {
    try {
        const loss = localStorage.getItem('tess_loss') || '$5,000+';
        const issues = localStorage.getItem('tess_issues') || '13';
        
        // Format the loss properly
        let formattedLoss = loss;
        const numStr = loss.replace(/[^0-9.]/g, '');
        const num = parseFloat(numStr);
        
        if (!isNaN(num)) {
            if (num >= 1000) {
                const thousands = (num / 1000).toFixed(1);
                formattedLoss = `${thousands} thousand dollars`;
            } else {
                formattedLoss = `${num} dollars`;
            }
        }
        
        return {
            raw: loss,
            formatted: formattedLoss,
            issues: issues
        };
    } catch (e) {
        console.warn('[Tess Bridge] Error reading audit data:', e);
        return {
            raw: '$5,000+',
            formatted: 'five thousand dollars',
            issues: '13'
        };
    }
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

        // 👇 ADD THIS LINE
    this.setupTessControls();
        
    }

    // Inside your TessBridge class, add this method:

// 🔥 CONTROL TESS FROM BUTTONS
setupTessControls() {
    // Pause Tess when image is clicked
    const tessImage = document.querySelector('#tess-image-link img');
    if (tessImage) {
        tessImage.addEventListener('click', (e) => {
            console.log('[Tess Bridge] Image clicked - pausing Tess');
            
            if (this.widget) {
                // Mute Tess
                if (typeof this.widget.mute === 'function') {
                    this.widget.mute();
                }
                this.widget.setAttribute('muted', 'true');
                this.widget.setAttribute('volume-enabled', 'false');
                this.widget.style.opacity = '0.7';
                
                // Show pause indicator
                this.showPauseIndicator();
            }
        });
    }
    
    // Resume with AI Assistant button
    const aiAssistantBtn = document.getElementById('aiAssistantBtn');
    if (aiAssistantBtn) {
        aiAssistantBtn.addEventListener('click', () => {
            console.log('[Tess Bridge] AI Assistant clicked - resuming Tess');
            
            if (this.widget) {
                if (typeof this.widget.unmute === 'function') {
                    this.widget.unmute();
                }
                this.widget.setAttribute('muted', 'false');
                this.widget.setAttribute('volume-enabled', 'true');
                this.widget.style.opacity = '1';
            }
        });
    }
    
    // Schedule call button - minimize Tess
    const scheduleCallBtn = document.getElementById('scheduleCallBtn');
    if (scheduleCallBtn) {
        scheduleCallBtn.addEventListener('click', () => {
            console.log('[Tess Bridge] Schedule call - minimizing Tess');
            if (this.widget) {
                this.widget.setAttribute('controlled-widget-state', 'minimized');
            }
        });
    }
    
    // Close modal - restore Tess
    const closeModalBtn = document.getElementById('closeAIModal');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            console.log('[Tess Bridge] Modal closed - restoring Tess');
            if (this.widget) {
                this.widget.setAttribute('controlled-widget-state', 'active');
            }
        });
    }
}

// Helper for pause indicator
showPauseIndicator() {
    let indicator = document.getElementById('tess-paused-indicator');
    if (!indicator) {
        indicator = document.createElement('div');
        indicator.id = 'tess-paused-indicator';
        indicator.style.cssText = `
            position: fixed;
            bottom: 350px;
            right: 30px;
            background: rgba(0,0,0,0.7);
            color: white;
            padding: 4px 10px;
            border-radius: 20px;
            font-size: 12px;
            z-index: 10001;
            border: 1px solid #3b82f6;
        `;
        indicator.textContent = '⏸️ Tess paused';
        document.body.appendChild(indicator);
        
        setTimeout(() => {
            if (indicator) indicator.remove();
        }, 2000);
    }
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
                
                // 👇 GET DATA FROM LOCALSTORAGE (PREFERRED) OR DOM
                const storedLoss = localStorage.getItem('tess_loss');
                const storedIssues = localStorage.getItem('tess_issues');
                
                // Use stored data or fallback to DOM
                let lossAmount = storedLoss || document.getElementById('lossAmount')?.textContent || '$5,000+';
                let issueCount = storedIssues || document.querySelectorAll('.problem-item').length || 13;
                
                // 👇 FORMAT THE NUMBER PROPERLY
                let formattedLoss = lossAmount;
                const numStr = lossAmount.replace(/[^0-9.]/g, '');
                const num = parseFloat(numStr);
                
                if (!isNaN(num)) {
                    if (num >= 1000) {
                        const thousands = (num / 1000).toFixed(1);
                        formattedLoss = `${thousands} thousand dollars`;
                    } else {
                        formattedLoss = `${num} dollars`;
                    }
                }
                
                // 👇 BUILD AND SEND MESSAGE
                const message = `Hi! I'm Tess. I just saw your PPC audit shows ${formattedLoss} in monthly waste from ${issueCount} critical problems. That mobile conversion loss? I'm built to fix exactly that. Want to see how I can 5X your qualified leads?`;
                
                if (typeof this.widget.sendMessage === 'function') {
                    this.widget.sendMessage(message);
                    console.log('[Tess Bridge] Speaking:', { loss: formattedLoss, issues: issueCount });
                }
                
                // 👇 FORCE HIDE BUBBLES AFTER MESSAGE
                setTimeout(() => {
                    this.forceHideBubbles();
                }, 100);
                
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
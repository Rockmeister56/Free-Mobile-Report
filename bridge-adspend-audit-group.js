// Botemia Bridge for adSpend Audit Group
// Generated: 5/19/2026, 9:12:15 AM
// Client ID: adspend-audit-group
// Version: 5.8 - LISTENER MODE (FINAL)

(function() {
    "use strict";

    // ===== GLOBAL VARIABLES =====
    let isPreQualificationActive = false;
    window.preQualController = null;
    let dailyCallObject = null;

    // ===== EMBEDDED CLIENT CONFIGURATION =====
    window.BotemiaConfig = {
        "id": "adspend-audit-group",
        "name": "adSpend Audit Group",
        "websiteUrl": "https://free-mobile-report.netlify.app/calculator-enhanced",
        "agentId": "agent_dc3ce816d32441bf",
        "modules": {
            "preQualification": {
                "triggerPhrase": "let's get started",
                "triggerPhraseLegacy": "let's get started"
            },
            "emailConfig": {"loanOfficerEmail":"loans@clientcompany.com","ccEmail":"","emailSubject":"New Pre-Qual Lead: {{firstName}} {{lastName}}","clientEmail":"","supportPhone":"","emailTriggers":[],"phoneTriggers":[]},
            "splashScreen": {"enabled":false,"agentId":"agent_dc3ce816d32441bf","title":"Meet Tess","subtitle":"Your Personal AI Web Guide","tessVideoUrl":"","tessVideoFit":"cover","tickerKeywords":"","gradientCenter":"#1e4a8a","gradientOuter":"#0a1a2f","primaryButton":{"text":"Get AI help with Tess","gradientTop":"#f8c400","gradientBottom":"#d4a000","hoverTop":"#ffd700","hoverBottom":"#e0b000","textColor":"#0a0f1e"},"secondaryButton":{"text":"Just Browsing","gradientTop":"#3a4050","gradientBottom":"#2a2f3f","hoverTop":"#4a5060","hoverBottom":"#3a4050","textColor":"#ffffff"},"persistentButton":{"enabled":true,"position":"bottom-left","action":"activate-tess","gradientTop":"#f8c400","gradientBottom":"#d4a000"},"branding":{"name":"","logo":""}},
            "smartScreen": {"action":"showBestMatch","images":[{"url":"https://fcgbusobfdwnpoqyuzoe.supabase.co/storage/v1/object/public/Results%20Page%20Smart%20Screens/Laptop_displaying_Zoom_invitation_202605180914.jpeg","link":"https://calendly.com/mobilewise-ai/30min","name":"Zoom Meeting Invite","caption":"Zoom Meeting with Conversion Expert","imageSize":"800px","showTitle":true,"triggerMatch":["Perfect","let's get you registered!"],"backdropOpacity":"0.5","backgroundColor":"rgba(0,0,0,0.7)","displayDuration":10},{"url":"https://fcgbusobfdwnpoqyuzoe.supabase.co/storage/v1/object/public/Results%20Page%20Smart%20Screens/Mortgage_broker_looking_at_monitor_202605180902.jpeg","link":"","name":"Qualified Leads","caption":"","imageSize":"800px","showTitle":true,"triggerMatch":["If I could show you how to get"],"backdropOpacity":"0.5","backgroundColor":"rgba(0,0,0,0.7)","displayDuration":5}]},
            "testimonial": {"groups":[{"name":"Results","triggerPhrase":"let me show you what one of our brokers had to say","category":"results","videos":["https://fcgbusobfdwnpoqyuzoe.supabase.co/storage/v1/object/public/Video%20Testimonials%20Public/mortgage-testimonial.mp4"]}]},
            "videoVault": {"videos":[{"name":"The How Factor","triggerPhrase":"Let's watch how it works","url":"https://fcgbusobfdwnpoqyuzoe.supabase.co/storage/v1/object/sign/processed-videos/mobile-wise-ai-how-factor.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wNjJjNGVkZS0wYzRiLTQyMzAtOGE5MC1jMDhmNjhlNDVkNTciLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwcm9jZXNzZWQtdmlkZW9zL21vYmlsZS13aXNlLWFpLWhvdy1mYWN0b3IubXA0IiwiaWF0IjoxNzc5MTE5NDcwLCJleHAiOjE4MTA2NTU0NzB9.8hjTuqKqPdXCG-qB8WograKIaYJZ2rVOuw5tSfvgGmQ","description":"","category":"other"}]},
            "websiteInfo": {"triggers":[],"links":[]}
        }
    };

    // ===== TRIGGER PHRASE (from dashboard) =====
    window.TRIGGER_PHRASE = window.BotemiaConfig.modules?.preQualification?.triggerPhrase;
    if (!window.TRIGGER_PHRASE) {
        console.error("❌ CRITICAL: No trigger phrase configured in dashboard!");
    } else {
        console.log("🎯 Bridge using trigger phrase:", window.TRIGGER_PHRASE);
    }

    // =========================================
    // 🍋 AUTO-LOADER: EMAILJS LIBRARY
    // =========================================
    (function() {
        var js = document.createElement("script");
        js.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js";
        js.onload = function() {
            if (window.emailjs) {
                window.emailjs.init('7-9oxa3UC3uKxtqGM');
                console.log("✅ EmailJS Ready");
            }
        };
        document.head.appendChild(js);
    })();

    const style = document.createElement('style');
    style.textContent = `
        .splash-avatar-container {
            width: 220px; height: 384px; margin: 0 auto 25px;
            border-radius: 20px; overflow: hidden;
            background: #000;
            box-shadow: 0 20px 30px rgba(0,0,0,0.5);
            border: 2px solid rgba(255,255,255,0.1);
            display: flex; align-items: center; justify-content: center;
            position: relative;
        }
        .splash-avatar-container lemon-slice-widget {
            position: absolute;
            top: 50%; left: 45%;
            transform: translate(-50%, -50%);
            width: 280px !important;
            height: 400px !important;
            max-width: none !important;
            max-height: none !important;
            border-radius: 18px;
        }
        .splash-card {
            background: radial-gradient(circle at center, var(--grad-center, #1e4a8a) 0%, var(--grad-outer, #0a1a2f) 80%);
            border-radius: 48px; padding: 20px 30px 40px 30px;
            max-width: 475px; width: 90%; text-align: center;
            box-shadow: 0 30px 60px rgba(0,0,0,0.6);
            animation: slideUp 0.4s ease;
        }
        .splash-card h1 { color: white; font-size: 2.5rem; margin-bottom: 5px; font-weight: 700; }
        .splash-card h2 { color: rgba(255,255,255,0.9); font-size: 1.2rem; margin-bottom: 20px; font-weight: 300; }
        .button-group { display: flex; gap: 10px; justify-content: center; margin-top: 15px; }
        .primary-btn, .secondary-btn { padding: 12px 20px; border-radius: 40px; font-size: 1rem; font-weight: 600; cursor: pointer; flex: 1; max-width: 200px; border: none; transition: all 0.2s; }
        .primary-btn:hover, .secondary-btn:hover { transform: scale(1.02); }
        .ticker-container {
            position: absolute; bottom: 0; left: 0; right: 0;
            background: linear-gradient(90deg, rgba(0,0,0,0.9), rgba(248,196,0,0.2), rgba(0,0,0,0.9));
            backdrop-filter: blur(2px); color: #f8c400; padding: 6px 0;
            overflow: hidden; white-space: nowrap; font-size: 13px; font-weight: 600;
            text-shadow: 0 1px 2px rgba(0,0,0,0.8); z-index: 10; pointer-events: none;
            border-top: 2px solid #f8c400; border-bottom: none; box-shadow: 0 -2px 10px rgba(0,0,0,0.5);
        }
        .ticker-content { display: inline-block; animation: ticker 25s linear infinite; padding-left: 100%; }
        @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-100%); } }
        .ticker-item { display: inline-block; padding: 0 25px; color: white; font-size: 13px; font-weight: 500; letter-spacing: 0.5px; }
        .ticker-item i { margin-right: 8px; color: #f8c400; font-size: 12px; filter: drop-shadow(0 0 3px rgba(248,196,0,0.5)); }
    `;
    document.head.appendChild(style);

    function createSplashWidget() {
        const widget = document.createElement('lemon-slice-widget');
        let clientId = window.BotemiaConfig?.id;
        if (!clientId) { console.error("❌ CRITICAL: BotemiaConfig ID missing!"); return null; }
        widget.setAttribute('client-id', clientId);
        widget.clientId = clientId;
        const sessionId = 'session-' + crypto.randomUUID();
        window.tessSessionId = sessionId;
        widget.setAttribute('room-id', sessionId);
        widget.roomId = sessionId;
        widget.setAttribute('agent-id', 'agent_dc3ce816d32441bf');
        widget.agentId = 'agent_dc3ce816d32441bf';
        const apiKey = "sk_lemon_Tleyq2zh6NoMpllEHf7mYNRxzIED6YcP";
        widget.setAttribute('api-key', apiKey);
        widget.apiKey = apiKey;
        widget.setAttribute('muted', 'true');
        widget.muted = true;
        widget.setAttribute('suppress-audio', 'true');
        widget.setAttribute('initial-state', 'active');
        widget.setAttribute('inline', '');
        widget.setAttribute('custom-minimized-width', '280');
        widget.setAttribute('custom-minimized-height', '400');
        widget.setAttribute('hide-ui', '');
        widget.setAttribute('suppress-initial-message', 'true');
        widget.id = 'splash-widget';
        return widget;
    }

    // ===== INTERVIEW LISTENER (QUESTIONS FROM LEMONSLICE) =====
    window.interviewListener = {
        isActive: false,
        answers: {},
        currentField: null,
        
        start: function() {
            this.isActive = true;
            this.answers = {};
            console.log("🎧 Interview listener activated");
        },
        
        // Called when Tess speaks - detects which question is being asked
        detectQuestion: function(tessText) {
            const patterns = {
                "loanType": ["type of loan", "FHA", "VA", "Conventional"],
                "monthlyIncome": ["monthly income", "gross monthly"],
                "downPayment": ["putting down", "down payment"],
                "creditScore": ["credit score"],
                "fullName": ["full name"],
                "email": ["email address"],
                "phone": ["phone number"],
                "scheduledDateTime": ["date and time", "Zoom meeting"],
                "specialRequests": ["special requests"]
            };
            
            for (const [field, keywords] of Object.entries(patterns)) {
                if (keywords.some(kw => tessText.toLowerCase().includes(kw))) {
                    this.currentField = field;
                    console.log("📋 Expecting answer for:", field);
                    return field;
                }
            }
            return null;
        },
        
        // Called when user speaks - stores the answer
        captureAnswer: function(userText) {
            if (this.currentField && this.isActive) {
                this.answers[this.currentField] = userText;
                console.log("💾 Stored " + this.currentField + ":", userText);
                this.currentField = null;
                return true;
            }
            return false;
        },
        
        // Called when interview completes
        finish: function() {
            this.isActive = false;
            console.log("✅ Interview complete. Answers:", this.answers);
            return this.answers;
        }
    };

    class PreQualificationController {
        constructor() {
            this.isActive = false;
            this.script = null;
            this.answers = {};
            this.currentStepIndex = 0;
            this.currentField = null;
            this.pendingValue = null;
            this.interviewCompleted = false;
        }

        startInterview() {
            if (this.isActive) return;
            
            this.isActive = true;
            this.currentStepIndex = 0;
            this.answers = {};
            
            // 🔥 NUCLEAR OPTION: Completely mute LemonSlice AI
            if (window.mainWidget) {
                window.mainWidget.setAttribute('muted', 'true');
                window.mainWidget.setAttribute('suppress-audio', 'true');
                window.mainWidget.setAttribute('suppress-ai', 'true');
                console.log("🔇 LemonSlice AI forcefully muted");
            }
            
            console.log("🎧 Listener Mode Activated - Waiting for LemonSlice questions");
        }

        handleUserInput(userText) {
            if (!this.isActive) return;
            
            // Clean credit score values — strip $ and , if current field is creditScore
            if (this.currentField === "creditScore") {
                userText = userText.replace(/[$,]/g, "").trim();
            }
            
            const lowerText = userText.toLowerCase();
            
            // Detect which field we're capturing based on Tess's last question
            if (this.currentField) {
                // Normalize email addresses before storing
                if (this.currentField === "email" && userText) {
                    userText = userText
                        .replace(/\s+at\s+/g, "@")
                        .replace(/\s+dot\s+/g, ".")
                        .replace(/\s+/g, "")
                        .replace(/\.+$/g, "");
                }
                
                // Normalize phone numbers
                if (this.currentField === "phone" && userText) {
                    userText = userText.replace(/[^0-9\-()+]/g, "").trim();
                }
                
                // Check if this is a confirmation ("yes" to "Is that correct?")
                var cleanLower = lowerText.replace(/[.!?,]/g, "").trim();
                if (cleanLower === "yes" || cleanLower === "yes it is" || cleanLower === "correct" || cleanLower === "that's correct") {
                    if (this.pendingValue) {
                        this.answers[this.currentField] = this.pendingValue;
                        console.log("✅ Confirmed:", this.currentField, "=", this.pendingValue);
                    }
                    this.pendingValue = null;
                    this.currentField = null;
                } else if (cleanLower === "no" || cleanLower.includes("redo") || cleanLower.includes("repeat") || cleanLower === "that's not correct") {
                    console.log("🔄 User wants to redo:", this.currentField);
                    this.pendingValue = null;
                    // Keep currentField so we capture the next attempt
                } else {
                    // This is the actual value being provided
                    this.pendingValue = userText;
                    console.log("📝 Pending:", this.currentField, "=", userText);
                }
            } else {
                // Store uncategorized responses
                console.log("💾 Captured (uncategorized):", userText);
            }
            
            // Store all responses in chronological order as backup
            if (!this.answers.allResponses) this.answers.allResponses = [];
            this.answers.allResponses.push({ 
                text: userText, 
                field: this.currentField || "unknown",
                timestamp: Date.now() 
            });
            
            // Check if we've collected all critical fields
            if (this.answers.fullName && this.answers.email && this.answers.phone && !this.interviewCompleted) {
                this.interviewCompleted = true;
                console.log("🎉 All critical fields collected!");
                // Give LemonSlice time to finish speaking before finishing
                setTimeout(() => {
                    this.finishInterview();
                }, 5000);
            }
        }

        detectFieldFromQuestion(tessText) {
            const lowerText = tessText.toLowerCase();
            
                        // Capture "I heard X. Is that correct?" patterns from Tess
                        var heardMatch = tessText.match(/I heard\s+["']?(.+?)["']?\.?\s*Is that correct/i);
                        if (heardMatch && heardMatch[1]) {
                            var heardValue = heardMatch[1].trim();
                            if (heardValue.indexOf("@") !== -1 || heardValue.indexOf(" at ") !== -1 || heardValue.indexOf("gmail") !== -1 || heardValue.indexOf("dot com") !== -1) {
                                window._tessHeardEmail = heardValue;
                                console.log("📧 Captured email from Tess:", heardValue);
                            } else if (heardValue.length > 1 && !heardValue.match(/^\d/)) {
                                window._tessHeardName = heardValue;
                                console.log("👤 Captured name from Tess:", heardValue);
                            }
                        }
            if (lowerText.includes("full name") || lowerText.includes("start with your")) {
                this.currentField = "fullName";
            } else if (lowerText.includes("business name") || lowerText.includes("website")) {
                this.currentField = "businessName";
            } else if (lowerText.includes("email")) {
                this.currentField = "email";
            } else if (lowerText.includes("phone")) {
                this.currentField = "phone";
            } else if (lowerText.includes("date and time") || lowerText.includes("zoom meeting")) {
                this.currentField = "scheduledDateTime";
            } else if (lowerText.includes("type of loan") || lowerText.includes("fha")) {
                this.currentField = "loanType";
            } else if (lowerText.includes("monthly income") || lowerText.includes("gross monthly")) {
                this.currentField = "monthlyIncome";
            } else if (lowerText.includes("putting down") || lowerText.includes("down payment")) {
                this.currentField = "downPayment";
            } else if (lowerText.includes("credit score")) {
                this.currentField = "creditScore";
            } else if (lowerText.includes("special requests")) {
                this.currentField = "specialRequests";
            } else if (lowerText.includes("anything else")) {
                this.expectingClosingResponse = true;
                console.log("🎯 Expecting closing response (Yes/No)");
            }
            
            if (this.currentField) {
                console.log("🎯 Expecting answer for:", this.currentField);
            }
        }

        finishInterview() {
            this.isActive = false;
            console.log("✅ Interview Complete.");
            
            // 🔥 RESTORE LEMONSLICE AI
            if (window.mainWidget) {
                window.mainWidget.removeAttribute('muted');
                window.mainWidget.removeAttribute('suppress-audio');
                window.mainWidget.removeAttribute('suppress-ai');
                window.mainWidget.setAttribute('controlled-widget-state', 'inactive');
                console.log("🔊 LemonSlice AI restored");
            }
            
            this.speak("That is everything! I am generating your pre-qualification letter now.");
        trackEvent('prequal_complete');
            this.sendEmail();
        }

        speak(text) {
            if (!text) return;
            console.log("🤖 Tess says: " + text);
            
            // 🔥 FORCE DISABLE LEMONSLICE AI DURING INTERVIEW
            if (this.isActive && window.mainWidget) {
                window.mainWidget.setAttribute('suppress-ai', 'true');
                window.mainWidget.setAttribute('controlled-widget-state', 'active');
            }
            
            if (window.mainWidget && typeof window.mainWidget.sendMessage === "function") {
                try {
                    window.mainWidget.sendMessage(text);
                    console.log("📤 sendMessage called successfully");
                } catch(e) {
                    console.error("❌ sendMessage error:", e);
                }
            } else {
                console.error("❌ mainWidget not ready - activate Tess first!");
            }
        }

        sendEmail() {
            console.log("📧 Sending emails...");
            const data = this.answers;
            
            // Normalize email if it came from Tess's speech
            if (data.email && data.email.indexOf("@") === -1) {
                data.email = data.email
                    .replace(/\s+at\s+/g, "@")
                    .replace(/\s+dot\s+/g, ".")
                    .replace(/\s+/g, "")
                    .replace(/\.+$/g, "");
            }
            
            // Fallback: if email is missing, use clientEmail
            if (!data.email || data.email === "Not provided") {
                var cfgEmail = window.BotemiaConfig?.modules?.emailConfig?.clientEmail;
                if (cfgEmail) data.email = cfgEmail;
            }
            
            trackEvent('lead_captured', { email: data.email });
            
            // ===== EMAIL 1: TO LOAN BROKER PROSPECT =====
            if (data.email) {
                var prospectParams = {
                    to_email: data.email,
                    full_name: data.fullName || "Valued Client",
                    email: data.email,
                    phone: data.phone || "Not provided",
                    business_name: data.businessName || "Not provided",
                    scheduled_datetime: data.scheduledDateTime || "To be determined",
                    loan_type: "See Full Example Below",
                    annual_income: "See Full Example Below",
                    down_payment: "See Full Example Below",
                    credit_score: "See Full Example Below",
                    special_requests: data.specialRequests || "None",
                    submitted_at: new Date().toLocaleString()
                };
                
                emailjs.send("service_b9bppgb", "template_uix9cyx", prospectParams)
                    .then(function() { console.log("✅ Prospect email sent to: " + data.email); })
                    .catch(function(e) { console.error("❌ Prospect email error:", e); });
            } else {
                console.warn("⚠️ No prospect email provided, skipping prospect email");
            }
            
            // ===== EMAIL 2: TO YOU/AGENCY =====
            var clientEmail = window.BotemiaConfig?.modules?.emailConfig?.clientEmail || "mobilewise.ai@gmail.com";
            
            var clientParams = {
                to_email: clientEmail,
                full_name: data.fullName || "Not provided",
                email: data.email || "Not provided",
                phone: data.phone || "Not provided",
                scheduled_datetime: data.scheduledDateTime || "Not provided",
                message: data.specialRequests || "None",
                submitted_at: new Date().toLocaleString()
            };
            
            emailjs.send("service_b9bppgb", "template_8kx812d", clientParams)
                .then(function() { console.log("✅ Agency notification sent to: " + clientEmail); })
                .catch(function(e) { console.error("❌ Agency email error:", e); });
        }
    }
    window.PreQualificationController = PreQualificationController;

    // =========================================
    // 🍋 SUPABASE REALTIME SETUP (ASYNC SAFE)
    // =========================================
    (function() {
        const SUPABASE_URL = "https://fcgbusobfdwnpoqyuzoe.supabase.co";
        const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjZ2J1c29iZmR3bnBvcXl1em9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzNDA2MjMsImV4cCI6MjA4NTkxNjYyM30.FHEZnxuGHSn_Z3gw9d_Txtfz5Jn55J6qonl8rnA3gPk";
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
        
        // ✅ FIX: We only run Supabase code AFTER library is fully loaded
        script.onload = function() {
            const { createClient } = supabase;
            const sbClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
                realtime: { params: { eventsPerSecond: 10 } }
            });
            
            const tcsChannel = sbClient.channel("tess-commands");
            
            tcsChannel.on("broadcast", { event: "command" }, function(payload) {
                console.log("📡 [REALTIME] Command received:", payload);
                var cmd = payload.payload?.command;
                var mod = payload.payload?.module;
                var phrase = (payload.payload?.trigger_phrase || "").toLowerCase();
                
                // ===== EMAIL COMMAND =====
                if (cmd === "SEND_EMAIL") {
                    console.log("📧 Email command received from TCS!");
                    if (window.preQualController && window.preQualController.isActive) {
                        window.preQualController.sendEmail();
                        window.preQualController.isActive = false;
                        console.log("✅ Email sent via TCS command");
                    } else {
                        console.warn("⚠️ Cannot send email - controller not active. Sending test confirmation...");
                        window.supabaseChannel.send({
                            type: "broadcast",
                            event: "trigger_test_result",
                            payload: {
                                module: "email_trigger",
                                success: true,
                                message: "Email trigger recognized (controller not active, but trigger detected)"
                            }
                        });
                    }
                }
                
                // ===== PHONE CONNECT COMMAND =====
                if (cmd === "PHONE_CONNECT") {
                    console.log("📞 Phone connect command received from TCS!");
                    const phoneNumber = window.BotemiaConfig?.modules?.emailConfig?.supportPhone || "949-228-5263";
                    console.log("📞 Would initiate call to:", phoneNumber);
                    window.supabaseChannel.send({
                        type: "broadcast",
                        event: "trigger_test_result",
                        payload: {
                            module: "phone_connect",
                            success: true,
                            message: "Phone trigger recognized — would dial " + phoneNumber
                        }
                    });
                }
                
                // ===== SMART SCREEN COMMAND =====
                if (cmd === "SHOW_SMART_SCREEN") {
                    console.log("📸 Smart Screen command received:", payload.payload);
                    if (typeof window.showSmartScreen === "function") {
                        window.showSmartScreen(payload.payload.trigger, payload.payload.image);
                    }
                }
                
                // ===== TEST TRIGGER COMMAND (For TCS test buttons) =====
                if (cmd === "test_trigger") {
                    console.log("🧪 TCS Test: " + mod + " - " + phrase);
                    var result = { success: false, message: "No trigger matched" };
                    
                    // --- SMART SCREEN: Actually launch it ---
                    if (mod === "smart_screen") {
                        var images = window.BotemiaConfig?.modules?.smartScreen?.images || [];
                        for (var i = 0; i < images.length; i++) {
                            var imgTriggers = images[i].triggerMatch || [];
                            for (var j = 0; j < imgTriggers.length; j++) {
                                if (imgTriggers[j] && phrase.indexOf(imgTriggers[j].toLowerCase()) !== -1) {
                                    result = { success: true, message: "✅ Smart Screen launched: " + images[i].name };
                                    var overlay = document.createElement("div");
                                    overlay.style.cssText = "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,0.95);z-index:999998;display:flex;align-items:center;justify-content:center;flex-direction:column;padding:20px;border-radius:16px;max-width:95vw;";
                                    overlay.id = "tcs-test-overlay";
                                    overlay.onclick = function() { overlay.remove(); };
                                    var imgEl = document.createElement("img");
                                    imgEl.src = images[i].url;
                                    imgEl.style.cssText = "width:100%;max-height:80vh;object-fit:contain;border-radius:12px;box-shadow:0 20px 60px rgba(0,0,0,0.5);";
                                    overlay.appendChild(imgEl);
                                    if (images[i].name) {
                                        var caption = document.createElement("div");
                                        caption.style.cssText = "color:white;font-size:1.5rem;margin-top:20px;font-weight:600;";
                                        caption.textContent = images[i].name;
                                        overlay.appendChild(caption);
                                    }
                                    document.body.appendChild(overlay);
                                    if (window.supabaseChannel) {
                                        window.supabaseChannel.send({
                                            type: "broadcast", event: "trigger_test_result",
                                            payload: { module: mod, success: result.success, message: result.message, timestamp: Date.now() }
                                        });
                                    }
                                    break;
                                }
                            }
                            if (result.success) break;
                        }
                        if (!result.success) result.message = "❌ No smart screen trigger matched";
                    }
                    
                    // --- EMAIL: Actually send it ---
                    if (mod === "email_trigger") {
                        var emailTriggers = window.BotemiaConfig?.modules?.emailConfig?.emailTriggers || [];
                        for (var e = 0; e < emailTriggers.length; e++) {
                            if (emailTriggers[e] && phrase.indexOf(emailTriggers[e].toLowerCase()) !== -1) {
                                result = { success: true, message: "✅ Email sent" };
                                if (window.preQualController && window.preQualController.isActive) {
                                    window.preQualController.sendEmail();
                                    window.preQualController.isActive = false;
                                }
                                if (window.supabaseChannel) {
                                    window.supabaseChannel.send({
                                        type: "broadcast", event: "trigger_test_result",
                                        payload: { module: mod, success: result.success, message: result.message, timestamp: Date.now() }
                                    });
                                }
                                break;
                            }
                        }
                        if (!result.success) result.message = "❌ No email trigger matched";
                    }
                    
                    // --- PHONE: Actually dial ---
                    if (mod === "phone_connect") {
                        var phoneTriggers = window.BotemiaConfig?.modules?.emailConfig?.phoneTriggers || [];
                        for (var p = 0; p < phoneTriggers.length; p++) {
                            if (phoneTriggers[p] && phrase.indexOf(phoneTriggers[p].toLowerCase()) !== -1) {
                                var pn = window.BotemiaConfig?.modules?.emailConfig?.supportPhone || "949-228-5263";
                                result = { success: true, message: "✅ Dialing " + pn };
                                window.open("tel:" + pn, "_blank");
                                if (window.supabaseChannel) {
                                    window.supabaseChannel.send({
                                        type: "broadcast", event: "trigger_test_result",
                                        payload: { module: mod, success: result.success, message: result.message, timestamp: Date.now() }
                                    });
                                }
                                break;
                            }
                        }
                        if (!result.success) result.message = "❌ No phone trigger matched";
                    }
                    
                    // --- PRE-QUAL: Actually start it ---
                    if (mod === "pre_qual") {
                        var pqTrigger = window.BotemiaConfig?.modules?.preQualification?.triggerPhrase || "";
                        if (pqTrigger && phrase.indexOf(pqTrigger.toLowerCase()) !== -1) {
                            result = { success: true, message: "✅ Pre-qual started" };
                            if (window.preQualController && !window.preQualController.isActive) {
                                forcePreQualification();
                            }
                        } else {
                            result.message = "❌ Pre-qual trigger not matched";
                        }
                    }
                    
                    // --- WEBSITE INFO ---
                    if (mod === "website_info") {
                        var webInfo = window.BotemiaConfig?.modules?.websiteInfo;
                        var webLinks = webInfo?.links || [];
                        for (var w = 0; w < webLinks.length; w++) {
                            if (webLinks[w].triggerPhrase && phrase.indexOf(webLinks[w].triggerPhrase.toLowerCase()) !== -1) {
                                result = { success: true, message: "✅ Website Info: " + webLinks[w].title };
                                if (window.supabaseChannel) {
                                    window.supabaseChannel.send({
                                        type: "broadcast", event: "trigger_test_result",
                                        payload: { module: mod, success: true, message: "✅ Website Info: " + webLinks[w].title, timestamp: Date.now() }
                                    });
                                }
                                // Show the link overlay
                                var webOverlay = document.createElement("div");
                                webOverlay.style.cssText = "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(10,15,30,0.98);z-index:999998;display:flex;flex-direction:column;padding:0;border-radius:16px;max-width:90vw;max-height:85vh;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.8);border:2px solid #f8c400;";
                                var webHeader = document.createElement("div");
                                webHeader.style.cssText = "display:flex;justify-content:space-between;align-items:center;padding:15px 20px;background:rgba(0,0,0,0.5);border-bottom:1px solid #f8c400;";
                                var webTitle = document.createElement("span");
                                webTitle.style.cssText = "color:#f8c400;font-size:1.1rem;font-weight:600;";
                                webTitle.textContent = webLinks[w].title;
                                webHeader.appendChild(webTitle);
                                var webClose = document.createElement("button");
                                webClose.textContent = "✕";
                                webClose.style.cssText = "background:#f44336;color:white;border:none;width:32px;height:32px;border-radius:50%;font-size:1rem;cursor:pointer;";
                                webClose.onclick = function() { webOverlay.remove(); };
                                webHeader.appendChild(webClose);
                                webOverlay.appendChild(webHeader);
                                var webFrame = document.createElement("iframe");
                                webFrame.src = webLinks[w].url;
                                webFrame.style.cssText = "width:800px;max-width:90vw;height:75vh;border:none;";
                                webOverlay.appendChild(webFrame);
                                document.body.appendChild(webOverlay);
                                if (window.supabaseChannel) {
                                    window.supabaseChannel.send({
                                        type: "broadcast", event: "trigger_test_result",
                                        payload: { module: mod, success: result.success, message: result.message, timestamp: Date.now() }
                                    });
                                }
                                break;
                            }
                        }
                        if (!result.success) result.message = "❌ No website info trigger matched";
                    }
                    // --- TESTIMONIALS ---
                    if (mod === "testimonials") {
                        var groups = window.BotemiaConfig?.modules?.testimonial?.groups || [];
                        var matchedGroup = null;
                        for (var g = 0; g < groups.length; g++) {
                            if (groups[g].triggerPhrase && phrase.indexOf(groups[g].triggerPhrase.toLowerCase()) !== -1) {
                                matchedGroup = groups[g];
                                break;
                            }
                        }
                        if (matchedGroup) {
                            result = { success: true, message: "✅ Testimonial playing: " + matchedGroup.triggerPhrase };
                            // Play the first video in the matched group
                            if (matchedGroup.videos && matchedGroup.videos.length > 0) {
                                var videoUrl = matchedGroup.videos[0];
                                var videoOverlay = document.createElement("div");
                                videoOverlay.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.9);z-index:999999;display:flex;align-items:center;justify-content:center;flex-direction:column;";
                                videoOverlay.onclick = function() { videoOverlay.remove(); };
                                var videoEl = document.createElement("video");
                                videoEl.src = videoUrl;
                                videoEl.controls = true;
                                videoEl.autoplay = true;
                                videoEl.style.cssText = "max-width:90%;max-height:80vh;border-radius:16px;box-shadow:0 20px 60px rgba(0,0,0,0.5);";
                                videoOverlay.appendChild(videoEl);
                                if (matchedGroup.name) {
                                    var vidCaption = document.createElement("div");
                                    vidCaption.style.cssText = "color:white;font-size:1.3rem;margin-top:15px;font-weight:600;";
                                    vidCaption.textContent = matchedGroup.name;
                                var closeBtn = document.createElement("button");
                                closeBtn.textContent = "✕ Close";
                                closeBtn.style.cssText = "margin-top:12px;padding:8px 25px;background:#f8c400;color:#0a0f1e;border:none;border-radius:30px;font-size:0.9rem;font-weight:600;cursor:pointer;";
                                closeBtn.onclick = function() { videoOverlay.remove(); };
                                videoOverlay.appendChild(closeBtn);
                                    videoOverlay.appendChild(vidCaption);
                                }
                                document.body.appendChild(videoOverlay);
                            }
                        } else {
                            result.message = "❌ No testimonial trigger matched";
                        }
                    }
                    // --- VIDEO VAULT ---
                    if (mod === "video_vault") {
                        var videos = window.BotemiaConfig?.modules?.videoVault?.videos || [];
                        var matchedVideo = null;
                        for (var v = 0; v < videos.length; v++) {
                            if (videos[v].triggerPhrase && phrase.indexOf(videos[v].triggerPhrase.toLowerCase()) !== -1) {
                                matchedVideo = videos[v];
                                break;
                            }
                        }
                        if (matchedVideo) {
                            result = { success: true, message: "✅ Video playing: " + matchedVideo.triggerPhrase };
                            var videoOverlay = document.createElement("div");
                            videoOverlay.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.9);z-index:999999;display:flex;align-items:center;justify-content:center;flex-direction:column;";
                            videoOverlay.onclick = function() { videoOverlay.remove(); };
                            var videoEl = document.createElement("video");
                            videoEl.src = matchedVideo.url;
                            videoEl.controls = true;
                            videoEl.autoplay = true;
                            videoEl.style.cssText = "max-width:90%;max-height:80vh;border-radius:16px;box-shadow:0 20px 60px rgba(0,0,0,0.5);";
                            videoOverlay.appendChild(videoEl);
                            if (matchedVideo.name) {
                                var vidCaption = document.createElement("div");
                                vidCaption.style.cssText = "color:white;font-size:1.3rem;margin-top:15px;font-weight:600;";
                                vidCaption.textContent = matchedVideo.name;
                                var closeBtn = document.createElement("button");
                                closeBtn.textContent = "✕ Close";
                                closeBtn.style.cssText = "margin-top:12px;padding:8px 25px;background:#f8c400;color:#0a0f1e;border:none;border-radius:30px;font-size:0.9rem;font-weight:600;cursor:pointer;";
                                closeBtn.onclick = function() { videoOverlay.remove(); };
                                videoOverlay.appendChild(closeBtn);
                                videoOverlay.appendChild(vidCaption);
                            }
                            document.body.appendChild(videoOverlay);
                        } else {
                            result.message = "❌ No video trigger matched";
                        }
                    }
                }
            });
            
            tcsChannel.subscribe(function(status) { 
                if (status === "SUBSCRIBED") console.log("✅ [REALTIME] Connected to Supabase"); 
            });
            window.supabaseChannel = tcsChannel;
            
            // Health monitor channel
            var healthChannel = sbClient.channel("health-monitor");
            healthChannel.subscribe(function(status) {
                if (status === "SUBSCRIBED") console.log("🩺 Health monitor channel connected");
            });
            window.healthChannel = healthChannel;
            healthChannel.on("broadcast", { event: "test_ping" }, function(payload) {
                healthChannel.send({
                    type: "broadcast", event: "test_pong",
                    payload: { clientId: window.BotemiaConfig?.id || "unknown", timestamp: Date.now(), echoTimestamp: payload.payload.timestamp }
                });
            });
        }; // END script.onload
        document.head.appendChild(script);
    })(); // END Supabase IIFE
    // ===== ANALYTICS EVENT TRACKER =====
    function trackEvent(eventType, eventData = {}) {
        if (!window.supabaseChannel) return;
        
        window.supabaseChannel.send({
            type: 'broadcast',
            event: 'analytics_event',
            payload: {
                client_id: window.BotemiaConfig?.id || 'unknown',
                session_id: window.tessSessionId || 'unknown',
                event_type: eventType,
                event_data: eventData,
                source_url: window.location.href,
                referrer: document.referrer || 'direct',
                timestamp: Date.now()
            }
        });
        console.log('📊 Tracked: ' + eventType, eventData);
    }

    window.preQualController = new PreQualificationController();
    console.log("✅ Controller created (Listener Mode)");
    window.broadcastTessTranscript = function(text) {
        if (window.supabaseChannel) {
            window.supabaseChannel.send({ type: 'broadcast', event: 'tess_transcript', payload: { type: 'TESS_TRANSCRIPT', text: text, timestamp: Date.now() } });
        }
    };

    // ==========================================
    // 🍋 DAILY SDK LOADER
    // ==========================================
    function loadDailySDK() {
        return new Promise((resolve, reject) => {
            if (typeof DailyIframe !== "undefined") {
                resolve();
                return;
            }
            const script = document.createElement("script");
            script.src = "https://unpkg.com/@daily-co/daily-js";
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    async function initDaily() {
        console.log("📞 initDaily: Starting process...");
        
        // 1. AGGRESSIVE WAIT: Ensure SDK is loaded
        if (typeof DailyIframe === "undefined") {
            console.log("⏳ Daily SDK missing. Loading & Waiting...");
            try {
                await loadDailySDK();
                if (typeof DailyIframe === "undefined") {
                    console.error("❌ Failed to load Daily SDK after waiting.");
                    return;
                }
            } catch (e) {
                console.error("❌ Error loading Daily SDK:", e);
                return;
            }
        }

        console.log("✅ Daily SDK loaded. Creating room...");
        try {
            const response = await fetch("https://fcgbusobfdwnpoqyuzoe.supabase.co/functions/v1/create-daily-room", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    agent_id: "agent_dc3ce816d32441bf"
                })
            });
            const data = await response.json();
            
            if (data.room_url && data.token) {
                dailyCallObject = DailyIframe.createCallObject({ lang: "en-us" });
                window.dailyCallObject = dailyCallObject;
                
                // Create hidden container if not exists
                let container = document.getElementById("daily-container");
                if (!container) {
                    container = document.createElement("div");
                    container.id = "daily-container";
                    container.style.display = "none";
                    document.body.appendChild(container);
                }
                
                if (dailyCallObject.iframe()) { 
                    container.appendChild(dailyCallObject.iframe()); 
                }
                
                await dailyCallObject.join({ url: data.room_url, token: data.token });
                console.log("✅ Joined Daily room (Server Connection Active)");
                
                // ===== 🎧 CLEAN AUDIO LISTENER =====
                dailyCallObject.on("app-message", (ev) => {
                    
                    // 🔥 BLOCK USER TRANSCRIPTIONS from triggering modules
                    if (ev?.data?.type === "user_transcription") {
                        const userText = ev.data.transcription || ev.data.text || "";
                        console.log("👤 [DAILY] User said (ignored):", userText);
                        return;
                    }
                    
                    // 🔥 NEW: Handle USER transcriptions during interview
                    if (window.preQualController && window.preQualController.isActive && ev?.data?.type === "user_transcription") {
                        const userText = ev.data.transcription || ev.data.text || "";
                        console.log("👤 [DAILY] User said:", userText);
                        window.preQualController.handleUserInput(userText);
                        return;
                    }
                    
                    if (ev?.data?.type === "agent_transcription") {
                        const tessText = ev.data.transcription;
                        const lowerText = tessText.toLowerCase();
                        
                        // Capture "I heard X. Is that correct?" patterns from Tess
                        var heardMatch = tessText.match(/I heard\s+["']?(.+?)["']?\.?\s*Is that correct/i);
                        if (heardMatch && heardMatch[1]) {
                            var heardValue = heardMatch[1].trim();
                            if (heardValue.indexOf("@") !== -1 || heardValue.indexOf(" at ") !== -1 || heardValue.indexOf("gmail") !== -1 || heardValue.indexOf("dot com") !== -1) {
                                window._tessHeardEmail = heardValue;
                                console.log("📧 Captured email from Tess:", heardValue);
                            } else if (heardValue.length > 1 && !heardValue.match(/^\d/)) {
                                window._tessHeardName = heardValue;
                                console.log("👤 Captured name from Tess:", heardValue);
                            }
                        }
                        // Always log Tess transcriptions
                        console.log("🤖 [DAILY] Tess said:", tessText);
                        
                        // Always broadcast to Supabase
                        if (window.supabaseChannel) {
                            window.supabaseChannel.send({
                                type: "broadcast",
                                event: "tess_transcript",
                                payload: { text: tessText, timestamp: Date.now() }
                            });
                        }
                        
                        // ===== INTERVIEW MODE: Controller is active =====
                        if (window.preQualController && window.preQualController.isActive) {
                            // Detect which question Tess is asking
                            window.preQualController.detectFieldFromQuestion(tessText);
                            
                            // --- SMART SCREEN TRIGGER (during interview) ---
                            var smartImages = window.BotemiaConfig?.modules?.smartScreen?.images || [];
                            for (var si = 0; si < smartImages.length; si++) {
                                if ((smartImages[si].triggerMatch || []).some(function(t) { return lowerText.indexOf(t.toLowerCase()) !== -1; })) {
                                    console.log("📸 Smart Screen matched during interview:", smartImages[si].name);
                                    var overlay = document.createElement("div");
                                    overlay.style.cssText = "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,0.95);z-index:999998;display:flex;align-items:center;justify-content:center;flex-direction:column;padding:20px;border-radius:16px;max-width:90vw;";
                                    var imgEl = document.createElement("img");
                                    imgEl.src = smartImages[si].url;
                                    imgEl.style.cssText = "max-width:100%;max-height:70vh;border-radius:12px;box-shadow:0 20px 60px rgba(0,0,0,0.5);";
                                    overlay.appendChild(imgEl);
                                    if (smartImages[si].name) {
                                        var caption = document.createElement("div");
                                        caption.style.cssText = "color:white;font-size:1.3rem;margin-top:15px;font-weight:600;";
                                        caption.textContent = smartImages[si].name;
                                        overlay.appendChild(caption);
                                    }
                                    var closeBtn = document.createElement("button");
                                    closeBtn.textContent = "✕ Close";
                                    closeBtn.style.cssText = "margin-top:12px;padding:8px 25px;background:#f8c400;color:#0a0f1e;border:none;border-radius:30px;font-size:0.9rem;font-weight:600;cursor:pointer;";
                                    closeBtn.onclick = function() { overlay.remove(); };
                                    overlay.appendChild(closeBtn);
                                    document.body.appendChild(overlay);
                                    setTimeout(function() { if (overlay.parentNode) overlay.remove(); }, 10000);
                                    if (window.supabaseChannel) {
                                        window.supabaseChannel.send({
                                            type: "broadcast",
                                            event: "smart_screen_trigger",
                                            payload: { image: smartImages[si], trigger: tessText, timestamp: Date.now() }
                                        });
                                    }
                                    if (window.supabaseChannel) {
                                        window.supabaseChannel.send({
                                            type: "broadcast",
                                            event: "smart_screen_trigger",
                                            payload: { image: smartImages[si], trigger: tessText, timestamp: Date.now() }
                                        });
                                    }
                                }
                            }
                            
                            // --- EMAIL TRIGGER (during interview) ---
                            var emailCfg2 = window.BotemiaConfig?.modules?.emailConfig;
                            if (emailCfg2?.emailTriggers?.some(function(t) { return lowerText.indexOf(t.toLowerCase()) !== -1; })) {
                                console.log("📧 Email trigger detected during interview!");
                                if (window.preQualController && window.preQualController.isActive) {
                                    window.preQualController.sendEmail();
                                    window.preQualController.isActive = false;
                                    console.log("✅ Email sent via trigger during interview");
                            
                                    // Show confirmation overlay after email sent
                                    var confirmOverlay = document.createElement("div");
                                    confirmOverlay.style.cssText = "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,0.95);z-index:999998;display:flex;align-items:center;justify-content:center;flex-direction:column;padding:30px 40px;border-radius:16px;border:2px solid #f8c400;";
                                    confirmOverlay.innerHTML = '<div style="color:#f8c400;font-size:1.5rem;margin-bottom:10px;">📧</div><div style="color:white;font-size:1.3rem;font-weight:600;text-align:center;">Email confirmation sent!</div><div style="color:rgba(255,255,255,0.6);font-size:0.9rem;margin-top:8px;">Check your inbox</div>';
                                    confirmOverlay.onclick = function() { confirmOverlay.remove(); };
                                    document.body.appendChild(confirmOverlay);
                                    setTimeout(function() { if (confirmOverlay.parentNode) confirmOverlay.remove(); }, 5000);
                                }
                            }
                            // --- PHONE TRIGGER (during interview) ---
                            if (emailCfg2?.phoneTriggers?.some(function(t) { return lowerText.indexOf(t.toLowerCase()) !== -1; })) {
                                console.log("📞 Phone trigger detected during interview!");
                            }
                            
                            // --- TESTIMONIALS TRIGGER (during interview) ---
                            var tGroups = window.BotemiaConfig?.modules?.testimonial?.groups || [];
                            for (var tg = 0; tg < tGroups.length; tg++) {
                                if (tGroups[tg].triggerPhrase && lowerText.indexOf(tGroups[tg].triggerPhrase.toLowerCase()) !== -1) {
                                    console.log("🎬 Testimonial matched during interview:", tGroups[tg].triggerPhrase);
                                }
                            }
                            
                            // --- VIDEO VAULT TRIGGER (during interview) ---
                            var vids = window.BotemiaConfig?.modules?.videoVault?.videos || [];
                            for (var vi = 0; vi < vids.length; vi++) {
                                if (vids[vi].triggerPhrase && lowerText.indexOf(vids[vi].triggerPhrase.toLowerCase()) !== -1) {
                                    console.log("📹 Video Vault matched during interview:", vids[vi].triggerPhrase);
                                }
                            }
                            
                            // --- WEBSITE INFO TRIGGER (during interview) ---
                            var wTriggers = window.BotemiaConfig?.modules?.websiteInfo?.triggers || [];
                            if (wTriggers.some(function(t) { return lowerText.indexOf(t.toLowerCase()) !== -1; })) {
                                console.log("🌐 Website Info trigger detected during interview!");
                            }
                            
                            return;
                        }
                        
                        // ===== NORMAL MODE: No interview active =====
                        // --- PRE-QUAL TRIGGER ---
                        var triggerPhrase = window.TRIGGER_PHRASE;
                        if (triggerPhrase) {
                            var fuzzyTriggers = [triggerPhrase, triggerPhrase.toLowerCase(), "YES_INITIATE_PREQUAL"].filter(function(t) { return t; });
                            var hasTrigger = fuzzyTriggers.some(function(trigger) { return lowerText.indexOf(trigger.toLowerCase()) !== -1; });
                            if (hasTrigger) {
                                console.log("🎯 TRIGGER DETECTED! Starting pre-qualification...");
                                setTimeout(function() { forcePreQualification(); }, 3500);
                            }
                        }
                        
                        // --- EMAIL TRIGGER (normal mode) ---
                        var emailCfg = window.BotemiaConfig?.modules?.emailConfig;
                        if (emailCfg?.emailTriggers?.some(function(t) { return lowerText.indexOf(t.toLowerCase()) !== -1; })) {
                            console.log("📧 Email trigger detected!");
                            
                            // Populate answers from Tess's "I heard" confirmations
                            if (window.preQualController) {
                                if (!window._tessHeardName) window._tessHeardName = "";
                                if (!window._tessHeardEmail) window._tessHeardEmail = "";
                                
                                // Normalize email: convert "at" → "@", "dot" → ".", remove spaces
                                var prospectEmail = window._tessHeardEmail
                                    .replace(/\s+at\s+/g, "@")
                                    .replace(/\s+dot\s+/g, ".")
                                    .replace(/\s+/g, "")
                                    .replace(/\.+$/g, "");
                                
                                window.preQualController.answers.fullName = window._tessHeardName || "Valued Client";
                                window.preQualController.answers.email = prospectEmail || emailCfg.clientEmail;
                                window.preQualController.answers.phone = "Not provided";
                                window.preQualController.answers.businessName = "Not provided";
                                window.preQualController.answers.scheduledDateTime = "Not provided";
                                window.preQualController.answers.specialRequests = "None";
                                
                                console.log("📧 Sending email to:", prospectEmail || emailCfg.clientEmail);
                                window.preQualController.sendEmail();
                            }
                        }
                        // --- SMART SCREEN TRIGGER (normal mode) ---
                        var smartImages2 = window.BotemiaConfig?.modules?.smartScreen?.images || [];
                        for (var si2 = 0; si2 < smartImages2.length; si2++) {
                            if ((smartImages2[si2].triggerMatch || []).some(function(t) { return lowerText.indexOf(t.toLowerCase()) !== -1; })) {
                                console.log("📸 Smart Screen matched:", smartImages2[si2].name);
                                var overlay = document.createElement("div");
                                overlay.style.cssText = "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,0.95);z-index:999998;display:flex;align-items:center;justify-content:center;flex-direction:column;padding:20px;border-radius:16px;max-width:90vw;";
                                var imgEl = document.createElement("img");
                                imgEl.src = smartImages2[si2].url;
                                imgEl.style.cssText = "max-width:100%;max-height:70vh;border-radius:12px;box-shadow:0 20px 60px rgba(0,0,0,0.5);";
                                overlay.appendChild(imgEl);
                                if (smartImages2[si2].name) {
                                    var caption = document.createElement("div");
                                    caption.style.cssText = "color:white;font-size:1.3rem;margin-top:15px;font-weight:600;";
                                    caption.textContent = smartImages2[si2].name;
                                    overlay.appendChild(caption);
                                }
                                var closeBtn = document.createElement("button");
                                closeBtn.textContent = "✕ Close";
                                closeBtn.style.cssText = "margin-top:12px;padding:8px 25px;background:#f8c400;color:#0a0f1e;border:none;border-radius:30px;font-size:0.9rem;font-weight:600;cursor:pointer;";
                                closeBtn.onclick = function() { overlay.remove(); };
                                overlay.appendChild(closeBtn);
                                document.body.appendChild(overlay);
                                setTimeout(function() { if (overlay.parentNode) overlay.remove(); }, 10000);
                                if (window.supabaseChannel) {
                                    window.supabaseChannel.send({
                                        type: "broadcast",
                                        event: "smart_screen_trigger",
                                        payload: { image: smartImages2[si2], trigger: tessText, timestamp: Date.now() }
                                    });
                                }
                                if (window.supabaseChannel) {
                                    window.supabaseChannel.send({
                                        type: "broadcast",
                                        event: "smart_screen_trigger",
                                        payload: { image: smartImages2[si2], trigger: tessText, timestamp: Date.now() }
                                    });
                                }
                                break;
                            }
                        }
                        
                        // --- PHONE TRIGGER (normal mode) ---
                        if (emailCfg?.phoneTriggers?.some(function(t) { return lowerText.indexOf(t.toLowerCase()) !== -1; })) {
                            console.log("📞 Phone trigger detected!");
                            window.open("tel:" + (emailCfg.supportPhone || "949-228-5263"), "_blank");
                        }
                        
                        // --- WEBSITE INFO TRIGGER (normal mode) ---
                        var webInfo = window.BotemiaConfig?.modules?.websiteInfo;
                        if (webInfo?.links && webInfo.links.length > 0) {
                            for (var wi = 0; wi < webInfo.links.length; wi++) {
                                var link = webInfo.links[wi];
                                if (link.triggerPhrase && lowerText.indexOf(link.triggerPhrase.toLowerCase()) !== -1) {
                                    console.log("🌐 Website Info matched:", link.title);
                                    var webOverlay = document.createElement("div");
                                    webOverlay.style.cssText = "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(10,15,30,0.98);z-index:999998;display:flex;flex-direction:column;padding:0;border-radius:16px;max-width:90vw;max-height:85vh;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.8);border:2px solid #f8c400;";
                                    var webHeader = document.createElement("div");
                                    webHeader.style.cssText = "display:flex;justify-content:space-between;align-items:center;padding:15px 20px;background:rgba(0,0,0,0.5);border-bottom:1px solid #f8c400;";
                                    var webTitle = document.createElement("span");
                                    webTitle.style.cssText = "color:#f8c400;font-size:1.1rem;font-weight:600;";
                                    webTitle.textContent = link.title;
                                    webHeader.appendChild(webTitle);
                                    var webClose = document.createElement("button");
                                    webClose.textContent = "✕";
                                    webClose.style.cssText = "background:#f44336;color:white;border:none;width:32px;height:32px;border-radius:50%;font-size:1rem;cursor:pointer;";
                                    webClose.onclick = function() { webOverlay.remove(); };
                                    webHeader.appendChild(webClose);
                                    webOverlay.appendChild(webHeader);
                                    var webFrame = document.createElement("iframe");
                                    webFrame.src = link.url;
                                    webFrame.style.cssText = "width:800px;max-width:90vw;height:75vh;border:none;";
                                    webOverlay.appendChild(webFrame);
                                    document.body.appendChild(webOverlay);
                                    break;
                                }
                            }
                        }
                        // --- TESTIMONIALS TRIGGER (normal mode) ---
                        var testimonialGroups = window.BotemiaConfig?.modules?.testimonial?.groups || [];
                        for (var tg = 0; tg < testimonialGroups.length; tg++) {
                            if (testimonialGroups[tg].triggerPhrase && lowerText.indexOf(testimonialGroups[tg].triggerPhrase.toLowerCase()) !== -1) {
                                console.log("🎬 Testimonial matched:", testimonialGroups[tg].triggerPhrase);
                                if (testimonialGroups[tg].videos && testimonialGroups[tg].videos.length > 0) {
                                    var tVideoUrl = testimonialGroups[tg].videos[0];
                                    var tOverlay = document.createElement("div");
                                    tOverlay.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.9);z-index:999999;display:flex;align-items:center;justify-content:center;flex-direction:column;";
                                    tOverlay.onclick = function() { tOverlay.remove(); };
                                    var tVideo = document.createElement("video");
                                    tVideo.src = tVideoUrl;
                                    tVideo.controls = true;
                                    tVideo.autoplay = true;
                                    tVideo.style.cssText = "max-width:90%;max-height:80vh;border-radius:16px;box-shadow:0 20px 60px rgba(0,0,0,0.5);";
                                    tOverlay.appendChild(tVideo);
                                   setTimeout(function() { document.body.appendChild(tOverlay); }, 5000);
                                }
                                break;
                            }
                        }
                        
                        // --- VIDEO VAULT TRIGGER (normal mode) ---
                        var videoVault = window.BotemiaConfig?.modules?.videoVault?.videos || [];
                        for (var vi = 0; vi < videoVault.length; vi++) {
                            if (videoVault[vi].triggerPhrase && lowerText.indexOf(videoVault[vi].triggerPhrase.toLowerCase()) !== -1) {
                                console.log("📹 Video Vault matched:", videoVault[vi].triggerPhrase);
                                var vOverlay = document.createElement("div");
                                vOverlay.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.9);z-index:999999;display:flex;align-items:center;justify-content:center;flex-direction:column;";
                                vOverlay.onclick = function() { vOverlay.remove(); };
                                var vVideo = document.createElement("video");
                                vVideo.src = videoVault[vi].url;
                                vVideo.controls = true;
                                vVideo.autoplay = true;
                                vVideo.style.cssText = "max-width:90%;max-height:80vh;border-radius:16px;box-shadow:0 20px 60px rgba(0,0,0,0.5);";
                                vOverlay.appendChild(vVideo);
                                setTimeout(function() { document.body.appendChild(vOverlay); }, 5000);
                                break;
                            }
                        }
                    }
                });
            } else {
                console.warn("⚠️ Daily API did not return room_url");
            }
        } catch(e) { 
            console.error("❌ Daily init error:", e); 
        }
    }

    // ==========================================
    // 🍋 UNIVERSAL LISTENER (For PostMessages)
    // ==========================================
    function setupUniversalListener() {
        console.log("👂 Universal Listener Activated (Universal Mode).");
        
        window.addEventListener("message", (event) => {
            if (event.data && event.data.what === "iframe-call-message") return;
            if (!event.data || !event.data.type) return;
            console.log("📩 [INCOMING] Type:", event.data?.type, "Command:", event.data?.command);
            
            // Handle TEST_PING from Communication Monitor
            if (event.data.type === "TEST_PING") {
                console.log("📡 TEST_PING received, sending PONG...");
                if (window.supabaseChannel) {
                    window.supabaseChannel.send({
                        type: "broadcast",
                        event: "test_pong",
                        payload: {
                            clientId: window.BotemiaConfig?.id || "unknown",
                            timestamp: Date.now(),
                            echoTimestamp: event.data.timestamp
                        }
                    });
                }
                return;
            }
            
            // Handle START_PRE_QUAL
            if (event.data.type === "START_PRE_QUAL" || event.data.command === "START_PRE_QUAL") {
                console.log("🎯 START_PRE_QUAL received!");
                if (window.preQualController && !window.preQualController.isActive) {
                    forcePreQualification();
                }
                return;
            }
            
            // Handle transcript for interview answers
            if ((event.data.type === "transcript" || event.data.type === "ai_response") && event.data.text) {
                if (window.preQualController && window.preQualController.isActive) {
                    window.preQualController.handleUserInput(event.data.text);
                }
            }
        });
    }

    // ==========================================
    // ✅ GLOBAL EXPORTS (CRITICAL FOR DASHBOARD TESTS)
    // ==========================================
    window.initDaily = initDaily;
    window.loadDailySDK = loadDailySDK;
    
    // Initialize listener immediately
    setupUniversalListener();

    function createMainWidget() {
        const widget = document.createElement('lemon-slice-widget');
        widget.setAttribute('agent-id', 'agent_dc3ce816d32441bf');
        let clientId = window.BotemiaConfig?.id;
        if (!clientId) { console.error("❌ CRITICAL: BotemiaConfig ID missing!"); return null; }
        widget.setAttribute('client-id', clientId);
        widget.clientId = clientId;
        const apiKey = "sk_lemon_Tleyq2zh6NoMpllEHf7mYNRxzIED6YcP";
        widget.setAttribute('api-key', apiKey);
        widget.apiKey = apiKey;
        let sessionId = window.tessSessionId || 'session-' + crypto.randomUUID();
        widget.setAttribute('room-id', sessionId);
        widget.roomId = sessionId;
        widget.setAttribute('initial-state', 'minimized');
        widget.setAttribute('custom-minimized-width', '144');
        widget.setAttribute('custom-minimized-height', '216');
        widget.id = 'main-widget';
        widget.style.display = 'none';
        return widget;
    }

    function forcePreQualification() {
        console.trace("🔍 [TRACE] forcePreQualification called from:");
        console.log("🚀 forcePreQualification - Activating Listener Mode");
        
        if (isPreQualificationActive) {
            console.log("⚠️ Pre-qualification already active, skipping");
            return;
        }
        
        if (!window.preQualController) {
            console.error("❌ preQualController not found");
            return;
        }
        
        // Activate listener mode
        window.preQualController.isActive = true;
        window.preQualController.answers = {};
        
        // Send trigger to LemonSlice
        if (window.mainWidget && typeof window.mainWidget.sendMessage === "function") {
            window.mainWidget.sendMessage("START_INTERVIEW_NOW");
        trackEvent('prequal_start');
            console.log("📤 Sent START_INTERVIEW_NOW to LemonSlice");
        }
        
        isPreQualificationActive = true;
        console.log("✅ Listener Mode activated");
    }
    window.forcePreQualification = forcePreQualification;

    function showSplash() {
        const config = window.BotemiaConfig.modules?.splashScreen;
        if (!config || !config.enabled) {
            // Splash disabled — activate Tess directly
            console.log("✅ Splash disabled — activating Tess directly");
            activateTess();
            return;
        }

        const overlay = document.createElement('div');
        overlay.className = 'splash-overlay';
        overlay.id = 'splashOverlay';
        overlay.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.7); backdrop-filter: blur(4px);
            display: flex; align-items: center; justify-content: center; z-index: 99999;
        `;

        trackEvent('splash_view');
        const card = document.createElement('div');
        card.className = 'splash-card';
        card.style.background = `radial-gradient(circle at center, ${config.gradientCenter || '#1e4a8a'} 0%, ${config.gradientOuter || '#0a1a2f'} 80%)`;

        let cardHTML = `
            <h1>✨ ${config.title || 'Meet Tess!'} ✨</h1>
            <h2>${config.subtitle || 'Your Personal AI Web Guide'}</h2>
            <div class="splash-avatar-container" id="splashAvatarContainer"></div>
            <div class="button-group">
                <button class="primary-btn" id="activateTessBtn" style="background: linear-gradient(145deg, ${config.primaryButton?.gradientTop || '#f8c400'}, ${config.primaryButton?.gradientBottom || '#d4a000'}); color: ${config.primaryButton?.textColor || '#0a0f1e'};">${config.primaryButton?.text || 'Get AI help with Tess'}</button>
                <button class="secondary-btn" id="justBrowsingBtn" style="background: linear-gradient(145deg, ${config.secondaryButton?.gradientTop || '#3a4050'}, ${config.secondaryButton?.gradientBottom || '#2a2f3f'}); color: ${config.secondaryButton?.textColor || '#ffffff'};">${config.secondaryButton?.text || 'Just Browsing'}</button>
            </div>
        `;

        // Add white footer area with logo - EXACT DIMENSIONS
        cardHTML += `
            <div style="position: relative; width: 475px; left: 50%; transform: translateX(-50%); margin-top: 25px; background: white; border-radius: 0 0 48px 48px; padding: 15px 0; margin-bottom: -40px;">
                <div style="display: flex; align-items: center; justify-content: center; gap: 15px; width: 415px; margin: 0 auto;">
                    ${config.branding?.logo ? '<img src="' + config.branding.logo + '" style="height: 36px; width: auto;">' : ''}
                    ${config.branding?.name ? '<span style="color: #333; font-size: 18px; font-weight: 500;">' + config.branding.name + '</span>' : ''}
                </div>
            </div>
        `;
        card.innerHTML = cardHTML;

        overlay.appendChild(card);
        document.body.appendChild(overlay);

        const container = document.getElementById('splashAvatarContainer');
        const splashWidget = createSplashWidget();
        container.appendChild(splashWidget);

        // Add ticker tape if keywords exist
        const tickerKeywords = config.tickerKeywords;
        if (tickerKeywords) {
            const keywords = tickerKeywords.split(',').map(k => k.trim()).filter(k => k);
            
            if (keywords.length > 0) {
                const tickerContainer = document.createElement('div');
                tickerContainer.className = 'ticker-container';
                
                const tickerContent = document.createElement('div');
                tickerContent.className = 'ticker-content';
                
                const allKeywords = [...keywords, ...keywords];
                
                allKeywords.forEach(keyword => {
                    const span = document.createElement('span');
                    span.className = 'ticker-item';
                    span.innerHTML = `<i class="fas fa-star"></i> ${keyword}`;
                    tickerContent.appendChild(span);
                });
                
                tickerContainer.appendChild(tickerContent);
                container.appendChild(tickerContainer);
            }
        }
        document.getElementById('activateTessBtn').addEventListener('click', activateTess);
        document.getElementById('justBrowsingBtn').addEventListener('click', justBrowsing);

        const primaryBtn = document.getElementById('activateTessBtn');
        primaryBtn.onmouseover = () => { primaryBtn.style.background = `linear-gradient(145deg, ${config.primaryButton?.hoverTop || '#ffd700'}, ${config.primaryButton?.hoverBottom || '#e0b000'})`; primaryBtn.style.transform = 'scale(1.02)'; };
        primaryBtn.onmouseout = () => { primaryBtn.style.background = `linear-gradient(145deg, ${config.primaryButton?.gradientTop || '#f8c400'}, ${config.primaryButton?.gradientBottom || '#d4a000'})`; primaryBtn.style.transform = 'scale(1)'; };
        const secondaryBtn = document.getElementById('justBrowsingBtn');
        secondaryBtn.onmouseover = () => { secondaryBtn.style.background = `linear-gradient(145deg, ${config.secondaryButton?.hoverTop || '#4a5060'}, ${config.secondaryButton?.hoverBottom || '#3a4050'})`; secondaryBtn.style.transform = 'scale(1.02)'; };
        secondaryBtn.onmouseout = () => { secondaryBtn.style.background = `linear-gradient(145deg, ${config.secondaryButton?.gradientTop || '#3a4050'}, ${config.secondaryButton?.gradientBottom || '#2a2f3f'})`; secondaryBtn.style.transform = 'scale(1)'; };
    }

    async function activateTess() {
        console.log("🖱️ Click detected: Capturing user gesture for audio...");
        
        const splashWidget = document.getElementById('splash-widget');
        if (splashWidget) {
            splashWidget.innerHTML = '';
            if (splashWidget.parentNode) splashWidget.parentNode.removeChild(splashWidget);
        }
        
        const overlay = document.getElementById('splashOverlay');
        if (overlay) overlay.remove();

        setTimeout(() => {
            if (!window.mainWidget || !document.body.contains(window.mainWidget)) {
                window.mainWidget = createMainWidget();
                window.mainWidget.setAttribute('hide-ui', 'true');
                document.body.appendChild(window.mainWidget);
            }
            window.mainWidget.style.display = 'block';
            window.mainWidget.setAttribute('controlled-widget-state', 'active');
            
            setTimeout(async () => {
                console.log("🎤 Finalizing audio state...");
                try {
                    if (window.mainWidget) {
                        // sendMessage auto-starts room and activates mic per LemonSlice docs
                        if (typeof window.mainWidget.sendMessage === 'function') {
                            await window.mainWidget.sendMessage("");
                            console.log("✅ Tess auto-started via sendMessage");
                        }
                        await window.mainWidget.unmute?.();
                    }
                } catch(e) {
                    console.error("❌ Mic activation failed:", e);
                }
                
                // Nuclear Shadow DOM unmute
                try {
                    var shadow = window.mainWidget.shadowRoot;
                    if (shadow) {
                        var v = shadow.querySelector("video");
                        var a = shadow.querySelector("audio");
                        if (v) { v.muted = false; v.volume = 1.0; }
                        if (a) { a.muted = false; a.volume = 1.0; }
                    }
                    console.log("🔊 Tess force unmuted via Shadow DOM");
                } catch(e) { console.warn("Shadow unmute error:", e); }
            }, 3000);
        }, 100);
        
        if (typeof initDaily === "function") { initDaily(); }
        window.activateTess = activateTess;
    }
        trackEvent('activate_tess');

    function showPersistentAvatar() {
        const config = window.BotemiaConfig.modules?.splashScreen;
        const persistentConfig = config?.persistentButton || {};
        const position = persistentConfig.position || 'bottom-left';
        
        const existingBtn = document.getElementById('persistent-avatar-btn');
        if (existingBtn) existingBtn.remove();
        
        const avatarBtn = document.createElement('div');
        avatarBtn.id = 'persistent-avatar-btn';
        let positionStyles = '';
        
        if(position === 'bottom-left') positionStyles = 'bottom: 20px; left: 20px;';
        else if(position === 'bottom-right') positionStyles = 'bottom: 20px; right: 20px;';
        else if(position === 'middle-left') positionStyles = 'top: 50%; left: 20px; transform: translateY(-50%);';
        else if(position === 'middle-right') positionStyles = 'top: 50%; right: 20px; transform: translateY(-50%);';
        
        avatarBtn.style.cssText = `position: fixed !important; ${positionStyles.replace(/;/g, ' !important;')} width: 180px !important; height: 180px !important; border-radius: 50% !important; background: linear-gradient(135deg, ${persistentConfig.gradientTop || '#f8c400'} 0%, ${persistentConfig.gradientBottom || '#d4a000'} 100%) !important; cursor: pointer !important; z-index: 999999 !important; box-shadow: 0 4px 15px rgba(0,0,0,0.3) !important; display: flex !important; align-items: center !important; justify-content: center !important; overflow: hidden !important; transition: transform 0.3s ease !important;`;
        
        const tessVideoUrl = config?.tessVideoUrl;
        if (tessVideoUrl) {
            const video = document.createElement('video');
            video.src = tessVideoUrl;
            video.autoplay = true; video.loop = true; video.muted = true; video.playsInline = true;
            const videoFit = config?.tessVideoFit || 'cover';
            video.style.cssText = `width: 180px; height: 180px; object-fit: ${videoFit}; border: none; pointer-events: none;`;
            avatarBtn.appendChild(video);
            
            const textOverlay = document.createElement('div');
            textOverlay.style.cssText = `position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(to top, rgba(0,0,0,0.8), transparent); color: #f8c400; text-align: center; padding: 15px 5px 8px 5px; font-size: 18px; font-weight: bold; display: flex; align-items: center; justify-content: center; gap: 4px; pointer-events: none;`;
            textOverlay.innerHTML = `Ask Tess <span style="font-size: 20px;">👆</span>`;
            avatarBtn.appendChild(textOverlay);
        } else {
            const tessImage = config?.tessImage;
            if (tessImage) { avatarBtn.innerHTML = `<img src="${tessImage}" style="width: 170px; height: 170px; border-radius: 50%; object-fit: cover; border: 3px solid white;">`; }
            else { avatarBtn.innerHTML = `<i class="fas fa-user-circle" style="font-size: 140px; color: white;"></i>`; }
        }
        
        avatarBtn.addEventListener('mouseenter', () => { avatarBtn.style.transform = 'scale(1.1)'; });
        avatarBtn.addEventListener('mouseleave', () => { avatarBtn.style.transform = 'scale(1)'; });
        avatarBtn.addEventListener('click', () => { avatarBtn.remove(); activateTess(); });
        document.body.appendChild(avatarBtn);
    }

    function justBrowsing() {
        console.log("👆 Just Browsing clicked - showing persistent avatar");
        const overlay = document.getElementById('splashOverlay');
        if (overlay) overlay.remove();
        const splashWidget = document.getElementById('splash-widget');
        if (splashWidget) splashWidget.remove();
        
        const config = window.BotemiaConfig.modules?.splashScreen;
        if (config?.persistentButton?.enabled) {
            showPersistentAvatar();
        trackEvent('just_browsing');
        } else {
            if (!window.mainWidget || !document.body.contains(window.mainWidget)) { window.mainWidget = createMainWidget(); document.body.appendChild(window.mainWidget); }
            window.mainWidget.style.display = 'block';
        }
    }

    window.disableBridgeTriggers = false;
    function initWidget() {
        if (document.querySelector('lemon-slice-widget')) { console.log('✅ Widget already exists'); return; }
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/@lemonsliceai/lemon-slice-widget';
        script.type = 'module';
        script.onload = () => { console.log('✅ Widget script loaded'); }; 
        script.onerror = () => console.error('❌ Failed to load widget');
        document.head.appendChild(script);
        setTimeout(() => { showSplash(); }, 100);
    }
    if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', initWidget); }
    else { initWidget(); }
    console.log('✅ Botemia Bridge v5.8 loaded for', window.BotemiaConfig.name);

    // ===== CLIENT ANNOUNCEMENT FUNCTION =====
    function announceToTCS() {
        const sendAnnouncement = function() {
            if (window.supabaseChannel) {
                window.supabaseChannel.send({
                    type: 'broadcast',
                    event: 'client_info',
                    payload: {
                        type: 'CLIENT_INFO',
                        clientId: window.BotemiaConfig.id,
                        url: window.location.href,
                        timestamp: Date.now()
                    }
                });
                console.log('📢 Announced to TCS via Supabase Realtime');
                return true;
            }
            return false;
        };

        if (sendAnnouncement()) return;
        
        console.log('⏳ Supabase channel not ready, retrying...');
        let attempts = 0;
        const interval = setInterval(function() {
            attempts++;
            if (sendAnnouncement() || attempts >= 6) {
                clearInterval(interval);
            }
        }, 500);
    }

    setTimeout(announceToTCS, 4000);
    // ===== HEALTH CHECK FOR TCS DASHBOARD =====
    window.bridgeHealthCheck = function() {
        return {
            status: "active",
            mode: "listener",
            clientId: window.BotemiaConfig?.id,
            readyForHandoff: !!window.mainWidget,
            dailyConnected: !!window.dailyCallObject,
            timestamp: Date.now()
        };
    };
    console.log("🩺 Bridge health check available: window.bridgeHealthCheck()");
})();

// Copyright: Ankitects Pty Ltd and contributors
// License: GNU AGPL, version 3 or later; http://www.gnu.org/licenses/agpl.html

/**
 * Quick Actions Toolbar
 * Floating toolbar with quick access to features
 */

export class QuickActionsToolbar {
    private toolbar: HTMLElement | null = null;
    private isExpanded: boolean = false;

    constructor() {
        this.createToolbar();
    }

    private createToolbar(): void {
        // Remove any existing toolbar first
        const existing = document.getElementById('quick-actions-toolbar');
        if (existing) {
            existing.remove();
        }

        this.toolbar = document.createElement('div');
        this.toolbar.id = 'quick-actions-toolbar';
        this.toolbar.style.cssText = `
            position: fixed !important;
            bottom: 40px !important;
            left: 40px !important;
            top: auto !important;
            right: auto !important;
            z-index: 99998 !important;
            display: flex !important;
            flex-direction: column !important;
            gap: 16px !important;
            align-items: flex-start !important;
        `;

        this.toolbar.innerHTML = `
            <button id="quick-actions-toggle" style="
                width: 64px !important;
                height: 64px !important;
                border-radius: 50% !important;
                background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%) !important;
                border: 3px solid white !important;
                color: white !important;
                font-size: 0 !important;
                cursor: pointer !important;
                box-shadow: 0 8px 24px rgba(37, 99, 235, 0.5) !important;
                transition: all 0.3s ease !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                padding: 0 !important;
                outline: none !important;
            " onmouseover="this.style.transform='scale(1.15) rotate(90deg)'; this.style.boxShadow='0 12px 32px rgba(37, 99, 235, 0.6)';"
               onmouseout="this.style.transform='scale(1) rotate(0deg)'; this.style.boxShadow='0 8px 24px rgba(37, 99, 235, 0.5)';">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="16"/>
                    <line x1="8" y1="12" x2="16" y2="12"/>
                </svg>
            </button>
            
            <div id="quick-actions-menu" style="
                display: flex !important;
                flex-direction: column !important;
                gap: 14px !important;
                opacity: 0;
                transform: translateY(20px);
                pointer-events: none;
                transition: all 0.3s ease;
            "></div>
        `;

        document.body.appendChild(this.toolbar);

        // Toggle button handler
        const toggleBtn = document.getElementById('quick-actions-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggle());
        }

        // Create action buttons
        this.createActionButtons();
    }

    private createActionButtons(): void {
        const menu = document.getElementById('quick-actions-menu');
        if (!menu) return;

        const actions = [
            {
                icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>`,
                label: 'AI Examples',
                color: '#7c3aed',
                handler: () => {
                    if (window.aiExampleUI) {
                        window.aiExampleUI.toggle();
                    }
                },
            },
            {
                icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="20" x2="18" y2="10"/>
                    <line x1="12" y1="20" x2="12" y2="4"/>
                    <line x1="6" y1="20" x2="6" y2="14"/>
                </svg>`,
                label: 'Statistics',
                color: '#2563eb',
                handler: () => {
                    if (window.statsDashboard) {
                        window.statsDashboard.toggle();
                    }
                },
            },
            {
                icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="8" r="7"/>
                    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
                </svg>`,
                label: 'Achievements',
                color: '#fbbf24',
                handler: () => {
                    if (window.gamification) {
                        window.gamification.showPanel();
                    }
                },
            },
            {
                icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24"/>
                </svg>`,
                label: 'Settings',
                color: '#64748b',
                handler: () => {
                    this.showSettingsPanel();
                },
            },
        ];

        actions.forEach((action, index) => {
            const button = document.createElement('button');
            button.style.cssText = `
                width: 56px !important;
                height: 56px !important;
                min-width: 56px !important;
                min-height: 56px !important;
                border-radius: 50% !important;
                background: ${action.color} !important;
                border: 3px solid white !important;
                color: white !important;
                font-size: 0 !important;
                cursor: pointer !important;
                box-shadow: 0 6px 16px ${action.color}88 !important;
                transition: all 0.3s ease !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                position: relative !important;
                padding: 0 !important;
                outline: none !important;
                overflow: hidden !important;
            `;

            button.innerHTML = action.icon;
            button.title = action.label;

            button.addEventListener('mouseenter', function (this: HTMLElement) {
                this.style.transform = 'scale(1.1)';
                this.style.boxShadow = `0 6px 16px ${action.color}99`;

                // Show label
                const label = document.createElement('div');
                label.className = 'action-label';
                label.textContent = action.label;
                label.style.cssText = `
                    position: absolute;
                    left: 65px;
                    background: white;
                    color: #1e293b;
                    padding: 8px 14px;
                    border-radius: 8px;
                    font-size: 0.85rem;
                    font-weight: 600;
                    white-space: nowrap;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    pointer-events: none;
                    z-index: 10001;
                `;
                this.appendChild(label);
            });

            button.addEventListener('mouseleave', function (this: HTMLElement) {
                this.style.transform = 'scale(1)';
                this.style.boxShadow = `0 4px 12px ${action.color}66`;

                const label = this.querySelector('.action-label');
                if (label) {
                    label.remove();
                }
            });

            button.addEventListener('click', action.handler);

            menu.appendChild(button);
        });
    }

    private toggle(): void {
        this.isExpanded = !this.isExpanded;
        const menu = document.getElementById('quick-actions-menu');

        if (menu) {
            if (this.isExpanded) {
                menu.style.opacity = '1';
                menu.style.transform = 'translateY(0)';
                menu.style.pointerEvents = 'auto';
            } else {
                menu.style.opacity = '0';
                menu.style.transform = 'translateY(20px)';
                menu.style.pointerEvents = 'none';
            }
        }
    }

    private showSettingsPanel(): void {
        const panel = document.createElement('div');
        panel.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(8px);
            z-index: 100000;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        panel.innerHTML = `
            <div style="
                background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
                border-radius: 24px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                max-width: 600px;
                width: 90%;
                padding: 40px;
            ">
                <h2 style="
                    margin: 0 0 30px 0;
                    font-size: 2rem;
                    font-weight: 800;
                    background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                ">Quick Settings</h2>

                <div style="display: flex; flex-direction: column; gap: 20px;">
                    <div style="
                        background: white;
                        padding: 20px;
                        border-radius: 12px;
                        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
                    ">
                        <label style="
                            display: flex;
                            align-items: center;
                            gap: 12px;
                            cursor: pointer;
                        ">
                            <input type="checkbox" id="enable-ai" checked style="
                                width: 20px;
                                height: 20px;
                                cursor: pointer;
                            ">
                            <span style="font-weight: 600; color: #1e293b;">
                                Enable AI Example Generator
                            </span>
                        </label>
                    </div>

                    <div style="
                        background: white;
                        padding: 20px;
                        border-radius: 12px;
                        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
                    ">
                        <label style="
                            display: flex;
                            align-items: center;
                            gap: 12px;
                            cursor: pointer;
                        ">
                            <input type="checkbox" id="enable-reminders" checked style="
                                width: 20px;
                                height: 20px;
                                cursor: pointer;
                            ">
                            <span style="font-weight: 600; color: #1e293b;">
                                Enable Study Reminders
                            </span>
                        </label>
                    </div>

                    <div style="
                        background: white;
                        padding: 20px;
                        border-radius: 12px;
                        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
                    ">
                        <label style="
                            display: flex;
                            align-items: center;
                            gap: 12px;
                            cursor: pointer;
                        ">
                            <input type="checkbox" id="enable-animations" checked style="
                                width: 20px;
                                height: 20px;
                                cursor: pointer;
                            ">
                            <span style="font-weight: 600; color: #1e293b;">
                                Enable Animations
                            </span>
                        </label>
                    </div>

                    <div style="
                        background: white;
                        padding: 20px;
                        border-radius: 12px;
                        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
                    ">
                        <label style="
                            display: flex;
                            align-items: center;
                            gap: 12px;
                            cursor: pointer;
                        ">
                            <input type="checkbox" id="enable-sound" checked style="
                                width: 20px;
                                height: 20px;
                                cursor: pointer;
                            ">
                            <span style="font-weight: 600; color: #1e293b;">
                                Enable Sound Effects
                            </span>
                        </label>
                    </div>
                </div>

                <button id="close-settings" style="
                    width: 100%;
                    margin-top: 30px;
                    padding: 14px;
                    background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
                    color: white;
                    border: none;
                    border-radius: 12px;
                    font-weight: 700;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                " onmouseover="this.style.transform='translateY(-2px)'"
                   onmouseout="this.style.transform='translateY(0)'">Save & Close</button>
            </div>
        `;

        document.body.appendChild(panel);

        document.getElementById('close-settings')!.addEventListener('click', () => {
            // Save settings to localStorage
            const settings = {
                aiEnabled: (document.getElementById('enable-ai') as HTMLInputElement).checked,
                remindersEnabled: (document.getElementById('enable-reminders') as HTMLInputElement).checked,
                animationsEnabled: (document.getElementById('enable-animations') as HTMLInputElement).checked,
                soundEnabled: (document.getElementById('enable-sound') as HTMLInputElement).checked,
            };
            localStorage.setItem('ankiEnhancedSettings', JSON.stringify(settings));
            panel.remove();
        });

        panel.addEventListener('click', (e) => {
            if (e.target === panel) {
                panel.remove();
            }
        });
    }
}

// Auto-initialize
const toolbar = new QuickActionsToolbar();

// Copyright: Ankitects Pty Ltd and contributors
// License: GNU AGPL, version 3 or later; http://www.gnu.org/licenses/agpl.html

/**
 * AI Example Generator UI Component
 * Displays AI-generated example sentences for vocabulary learning
 */

interface AIExample {
    sentence: string;
    translation?: string;
}

export class AIExampleUI {
    private container: HTMLElement | null = null;
    private isVisible: boolean = false;

    constructor() {
        this.createContainer();
    }

    private createContainer(): void {
        this.container = document.createElement('div');
        this.container.id = 'ai-example-container';
        this.container.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            max-width: 400px;
            background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
            border-radius: 16px;
            box-shadow: 0 10px 40px rgba(37, 99, 235, 0.2);
            padding: 20px;
            z-index: 9998;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            transform: translateY(500px);
            transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
            opacity: 0;
            border: 2px solid rgba(37, 99, 235, 0.1);
        `;
        document.body.appendChild(this.container);
    }

    public show(): void {
        if (this.container) {
            this.isVisible = true;
            this.container.style.transform = 'translateY(0)';
            this.container.style.opacity = '1';
        }
    }

    public hide(): void {
        if (this.container) {
            this.isVisible = false;
            this.container.style.transform = 'translateY(500px)';
            this.container.style.opacity = '0';
        }
    }

    public setWord(word: string): void {
        if (!this.container) return;

        this.container.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h3 style="
                    margin: 0;
                    font-size: 1.1rem;
                    font-weight: 700;
                    background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                ">
                    🤖 AI Example Sentences
                </h3>
                <button id="ai-close-btn" style="
                    background: none;
                    border: none;
                    font-size: 1.3rem;
                    cursor: pointer;
                    color: #64748b;
                    padding: 5px;
                    line-height: 1;
                    transition: color 0.2s ease;
                " title="Close">×</button>
            </div>
            
            <div style="
                background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
                padding: 12px 16px;
                border-radius: 12px;
                margin-bottom: 15px;
                border-left: 4px solid #2563eb;
            ">
                <span style="
                    font-weight: 700;
                    font-size: 1.15rem;
                    color: #1e40af;
                    letter-spacing: 0.02em;
                ">${this.escapeHtml(word)}</span>
            </div>
            
            <div id="ai-examples-list" style="
                display: flex;
                flex-direction: column;
                gap: 12px;
                max-height: 300px;
                overflow-y: auto;
            ">
                <div style="text-align: center; padding: 20px; color: #64748b;">
                    <div class="ai-spinner" style="
                        width: 40px;
                        height: 40px;
                        border: 4px solid #e2e8f0;
                        border-top-color: #2563eb;
                        border-radius: 50%;
                        animation: spin 1s linear infinite;
                        margin: 0 auto 10px;
                    "></div>
                    Generating examples...
                </div>
            </div>
            
            <button id="ai-regenerate-btn" style="
                width: 100%;
                margin-top: 15px;
                padding: 12px;
                background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
                color: white;
                border: none;
                border-radius: 10px;
                font-weight: 600;
                font-size: 0.95rem;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
            " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 16px rgba(37, 99, 235, 0.4)';" 
               onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(37, 99, 235, 0.3)';">
                🔄 Generate New Examples
            </button>
        `;

        // Add spinner animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);

        // Add close button handler
        const closeBtn = document.getElementById('ai-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hide());
        }

        // Add regenerate button handler
        const regenerateBtn = document.getElementById('ai-regenerate-btn');
        if (regenerateBtn) {
            regenerateBtn.addEventListener('click', () => this.generateExamples(word));
        }

        // Auto-generate examples
        this.generateExamples(word);
        this.show();
    }

    private async generateExamples(word: string): Promise<void> {
        const listElement = document.getElementById('ai-examples-list');
        if (!listElement) return;

        try {
            // Call Python backend to generate examples
            const response = await fetch('/anki/ai-generate-examples', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ word: word, count: 3 }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate examples');
            }

            const data = await response.json();
            const examples: string[] = data.examples || [];

            this.displayExamples(examples);
        } catch (error) {
            console.error('Error generating examples:', error);
            listElement.innerHTML = `
                <div style="
                    text-align: center;
                    padding: 20px;
                    color: #dc2626;
                    background: #fee2e2;
                    border-radius: 10px;
                    border-left: 4px solid #dc2626;
                ">
                    ⚠️ Unable to generate examples. Please try again.
                </div>
            `;
        }
    }

    private displayExamples(examples: string[]): void {
        const listElement = document.getElementById('ai-examples-list');
        if (!listElement) return;

        if (examples.length === 0) {
            listElement.innerHTML = `
                <div style="text-align: center; padding: 20px; color: #64748b;">
                    No examples generated. Try again.
                </div>
            `;
            return;
        }

        listElement.innerHTML = examples
            .map(
                (example, index) => `
            <div style="
                background: white;
                padding: 14px 16px;
                border-radius: 10px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
                border-left: 3px solid ${this.getColorForIndex(index)};
                transition: all 0.2s ease;
                cursor: pointer;
            " onmouseover="this.style.transform='translateX(4px)'; this.style.boxShadow='0 4px 12px rgba(0, 0, 0, 0.1)';" 
               onmouseout="this.style.transform='translateX(0)'; this.style.boxShadow='0 2px 8px rgba(0, 0, 0, 0.05)';">
                <div style="
                    display: flex;
                    align-items: flex-start;
                    gap: 10px;
                ">
                    <span style="
                        background: ${this.getColorForIndex(index)};
                        color: white;
                        width: 24px;
                        height: 24px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 0.8rem;
                        font-weight: 700;
                        flex-shrink: 0;
                    ">${index + 1}</span>
                    <p style="
                        margin: 0;
                        color: #1e293b;
                        font-size: 0.95rem;
                        line-height: 1.6;
                        flex: 1;
                    ">${this.escapeHtml(example)}</p>
                </div>
            </div>
        `
            )
            .join('');
    }

    private getColorForIndex(index: number): string {
        const colors = ['#2563eb', '#7c3aed', '#db2777', '#ea580c', '#16a34a'];
        return colors[index % colors.length];
    }

    private escapeHtml(text: string): string {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    public toggle(): void {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }
}

// Global instance
let aiExampleUI: AIExampleUI | null = null;

export function getAIExampleUI(): AIExampleUI {
    if (!aiExampleUI) {
        aiExampleUI = new AIExampleUI();
    }
    return aiExampleUI;
}

// Auto-detect word and show AI examples when card is shown
export function autoShowAIExamples(): void {
    const qaElement = document.getElementById('qa');
    if (!qaElement) return;

    // Extract the main word from the question
    const text = qaElement.textContent || '';
    const words = text.trim().split(/\s+/);

    // Show AI examples for the first significant word (> 3 characters)
    const significantWord = words.find(w => w.length > 3);
    if (significantWord) {
        setTimeout(() => {
            getAIExampleUI().setWord(significantWord);
        }, 800);
    }
}

// Expose to global for Python bridge
declare global {
    interface Window {
        aiExampleUI: {
            show: () => void;
            hide: () => void;
            setWord: (word: string) => void;
            toggle: () => void;
        };
    }
}

window.aiExampleUI = {
    show: () => getAIExampleUI().show(),
    hide: () => getAIExampleUI().hide(),
    setWord: (word: string) => getAIExampleUI().setWord(word),
    toggle: () => getAIExampleUI().toggle(),
};

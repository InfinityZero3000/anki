// Copyright: Ankitects Pty Ltd and contributors
// License: GNU AGPL, version 3 or later; http://www.gnu.org/licenses/agpl.html

/**
 * Modern Theme Enhancements for Anki Reviewer
 * Adds smooth animations and visual effects
 */

// Card flip animation with 3D effect
export function addCardFlipEffect(): void {
    const qaElement = document.getElementById('qa');
    if (!qaElement) return;

    // Add perspective to parent
    if (qaElement.parentElement) {
        qaElement.parentElement.style.perspective = '1000px';
    }

    // Initial load animation
    qaElement.style.opacity = '0';
    qaElement.style.transform = 'translateY(30px)';
    
    requestAnimationFrame(() => {
        qaElement.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        qaElement.style.opacity = '1';
        qaElement.style.transform = 'translateY(0)';
    });
}

// Smooth transition when showing answer
export function addAnswerRevealAnimation(): void {
    const qaElement = document.getElementById('qa');
    if (!qaElement) return;

    // Add a subtle scale and fade effect
    qaElement.style.transform = 'scale(0.98)';
    qaElement.style.opacity = '0.7';
    
    setTimeout(() => {
        qaElement.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        qaElement.style.transform = 'scale(1)';
        qaElement.style.opacity = '1';
    }, 50);
}

// Add pulse effect to buttons on hover
export function enhanceButtonInteractions(): void {
    const buttons = document.querySelectorAll('button');
    
    buttons.forEach((button) => {
        button.addEventListener('mouseenter', function(this: HTMLElement) {
            this.style.transform = 'translateY(-3px) scale(1.05)';
        });
        
        button.addEventListener('mouseleave', function(this: HTMLElement) {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        button.addEventListener('mousedown', function(this: HTMLElement) {
            this.style.transform = 'translateY(-1px) scale(1.02)';
        });
    });
}

// Add gradient background effect
export function addDynamicBackground(): void {
    const body = document.body;
    
    // Create gradient overlay
    const gradient = document.createElement('div');
    gradient.id = 'modern-gradient-overlay';
    gradient.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
        background: linear-gradient(135deg, 
            rgba(37, 99, 235, 0.03) 0%, 
            rgba(59, 130, 246, 0.02) 50%,
            rgba(96, 165, 250, 0.03) 100%);
        opacity: 0;
        transition: opacity 0.5s ease;
    `;
    
    body.appendChild(gradient);
    
    setTimeout(() => {
        gradient.style.opacity = '1';
    }, 100);
}

// Add typing indicator animation
export function enhanceTypeAnswer(): void {
    const typeans = document.getElementById('typeans') as HTMLInputElement;
    if (!typeans) return;

    typeans.addEventListener('focus', function(this: HTMLInputElement) {
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 0 0 4px rgba(37, 99, 235, 0.15), 0 8px 16px rgba(37, 99, 235, 0.12)';
    });

    typeans.addEventListener('blur', function(this: HTMLInputElement) {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.08)';
    });

    // Add typing animation
    typeans.addEventListener('input', function(this: HTMLInputElement) {
        this.style.borderColor = '#3b82f6';
    });
}

// Add progress indicator
export function addProgressIndicator(current: number, total: number): void {
    let progressBar = document.getElementById('modern-progress-bar');
    
    if (!progressBar) {
        progressBar = document.createElement('div');
        progressBar.id = 'modern-progress-bar';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            height: 3px;
            background: linear-gradient(90deg, #2563eb 0%, #3b82f6 50%, #60a5fa 100%);
            z-index: 9999;
            transition: width 0.3s ease;
            box-shadow: 0 0 10px rgba(37, 99, 235, 0.5);
        `;
        document.body.appendChild(progressBar);
    }
    
    const percentage = (current / total) * 100;
    progressBar.style.width = `${percentage}%`;
}

// Add confetti effect for correct answers
export function celebrateCorrectAnswer(): void {
    const colors = ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * 100}%;
            top: -10px;
            opacity: 1;
            transform: rotate(${Math.random() * 360}deg);
            pointer-events: none;
            z-index: 9999;
            border-radius: 50%;
        `;
        
        document.body.appendChild(confetti);
        
        const duration = 2000 + Math.random() * 1000;
        const delay = Math.random() * 200;
        
        setTimeout(() => {
            confetti.animate([
                {
                    transform: `translateY(0) rotate(0deg)`,
                    opacity: 1
                },
                {
                    transform: `translateY(${window.innerHeight + 20}px) rotate(${720 + Math.random() * 360}deg)`,
                    opacity: 0
                }
            ], {
                duration: duration,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }).onfinish = () => confetti.remove();
        }, delay);
    }
}

// Add card count display with modern styling
export function updateCardCounts(newCount: number, learningCount: number, reviewCount: number): void {
    let countsElement = document.getElementById('modern-card-counts');
    
    if (!countsElement) {
        countsElement = document.createElement('div');
        countsElement.id = 'modern-card-counts';
        countsElement.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            display: flex;
            gap: 12px;
            z-index: 1000;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        `;
        document.body.appendChild(countsElement);
    }
    
    countsElement.innerHTML = `
        <div style="
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            color: white;
            padding: 8px 16px;
            border-radius: 12px;
            font-weight: 600;
            font-size: 0.9rem;
            box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
        ">
            <span style="opacity: 0.8;">New:</span> ${newCount}
        </div>
        <div style="
            background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
            color: white;
            padding: 8px 16px;
            border-radius: 12px;
            font-weight: 600;
            font-size: 0.9rem;
            box-shadow: 0 4px 12px rgba(245, 158, 11, 0.25);
        ">
            <span style="opacity: 0.8;">Learning:</span> ${learningCount}
        </div>
        <div style="
            background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
            color: white;
            padding: 8px 16px;
            border-radius: 12px;
            font-weight: 600;
            font-size: 0.9rem;
            box-shadow: 0 4px 12px rgba(34, 197, 94, 0.25);
        ">
            <span style="opacity: 0.8;">Review:</span> ${reviewCount}
        </div>
    `;
}

// Initialize all modern theme effects
export function initModernTheme(): void {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            applyModernEffects();
        });
    } else {
        applyModernEffects();
    }
}

function applyModernEffects(): void {
    addDynamicBackground();
    addCardFlipEffect();
    enhanceButtonInteractions();
    enhanceTypeAnswer();
    
    // Add class to body for CSS hooks
    document.body.classList.add('modern-theme');
    
    // Add meta viewport for responsive design
    if (!document.querySelector('meta[name="viewport"]')) {
        const meta = document.createElement('meta');
        meta.name = 'viewport';
        meta.content = 'width=device-width, initial-scale=1, maximum-scale=1';
        document.head.appendChild(meta);
    }
}

// Auto-initialize when script loads
initModernTheme();

// Export for use in other modules
declare global {
    interface Window {
        modernTheme: {
            addCardFlipEffect: typeof addCardFlipEffect;
            addAnswerRevealAnimation: typeof addAnswerRevealAnimation;
            celebrateCorrectAnswer: typeof celebrateCorrectAnswer;
            updateCardCounts: typeof updateCardCounts;
            addProgressIndicator: typeof addProgressIndicator;
        };
    }
}

window.modernTheme = {
    addCardFlipEffect,
    addAnswerRevealAnimation,
    celebrateCorrectAnswer,
    updateCardCounts,
    addProgressIndicator,
};

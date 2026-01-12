// Copyright: Ankitects Pty Ltd and contributors
// License: GNU AGPL, version 3 or later; http://www.gnu.org/licenses/agpl.html

/**
 * Gamification Features
 * Adds achievements, badges, and motivational elements
 */

interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    unlocked: boolean;
    progress: number;
    target: number;
}

export class GamificationSystem {
    private achievements: Achievement[] = [
        {
            id: 'first_review',
            title: 'First Steps',
            description: 'Complete your first review',
            icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
            unlocked: false,
            progress: 0,
            target: 1,
        },
        {
            id: 'streak_7',
            title: 'Week Warrior',
            description: '7-day study streak',
            icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>',
            unlocked: false,
            progress: 0,
            target: 7,
        },
        {
            id: 'cards_100',
            title: 'Century Club',
            description: 'Learn 100 cards',
            icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
            unlocked: false,
            progress: 0,
            target: 100,
        },
        {
            id: 'perfect_day',
            title: 'Perfect Day',
            description: '100% accuracy in a day',
            icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
            unlocked: false,
            progress: 0,
            target: 1,
        },
        {
            id: 'time_master',
            title: 'Time Master',
            description: 'Study for 10 hours total',
            icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
            unlocked: false,
            progress: 0,
            target: 600,
        },
    ];

    public checkAchievements(stats: any): void {
        this.achievements.forEach((achievement) => {
            if (!achievement.unlocked) {
                const progress = this.calculateProgress(achievement.id, stats);
                achievement.progress = progress;

                if (progress >= achievement.target) {
                    this.unlockAchievement(achievement);
                }
            }
        });
    }

    private calculateProgress(id: string, stats: any): number {
        switch (id) {
            case 'first_review':
                return stats.reviewsCompleted >= 1 ? 1 : 0;
            case 'streak_7':
                return stats.streakDays;
            case 'cards_100':
                return stats.cardsLearned;
            case 'perfect_day':
                return stats.todayAccuracy === 100 ? 1 : 0;
            case 'time_master':
                return stats.totalStudyTime;
            default:
                return 0;
        }
    }

    private unlockAchievement(achievement: Achievement): void {
        achievement.unlocked = true;
        this.showAchievementUnlocked(achievement);
    }

    private showAchievementUnlocked(achievement: Achievement): void {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
            color: white;
            padding: 20px 30px;
            border-radius: 16px;
            box-shadow: 0 10px 30px rgba(245, 158, 11, 0.4);
            z-index: 99999;
            animation: slideInBounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            max-width: 350px;
            border: 3px solid rgba(255, 255, 255, 0.3);
        `;

        notification.innerHTML = `
            <div style="text-align: center;">
                <div style="font-size: 4rem; margin-bottom: 10px; animation: bounce 1s infinite;">
                    ${achievement.icon}
                </div>
                <div style="
                    font-size: 1.1rem;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    margin-bottom: 8px;
                    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                ">Achievement Unlocked!</div>
                <div style="
                    font-size: 1.3rem;
                    font-weight: 700;
                    margin-bottom: 5px;
                ">${achievement.title}</div>
                <div style="
                    font-size: 0.9rem;
                    opacity: 0.9;
                ">${achievement.description}</div>
            </div>
        `;

        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInBounce {
                0% {
                    transform: translateX(400px);
                    opacity: 0;
                }
                60% {
                    transform: translateX(-20px);
                    opacity: 1;
                }
                80% {
                    transform: translateX(10px);
                }
                100% {
                    transform: translateX(0);
                }
            }
            @keyframes bounce {
                0%, 100% {
                    transform: translateY(0);
                }
                50% {
                    transform: translateY(-10px);
                }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(notification);

        // Play sound effect
        this.playUnlockSound();

        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.transition = 'all 0.5s ease';
            notification.style.transform = 'translateX(400px)';
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 500);
        }, 5000);
    }

    private playUnlockSound(): void {
        // Simple achievement sound using Web Audio API
        try {
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = 523.25; // C5
            oscillator.type = 'sine';
            gainNode.gain.value = 0.3;

            oscillator.start();
            oscillator.frequency.exponentialRampToValueAtTime(1046.5, audioContext.currentTime + 0.1); // C6
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            oscillator.stop(audioContext.currentTime + 0.3);
        } catch (e) {
            console.log('Audio not available');
        }
    }

    public showAchievementsPanel(): void {
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

        const content = document.createElement('div');
        content.style.cssText = `
            background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
            border-radius: 24px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            max-width: 800px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            padding: 40px;
        `;

        content.innerHTML = `
            <h2 style="
                margin: 0 0 30px 0;
                font-size: 2rem;
                font-weight: 800;
                background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            "><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 8px;">
                <circle cx="12" cy="8" r="7"/>
                <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
            </svg>Achievements</h2>
            
            <div style="display: grid; gap: 15px;">
                ${this.achievements
                    .map(
                        (a) => `
                    <div style="
                        background: ${a.unlocked ? 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' : 'white'};
                        border: 2px solid ${a.unlocked ? '#fbbf24' : '#e2e8f0'};
                        border-radius: 16px;
                        padding: 20px;
                        display: flex;
                        align-items: center;
                        gap: 20px;
                        ${a.unlocked ? '' : 'opacity: 0.6;'}
                        transition: all 0.3s ease;
                    " ${a.unlocked ? `onmouseover="this.style.transform='translateX(4px)'" onmouseout="this.style.transform='translateX(0)'"` : ''}>
                        <div style="
                            font-size: 3rem;
                            ${a.unlocked ? '' : 'filter: grayscale(100%);'}
                        ">${a.icon}</div>
                        <div style="flex: 1;">
                            <div style="
                                font-size: 1.1rem;
                                font-weight: 700;
                                color: #1e293b;
                                margin-bottom: 4px;
                            ">${a.title}</div>
                            <div style="
                                font-size: 0.9rem;
                                color: #64748b;
                                margin-bottom: 8px;
                            ">${a.description}</div>
                            <div style="
                                background: #e2e8f0;
                                height: 8px;
                                border-radius: 4px;
                                overflow: hidden;
                            ">
                                <div style="
                                    background: linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%);
                                    height: 100%;
                                    width: ${Math.min((a.progress / a.target) * 100, 100)}%;
                                    transition: width 0.3s ease;
                                "></div>
                            </div>
                            <div style="
                                font-size: 0.8rem;
                                color: #64748b;
                                margin-top: 4px;
                            ">${a.progress}/${a.target}</div>
                        </div>
                        ${a.unlocked ? '<div style="font-size: 2rem;">✓</div>' : ''}
                    </div>
                `
                    )
                    .join('')}
            </div>
            
            <button id="close-achievements" style="
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
               onmouseout="this.style.transform='translateY(0)'">Close</button>
        `;

        panel.appendChild(content);
        document.body.appendChild(panel);

        document.getElementById('close-achievements')!.addEventListener('click', () => {
            panel.remove();
        });

        panel.addEventListener('click', (e) => {
            if (e.target === panel) {
                panel.remove();
            }
        });
    }
}

// Global instance
let gamificationSystem: GamificationSystem | null = null;

export function getGamificationSystem(): GamificationSystem {
    if (!gamificationSystem) {
        gamificationSystem = new GamificationSystem();
    }
    return gamificationSystem;
}

// Expose to global
declare global {
    interface Window {
        gamification: {
            checkAchievements: (stats: any) => void;
            showPanel: () => void;
        };
    }
}

window.gamification = {
    checkAchievements: (stats) => getGamificationSystem().checkAchievements(stats),
    showPanel: () => getGamificationSystem().showAchievementsPanel(),
};

// Copyright: Ankitects Pty Ltd and contributors
// License: GNU AGPL, version 3 or later; http://www.gnu.org/licenses/agpl.html

/**
 * Study Stats Dashboard
 * Beautiful statistics visualization with charts
 */

interface StudyStats {
    cardsStudiedToday: number;
    timeStudiedToday: number;
    cardsStudiedThisWeek: number;
    currentStreak: number;
    longestStreak: number;
    totalCards: number;
    averageAccuracy: number;
    dailyGoal: number;
    goalProgress: number;
}

/**
 * Create and display stats dashboard
 */
export function createStatsDashboard(): void {
    // Remove existing dashboard
    const existing = document.getElementById('stats-dashboard');
    if (existing) {
        existing.remove();
    }

    // Create dashboard container
    const dashboard = document.createElement('div');
    dashboard.id = 'stats-dashboard';
    dashboard.style.cssText = `
        position: fixed;
        top: 60px;
        left: 20px;
        width: 350px;
        background: white;
        border-radius: 20px;
        padding: 25px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    `;

    // Get stats from backend (mock data for now)
    const stats: StudyStats = {
        cardsStudiedToday: 45,
        timeStudiedToday: 32, // minutes
        cardsStudiedThisWeek: 234,
        currentStreak: 12,
        longestStreak: 45,
        totalCards: 2547,
        averageAccuracy: 87.5,
        dailyGoal: 50,
        goalProgress: 45 / 50 * 100,
    };

    dashboard.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2 style="margin: 0; font-size: 20px; font-weight: 700; color: #1e40af;">
                📊 Study Statistics
            </h2>
            <button id="close-stats-btn" style="
                background: #ef4444;
                color: white;
                border: none;
                border-radius: 50%;
                width: 30px;
                height: 30px;
                font-size: 18px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
            ">×</button>
        </div>

        <!-- Daily Progress -->
        <div style="margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="font-size: 14px; font-weight: 600; color: #1e3a8a;">
                    Today's Progress
                </span>
                <span style="font-size: 14px; font-weight: 700; color: #2563eb;">
                    ${stats.cardsStudiedToday}/${stats.dailyGoal}
                </span>
            </div>
            <div style="
                width: 100%;
                height: 12px;
                background: #dbeafe;
                border-radius: 6px;
                overflow: hidden;
            ">
                <div style="
                    width: ${stats.goalProgress}%;
                    height: 100%;
                    background: linear-gradient(90deg, #2563eb 0%, #3b82f6 100%);
                    transition: width 0.5s ease;
                "></div>
            </div>
        </div>

        <!-- Stats Grid -->
        <div style="
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin-bottom: 20px;
        ">
            ${createStatCard('🔥', stats.currentStreak, 'Current Streak', 'days')}
            ${createStatCard('⏱️', stats.timeStudiedToday, 'Study Time', 'min')}
            ${createStatCard('📈', stats.cardsStudiedThisWeek, 'This Week', 'cards')}
            ${createStatCard('🎯', stats.averageAccuracy.toFixed(1), 'Accuracy', '%')}
        </div>

        <!-- Heatmap Preview -->
        <div style="
            background: linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%);
            border-radius: 12px;
            padding: 15px;
            margin-bottom: 15px;
        ">
            <div style="font-size: 13px; font-weight: 600; color: #1e40af; margin-bottom: 10px;">
                Activity Heatmap (7 days)
            </div>
            <div style="display: flex; gap: 6px; justify-content: space-around;">
                ${createHeatmapDay('M', 45)}
                ${createHeatmapDay('T', 32)}
                ${createHeatmapDay('W', 58)}
                ${createHeatmapDay('T', 41)}
                ${createHeatmapDay('F', 67)}
                ${createHeatmapDay('S', 23)}
                ${createHeatmapDay('S', 45)}
            </div>
        </div>

        <!-- Quick Actions -->
        <div style="display: flex; gap: 8px;">
            <button id="view-detailed-stats-btn" style="
                flex: 1;
                padding: 10px;
                background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
                color: white;
                border: none;
                border-radius: 10px;
                font-size: 13px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            ">
                View Details
            </button>
            <button id="export-stats-btn" style="
                padding: 10px;
                background: white;
                color: #2563eb;
                border: 2px solid #2563eb;
                border-radius: 10px;
                font-size: 13px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            ">
                📤
            </button>
        </div>
    `;

    document.body.appendChild(dashboard);

    // Add event listeners
    document.getElementById('close-stats-btn')?.addEventListener('click', () => {
        dashboard.remove();
    });

    document.getElementById('view-detailed-stats-btn')?.addEventListener('click', () => {
        showDetailedStats(stats);
    });

    document.getElementById('export-stats-btn')?.addEventListener('click', () => {
        exportStats(stats);
    });

    // Add animation
    dashboard.style.animation = 'slideInLeft 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
}

function createStatCard(
    emoji: string,
    value: number | string,
    label: string,
    unit: string
): string {
    return `
        <div style="
            background: white;
            border: 2px solid #dbeafe;
            border-radius: 12px;
            padding: 15px;
            text-align: center;
            transition: all 0.3s ease;
        " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 20px rgba(37, 99, 235, 0.15)'"
           onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
            <div style="font-size: 24px; margin-bottom: 5px;">${emoji}</div>
            <div style="font-size: 20px; font-weight: 700; color: #2563eb; margin-bottom: 2px;">
                ${value}<span style="font-size: 12px; color: #60a5fa;"> ${unit}</span>
            </div>
            <div style="font-size: 11px; color: #6b7280;">${label}</div>
        </div>
    `;
}

function createHeatmapDay(day: string, intensity: number): string {
    // Calculate color intensity (0-100)
    const maxIntensity = 70;
    const opacity = Math.min(intensity / maxIntensity, 1);
    const color = `rgba(37, 99, 235, ${0.2 + opacity * 0.8})`;

    return `
        <div style="text-align: center;">
            <div style="
                width: 35px;
                height: 35px;
                background: ${color};
                border-radius: 6px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 10px;
                font-weight: 700;
                color: ${intensity > 40 ? 'white' : '#1e40af'};
                margin-bottom: 4px;
                transition: all 0.3s ease;
            " onmouseover="this.style.transform='scale(1.1)'"
               onmouseout="this.style.transform='scale(1)'">
                ${intensity}
            </div>
            <div style="font-size: 10px; color: #6b7280; font-weight: 600;">${day}</div>
        </div>
    `;
}

function showDetailedStats(stats: StudyStats): void {
    alert('Detailed stats view coming soon! 📊\n\n' +
          `Total Cards: ${stats.totalCards}\n` +
          `Longest Streak: ${stats.longestStreak} days\n` +
          `This Week: ${stats.cardsStudiedThisWeek} cards`);
}

function exportStats(stats: StudyStats): void {
    const data = JSON.stringify(stats, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `anki-stats-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInLeft {
        from {
            opacity: 0;
            transform: translateX(-50px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
`;
document.head.appendChild(style);

// Add toggle button to show/hide dashboard
export function addStatsDashboardToggle(): void {
    const existing = document.getElementById('stats-toggle-btn');
    if (existing) {
        return;
    }

    const button = document.createElement('button');
    button.id = 'stats-toggle-btn';
    button.innerHTML = '📊';
    button.title = 'Toggle Stats Dashboard';
    button.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
        color: white;
        border: none;
        font-size: 24px;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
        z-index: 1001;
        transition: all 0.3s ease;
    `;

    button.addEventListener('mouseenter', () => {
        button.style.transform = 'scale(1.1) rotate(5deg)';
        button.style.boxShadow = '0 6px 20px rgba(37, 99, 235, 0.4)';
    });

    button.addEventListener('mouseleave', () => {
        button.style.transform = 'scale(1) rotate(0deg)';
        button.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.3)';
    });

    button.addEventListener('click', () => {
        const dashboard = document.getElementById('stats-dashboard');
        if (dashboard) {
            dashboard.remove();
        } else {
            createStatsDashboard();
        }
    });

    document.body.appendChild(button);
}

// Export for global access
declare global {
    interface Window {
        statsDashboard: {
            create: typeof createStatsDashboard;
            addToggle: typeof addStatsDashboardToggle;
        };
    }
}

window.statsDashboard = {
    create: createStatsDashboard,
    addToggle: addStatsDashboardToggle,
};

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        addStatsDashboardToggle();
    });
} else {
    addStatsDashboardToggle();
}

/**
 * Activity Heatmap Dashboard - GitHub-style Contribution Graph
 * Tracks study activity and displays as beautiful heatmap calendar
 */

class ActivityHeatmap {
    constructor() {
        this.storageKey = 'anki_study_activity';
        this.data = this.loadActivityData();
        this.currentStreak = 0;
        this.longestStreak = 0;
        this.totalDays = 0;
    }

    // Load activity data from localStorage
    loadActivityData() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            return stored ? JSON.parse(stored) : {};
        } catch (e) {
            console.error('Failed to load activity data:', e);
            return {};
        }
    }

    // Save activity data to localStorage
    saveActivityData() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.data));
        } catch (e) {
            console.error('Failed to save activity data:', e);
        }
    }

    // Record study session for today
    recordStudySession(cardsReviewed = 1) {
        const today = this.getDateString(new Date());
        
        if (!this.data[today]) {
            this.data[today] = {
                cards: 0,
                minutes: 0,
                sessions: 0
            };
        }
        
        this.data[today].cards += cardsReviewed;
        this.data[today].sessions += 1;
        
        this.saveActivityData();
        this.calculateStreaks();
    }

    // Get date string in YYYY-MM-DD format
    getDateString(date) {
        return date.toISOString().split('T')[0];
    }

    // Get activity level (0-4) based on cards reviewed
    getActivityLevel(cards) {
        if (!cards || cards === 0) return 0;
        if (cards < 10) return 1;
        if (cards < 30) return 2;
        if (cards < 50) return 3;
        return 4;
    }

    // Calculate current and longest streaks
    calculateStreaks() {
        const dates = Object.keys(this.data).sort();
        if (dates.length === 0) {
            this.currentStreak = 0;
            this.longestStreak = 0;
            this.totalDays = 0;
            return;
        }

        this.totalDays = dates.length;
        
        // Calculate current streak
        let streak = 0;
        const today = this.getDateString(new Date());
        let checkDate = new Date();
        
        while (true) {
            const dateStr = this.getDateString(checkDate);
            if (this.data[dateStr]) {
                streak++;
                checkDate.setDate(checkDate.getDate() - 1);
            } else {
                break;
            }
        }
        
        this.currentStreak = streak;

        // Calculate longest streak
        let maxStreak = 0;
        let tempStreak = 0;
        let prevDate = null;

        for (const dateStr of dates) {
            const currentDate = new Date(dateStr);
            
            if (prevDate) {
                const diffDays = Math.floor((currentDate - prevDate) / (1000 * 60 * 60 * 24));
                
                if (diffDays === 1) {
                    tempStreak++;
                } else {
                    maxStreak = Math.max(maxStreak, tempStreak);
                    tempStreak = 1;
                }
            } else {
                tempStreak = 1;
            }
            
            prevDate = currentDate;
        }
        
        this.longestStreak = Math.max(maxStreak, tempStreak);
    }

    // Generate heatmap HTML for last 365 days
    generateHeatmapHTML() {
        this.calculateStreaks();
        
        const today = new Date();
        const startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 364); // Last 365 days
        
        // Calculate weeks
        const weeks = [];
        let currentWeek = [];
        let currentDate = new Date(startDate);
        
        // Start from Sunday
        const dayOfWeek = currentDate.getDay();
        for (let i = 0; i < dayOfWeek; i++) {
            currentWeek.push(null); // Empty cells before start
        }
        
        // Fill in all days
        while (currentDate <= today) {
            const dateStr = this.getDateString(currentDate);
            const activity = this.data[dateStr];
            const cards = activity ? activity.cards : 0;
            const level = this.getActivityLevel(cards);
            
            currentWeek.push({
                date: new Date(currentDate),
                dateStr: dateStr,
                cards: cards,
                level: level,
                sessions: activity ? activity.sessions : 0
            });
            
            if (currentWeek.length === 7) {
                weeks.push(currentWeek);
                currentWeek = [];
            }
            
            currentDate.setDate(currentDate.getDate() + 1);
        }
        
        // Add remaining days
        if (currentWeek.length > 0) {
            while (currentWeek.length < 7) {
                currentWeek.push(null);
            }
            weeks.push(currentWeek);
        }
        
        // Generate HTML
        let html = `
            <div class="activity-heatmap">
                <div class="heatmap-header">
                    <h2>📊 Hoạt Động Học Tập</h2>
                    <div class="streak-stats">
                        <div class="stat-item">
                            <span class="stat-icon">🔥</span>
                            <div class="stat-content">
                                <div class="stat-value">${this.currentStreak}</div>
                                <div class="stat-label">Ngày liên tục</div>
                            </div>
                        </div>
                        <div class="stat-item">
                            <span class="stat-icon">🏆</span>
                            <div class="stat-content">
                                <div class="stat-value">${this.longestStreak}</div>
                                <div class="stat-label">Kỷ lục</div>
                            </div>
                        </div>
                        <div class="stat-item">
                            <span class="stat-icon">📅</span>
                            <div class="stat-content">
                                <div class="stat-value">${this.totalDays}</div>
                                <div class="stat-label">Tổng số ngày</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="heatmap-calendar">
                    <div class="month-labels">
                        ${this.generateMonthLabels(startDate, today)}
                    </div>
                    <div class="calendar-grid">
                        <div class="day-labels">
                            <div class="day-label">CN</div>
                            <div class="day-label">T2</div>
                            <div class="day-label">T3</div>
                            <div class="day-label">T4</div>
                            <div class="day-label">T5</div>
                            <div class="day-label">T6</div>
                            <div class="day-label">T7</div>
                        </div>
                        <div class="weeks-container">
                            ${weeks.map(week => this.generateWeekHTML(week)).join('')}
                        </div>
                    </div>
                    
                    <div class="heatmap-legend">
                        <span>Ít</span>
                        <div class="legend-cell level-0"></div>
                        <div class="legend-cell level-1"></div>
                        <div class="legend-cell level-2"></div>
                        <div class="legend-cell level-3"></div>
                        <div class="legend-cell level-4"></div>
                        <span>Nhiều</span>
                    </div>
                </div>
            </div>
        `;
        
        return html;
    }

    // Generate month labels
    generateMonthLabels(startDate, endDate) {
        const months = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
        const labels = [];
        let currentMonth = startDate.getMonth();
        let currentDate = new Date(startDate);
        
        while (currentDate <= endDate) {
            const month = currentDate.getMonth();
            if (month !== currentMonth || currentDate.getTime() === startDate.getTime()) {
                labels.push(`<span class="month-label">${months[month]}</span>`);
                currentMonth = month;
            }
            currentDate.setDate(currentDate.getDate() + 7);
        }
        
        return labels.join('');
    }

    // Generate HTML for a week
    generateWeekHTML(week) {
        const cells = week.map(day => {
            if (!day) {
                return '<div class="heatmap-cell empty"></div>';
            }
            
            const tooltip = day.cards > 0 
                ? `${day.dateStr}: ${day.cards} thẻ, ${day.sessions} phiên học`
                : `${day.dateStr}: Chưa học`;
            
            return `<div class="heatmap-cell level-${day.level}" 
                         title="${tooltip}" 
                         data-date="${day.dateStr}"
                         data-cards="${day.cards}"></div>`;
        }).join('');
        
        return `<div class="heatmap-week">${cells}</div>`;
    }

    // Inject heatmap into page
    injectIntoPage(containerId = 'activity-dashboard') {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error('Container not found:', containerId);
            return;
        }
        
        container.innerHTML = this.generateHeatmapHTML();
        this.attachTooltips();
    }

    // Attach interactive tooltips
    attachTooltips() {
        const cells = document.querySelectorAll('.heatmap-cell[data-date]');
        cells.forEach(cell => {
            cell.addEventListener('mouseenter', (e) => {
                const tooltip = e.target.getAttribute('title');
                e.target.setAttribute('data-tooltip', tooltip);
            });
        });
    }

    // Get statistics
    getStatistics() {
        const dates = Object.keys(this.data);
        const totalCards = dates.reduce((sum, date) => sum + this.data[date].cards, 0);
        const totalSessions = dates.reduce((sum, date) => sum + this.data[date].sessions, 0);
        
        // Last 7 days
        const today = new Date();
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = this.getDateString(date);
            last7Days.push(this.data[dateStr] || { cards: 0, sessions: 0 });
        }
        
        const last7DaysCards = last7Days.reduce((sum, day) => sum + day.cards, 0);
        
        return {
            totalDays: this.totalDays,
            totalCards: totalCards,
            totalSessions: totalSessions,
            currentStreak: this.currentStreak,
            longestStreak: this.longestStreak,
            last7DaysCards: last7DaysCards,
            avgCardsPerDay: this.totalDays > 0 ? Math.round(totalCards / this.totalDays) : 0
        };
    }
}

// Create global instance
window.activityHeatmap = new ActivityHeatmap();

// Record study session when cards are reviewed
// This will be called from Python bridge
window.recordStudyActivity = function(cardsReviewed = 1) {
    window.activityHeatmap.recordStudySession(cardsReviewed);
};

// Initialize heatmap when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Activity Heatmap loaded');
});

// Copyright: Ankitects Pty Ltd and contributors
// License: GNU AGPL, version 3 or later; http://www.gnu.org/licenses/agpl.html

/**
 * Enhanced Deck Browser with Modern UI
 */

document.addEventListener('DOMContentLoaded', () => {
    enhanceDeckBrowser();
});

function enhanceDeckBrowser(): void {
    // Add modern classes
    document.body.classList.add('modern-deck-browser');

    // Add header title enhancement
    enhanceHeader();

    // Add activity heatmap dashboard
    addActivityDashboard();

    // Add study motivation widget
    addMotivationWidget();

    // Add quick stats
    addQuickStats();

    // Enhance buttons
    enhanceButtons();

    // Record today's activity
    recordDailyActivity();
}

function enhanceHeader(): void {
    const centerElement = document.querySelector('center');
    if (!centerElement) return;

    // Find the deck title
    const title = centerElement.querySelector('h1, h2, h3') || 
                  document.createElement('h1');
    
    if (!title.parentElement) {
        const titleElement = document.createElement('div');
        titleElement.style.cssText = `
            text-align: center;
            margin-bottom: 30px;
        `;
        
        titleElement.innerHTML = `
            <h1 style="
                font-size: 2.5rem;
                font-weight: 800;
                background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                margin: 0;
                padding: 20px 0;
                letter-spacing: -0.02em;
            ">📚 Anki Flashcards</h1>
        `;
        
        centerElement.insertBefore(titleElement, centerElement.firstChild);
    }
}

function addMotivationWidget(): void {
    const studiedToday = document.getElementById('studiedToday');
    if (!studiedToday) return;

    const widget = document.createElement('div');
    widget.id = 'motivation-widget';
    widget.style.cssText = `
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 24px 32px;
        border-radius: 16px;
        margin: 30px auto;
        max-width: 600px;
        box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
        text-align: center;
    `;

    const messages = [
        "🌟 Keep up the great work!",
        "💪 You're doing amazing!",
        "🚀 Learning streak active!",
        "✨ Every card brings you closer to mastery!",
        "🎯 Consistency is the key to success!",
    ];

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    widget.innerHTML = `
        <div style="font-size: 1.3rem; font-weight: 700; margin-bottom: 8px;">
            ${randomMessage}
        </div>
        <div style="font-size: 1rem; opacity: 0.9;">
            ${studiedToday.textContent || 'Start your learning journey today!'}
        </div>
    `;

    studiedToday.parentElement?.insertBefore(widget, studiedToday);
    studiedToday.style.display = 'none';
}

function addQuickStats(): void {
    const table = document.querySelector('table');
    if (!table) return;

    // Calculate total cards
    let totalNew = 0;
    let totalLearning = 0;
    let totalReview = 0;

    const newCounts = document.querySelectorAll('.new-count');
    const learnCounts = document.querySelectorAll('.learn-count');
    const reviewCounts = document.querySelectorAll('.review-count');

    newCounts.forEach(el => {
        const num = parseInt(el.textContent || '0');
        if (!isNaN(num)) totalNew += num;
    });

    learnCounts.forEach(el => {
        const num = parseInt(el.textContent || '0');
        if (!isNaN(num)) totalLearning += num;
    });

    reviewCounts.forEach(el => {
        const num = parseInt(el.textContent || '0');
        if (!isNaN(num)) totalReview += num;
    });

    const statsWidget = document.createElement('div');
    statsWidget.id = 'quick-stats-widget';
    statsWidget.style.cssText = `
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 16px;
        margin: 30px auto;
        max-width: 800px;
    `;

    const stats = [
        { icon: '📘', label: 'New Cards', value: totalNew, color: '#2563eb' },
        { icon: '📙', label: 'Learning', value: totalLearning, color: '#f59e0b' },
        { icon: '📗', label: 'To Review', value: totalReview, color: '#16a34a' },
    ];

    statsWidget.innerHTML = stats.map(stat => `
        <div style="
            background: white;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
            border-left: 4px solid ${stat.color};
            transition: all 0.3s ease;
            cursor: pointer;
        " onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 20px rgba(0, 0, 0, 0.12)';"
           onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(0, 0, 0, 0.08)';">
            <div style="font-size: 2rem; margin-bottom: 8px;">${stat.icon}</div>
            <div style="
                font-size: 0.85rem;
                color: #64748b;
                margin-bottom: 4px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.05em;
            ">${stat.label}</div>
            <div style="
                font-size: 2rem;
                font-weight: 800;
                color: ${stat.color};
            ">${stat.value}</div>
        </div>
    `).join('');

    table.parentElement?.insertBefore(statsWidget, table);
}

function enhanceButtons(): void {
    const buttons = document.querySelectorAll('button');
    
    buttons.forEach(button => {
        button.style.cssText = `
            background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
            color: white;
            border: none;
            border-radius: 12px;
            padding: 12px 24px;
            font-weight: 700;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
            margin: 0 8px;
        `;

        button.addEventListener('mouseenter', function(this: HTMLElement) {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 8px 20px rgba(37, 99, 235, 0.4)';
        });

        button.addEventListener('mouseleave', function(this: HTMLElement) {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.3)';
        });

        button.addEventListener('mousedown', function(this: HTMLElement) {
            this.style.transform = 'translateY(0)';
        });
    });

    // Special styling for "Study Now" button
    const studyButtons = Array.from(buttons).filter(b => 
        b.textContent?.includes('Study') || 
        b.textContent?.includes('Học') ||
        b.textContent?.includes('Now') ||
        b.textContent?.includes('giờ')
    );

    studyButtons.forEach(button => {
        button.style.background = 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)';
        button.style.fontSize = '1.1rem';
        button.style.padding = '14px 32px';
        button.style.boxShadow = '0 6px 16px rgba(22, 163, 74, 0.3)';
    });
}

// Add floating action button for quick access
function addFloatingActionButton(): void {
    const fab = document.createElement('button');
    fab.id = 'deck-browser-fab';
    fab.innerHTML = '➕';
    fab.title = 'Quick Actions';
    fab.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
        border: none;
        color: white;
        font-size: 28px;
        cursor: pointer;
        box-shadow: 0 8px 24px rgba(37, 99, 235, 0.4);
        transition: all 0.3s ease;
        z-index: 1000;
    `;

    fab.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1) rotate(90deg)';
        this.style.boxShadow = '0 12px 32px rgba(37, 99, 235, 0.5)';
    });

    fab.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1) rotate(0deg)';
        this.style.boxShadow = '0 8px 24px rgba(37, 99, 235, 0.4)';
    });

    fab.addEventListener('click', () => {
        // Show quick actions menu
        showQuickActionsMenu();
    });

    document.body.appendChild(fab);
}

function showQuickActionsMenu(): void {
    const menu = document.createElement('div');
    menu.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 30px;
        background: white;
        border-radius: 16px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        padding: 16px;
        z-index: 1001;
        min-width: 200px;
    `;

    menu.innerHTML = `
        <button onclick="pycmd('create')" style="
            width: 100%;
            padding: 12px;
            margin-bottom: 8px;
            background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
        ">📚 Create Deck</button>
        <button onclick="pycmd('import')" style="
            width: 100%;
            padding: 12px;
            margin-bottom: 8px;
            background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
        ">📥 Import</button>
        <button onclick="pycmd('shared')" style="
            width: 100%;
            padding: 12px;
            background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
        ">🌐 Browse Shared</button>
    `;

    document.body.appendChild(menu);

    // Remove menu when clicking outside
    setTimeout(() => {
        document.addEventListener('click', function removeMenu(e) {
            if (!menu.contains(e.target as Node)) {
                menu.remove();
                document.removeEventListener('click', removeMenu);
            }
        });
    }, 100);
}

/**
 * Add Activity Heatmap Dashboard
 */
function addActivityDashboard(): void {
    const centerElement = document.querySelector('center');
    if (!centerElement) return;

    // Create dashboard container
    const dashboard = document.createElement('div');
    dashboard.id = 'activity-dashboard';
    dashboard.style.cssText = `
        margin: 30px auto;
        max-width: 1200px;
    `;

    // Insert after header
    const header = centerElement.querySelector('h1, h2, h3');
    if (header && header.parentElement) {
        header.parentElement.after(dashboard);
    } else {
        centerElement.insertBefore(dashboard, centerElement.firstChild);
    }

    // Initialize heatmap if available
    if (window.activityHeatmap) {
        window.activityHeatmap.injectIntoPage('activity-dashboard');
    } else {
        console.warn('Activity heatmap not loaded yet');
        // Retry after a delay
        setTimeout(() => {
            if (window.activityHeatmap) {
                window.activityHeatmap.injectIntoPage('activity-dashboard');
            }
        }, 500);
    }
}

/**
 * Record daily activity
 */
function recordDailyActivity(): void {
    // Check if we've already recorded today
    const today = new Date().toISOString().split('T')[0];
    const lastRecorded = localStorage.getItem('anki_last_visit');
    
    if (lastRecorded !== today) {
        // Record that user visited today
        localStorage.setItem('anki_last_visit', today);
        
        // Initialize activity if needed
        if (window.activityHeatmap) {
            // Just mark as visited (cards will be recorded during actual study)
            const activityData = window.activityHeatmap.loadActivityData();
            if (!activityData[today]) {
                activityData[today] = {
                    cards: 0,
                    minutes: 0,
                    sessions: 0
                };
                window.activityHeatmap.data = activityData;
                window.activityHeatmap.saveActivityData();
            }
        }
    }
}

// Initialize FAB
addFloatingActionButton();

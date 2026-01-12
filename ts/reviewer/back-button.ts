/**
 * Modern Back Button for Reviewer
 * Adds a floating back button to return to deck overview
 */

// Create and inject back button
export function setupReviewerBackButton(): void {
    // Check if button already exists
    if (document.getElementById("reviewer-back-button")) {
        return;
    }

    // Create button container
    const backButton = document.createElement("div");
    backButton.id = "reviewer-back-button";
    backButton.innerHTML = `
        <button class="back-btn" onclick="pycmd('ans'); return false;" title="Quay lại tổng quan (ESC)">
            ← Quay lại
        </button>
        <button class="home-btn" onclick="pycmd('decks'); return false;" title="Về trang chủ">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
        </button>
    `;

    // Add styles - very compact version
    const style = document.createElement("style");
    style.textContent = `
        /* Hide any blue circular elements in top-left corner */
        body::before,
        .logo,
        [class*="logo"],
        img[src*="logo"] {
            display: none !important;
            visibility: hidden !important;
        }

        #reviewer-back-button {
            position: fixed;
            top: 8px;
            left: 8px;
            z-index: 100002;
            display: flex;
            gap: 6px;
            animation: slideIn 0.3s ease-out;
            background: transparent;
            pointer-events: auto;
        }

        @keyframes slideIn {
            from {
                transform: translateX(-100px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        #reviewer-back-button button {
            background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 5px;
            padding: 4px 12px;
            font-weight: 600;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 2px 6px rgba(37, 99, 235, 0.3);
            backdrop-filter: blur(10px);
            max-height: 28px;
            pointer-events: auto;
            position: relative;
            z-index: 100003;
        }

        #reviewer-back-button button:hover {
            transform: translateY(-1px);
            box-shadow: 0 3px 10px rgba(37, 99, 235, 0.4);
            background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%);
        }

        #reviewer-back-button button:active {
            transform: translateY(0);
            box-shadow: 0 1px 4px rgba(37, 99, 235, 0.3);
        }

        #reviewer-back-button .home-btn {
            background: linear-gradient(135deg, #059669 0%, #10b981 100%);
            box-shadow: 0 2px 6px rgba(5, 150, 105, 0.3);
        }

        #reviewer-back-button .home-btn:hover {
            background: linear-gradient(135deg, #047857 0%, #059669 100%);
            box-shadow: 0 3px 10px rgba(5, 150, 105, 0.4);
        }

        /* Mobile responsive */
        @media (max-width: 768px) {
            #reviewer-back-button {
                top: 6px;
                left: 6px;
            }
            
            #reviewer-back-button button {
                padding: 4px 10px;
                font-size: 11px;
            }
        }

        /* Hide during answer reveal animation */
        body.nightMode #reviewer-back-button button {
            background: linear-gradient(135deg, #1e40af 0%, #2563eb 100%);
        }
    `;

    // Append to document
    document.head.appendChild(style);
    document.body.appendChild(backButton);

    // Add keyboard shortcut (ESC to go back)
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
            const activeElement = document.activeElement as HTMLElement;
            // Don't trigger if user is typing in an input
            if (activeElement?.tagName !== "INPUT" && activeElement?.tagName !== "TEXTAREA") {
                e.preventDefault();
                (window as any).pycmd("study");
            }
        }
    });

    console.log("✅ Reviewer back button initialized");
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupReviewerBackButton);
} else {
    setupReviewerBackButton();
}

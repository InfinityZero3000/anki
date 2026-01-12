# Copyright: Ankitects Pty Ltd and contributors
# License: GNU AGPL, version 3 or later; http://www.gnu.org/licenses/agpl.html

"""
Enhanced Study Reminder with Push Notifications
Reminds users to study at scheduled times
"""

from __future__ import annotations

import time
from datetime import datetime, timedelta
from typing import Optional

from aqt import mw
from aqt.qt import *
from aqt.utils import showInfo, tooltip


class StudyReminder:
    """Enhanced study reminder with push notifications"""

    def __init__(self):
        self.enabled = True
        self.reminder_times = ["09:00", "14:00", "19:00"]  # Default times
        self.last_reminder = None
        self.timer = None
        self.notification_sound = True
        
    def start(self):
        """Start the reminder timer"""
        if not self.enabled:
            return
            
        # Check every minute
        self.timer = QTimer()
        self.timer.timeout.connect(self.check_reminder)
        self.timer.start(60000)  # 60 seconds
        
    def stop(self):
        """Stop the reminder timer"""
        if self.timer:
            self.timer.stop()
            
    def check_reminder(self):
        """Check if it's time to remind"""
        if not self.enabled or not mw:
            return
            
        current_time = datetime.now().strftime("%H:%M")
        
        # Check if current time matches any reminder time
        if current_time in self.reminder_times:
            # Avoid duplicate reminders in the same minute
            if self.last_reminder == current_time:
                return
                
            self.last_reminder = current_time
            self.show_reminder()
            
    def show_reminder(self):
        """Show study reminder notification"""
        if not mw:
            return
            
        # Get study statistics
        try:
            stats = self.get_study_stats()
            due_count = stats.get("due", 0)
            new_count = stats.get("new", 0)
            
            if due_count == 0 and new_count == 0:
                message = "🎉 Great job! You've completed all your reviews for now."
                self.show_notification("Study Complete", message, celebrate=True)
            else:
                message = f"📚 Time to study!\n\n"
                if new_count > 0:
                    message += f"• {new_count} new cards to learn\n"
                if due_count > 0:
                    message += f"• {due_count} cards to review\n"
                message += "\nLet's keep your learning streak going! 💪"
                
                self.show_notification("Study Reminder", message)
                
        except Exception as e:
            print(f"Error showing reminder: {e}")
            self.show_notification(
                "Study Reminder",
                "📚 It's time for your study session!\n\nOpen Anki to continue learning."
            )
    
    def show_notification(self, title: str, message: str, celebrate: bool = False):
        """Show system notification and in-app dialog"""
        # System notification (platform-specific)
        self.show_system_notification(title, message)
        
        # In-app notification
        if celebrate:
            self.show_celebration_dialog(title, message)
        else:
            self.show_reminder_dialog(title, message)
            
    def show_system_notification(self, title: str, message: str):
        """Show system notification"""
        try:
            # Try to use QSystemTrayIcon for notifications
            if hasattr(mw, 'trayIcon') and mw.trayIcon:
                mw.trayIcon.showMessage(
                    title,
                    message,
                    QSystemTrayIcon.MessageIcon.Information,
                    5000  # 5 seconds
                )
            else:
                # Fallback to tooltip
                tooltip(f"{title}\n{message}", period=5000)
        except Exception as e:
            print(f"Error showing system notification: {e}")
            
    def show_reminder_dialog(self, title: str, message: str):
        """Show reminder dialog"""
        if not mw:
            return
            
        dialog = QDialog(mw)
        dialog.setWindowTitle(title)
        dialog.setMinimumWidth(400)
        
        layout = QVBoxLayout()
        layout.setSpacing(20)
        layout.setContentsMargins(30, 30, 30, 30)
        
        # Icon
        icon_label = QLabel("📚")
        icon_label.setStyleSheet("""
            font-size: 64px;
            text-align: center;
        """)
        icon_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        layout.addWidget(icon_label)
        
        # Message
        msg_label = QLabel(message)
        msg_label.setStyleSheet("""
            font-size: 16px;
            line-height: 1.6;
            color: #1e293b;
        """)
        msg_label.setWordWrap(True)
        msg_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        layout.addWidget(msg_label)
        
        # Buttons
        button_layout = QHBoxLayout()
        button_layout.setSpacing(10)
        
        study_button = QPushButton("📖 Start Studying")
        study_button.setStyleSheet("""
            QPushButton {
                background: qlineargradient(x1:0, y1:0, x2:1, y2:0,
                    stop:0 #2563eb, stop:1 #3b82f6);
                color: white;
                border: none;
                border-radius: 8px;
                padding: 12px 24px;
                font-size: 14px;
                font-weight: 600;
            }
            QPushButton:hover {
                background: qlineargradient(x1:0, y1:0, x2:1, y2:0,
                    stop:0 #1e40af, stop:1 #2563eb);
            }
        """)
        study_button.clicked.connect(lambda: self.start_study(dialog))
        
        later_button = QPushButton("⏰ Remind Me Later")
        later_button.setStyleSheet("""
            QPushButton {
                background: white;
                color: #64748b;
                border: 2px solid #e2e8f0;
                border-radius: 8px;
                padding: 12px 24px;
                font-size: 14px;
                font-weight: 600;
            }
            QPushButton:hover {
                background: #f8fafc;
                border-color: #cbd5e1;
            }
        """)
        later_button.clicked.connect(lambda: self.snooze_reminder(dialog))
        
        button_layout.addWidget(later_button)
        button_layout.addWidget(study_button)
        layout.addLayout(button_layout)
        
        dialog.setLayout(layout)
        dialog.setStyleSheet("""
            QDialog {
                background: qlineargradient(x1:0, y1:0, x2:0, y2:1,
                    stop:0 #ffffff, stop:1 #f8fafc);
            }
        """)
        
        dialog.exec()
        
    def show_celebration_dialog(self, title: str, message: str):
        """Show celebration dialog"""
        if not mw:
            return
            
        dialog = QDialog(mw)
        dialog.setWindowTitle(title)
        dialog.setMinimumWidth(400)
        
        layout = QVBoxLayout()
        layout.setSpacing(20)
        layout.setContentsMargins(30, 30, 30, 30)
        
        # Icon
        icon_label = QLabel("🎉")
        icon_label.setStyleSheet("""
            font-size: 64px;
            text-align: center;
        """)
        icon_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        layout.addWidget(icon_label)
        
        # Message
        msg_label = QLabel(message)
        msg_label.setStyleSheet("""
            font-size: 16px;
            line-height: 1.6;
            color: #1e293b;
        """)
        msg_label.setWordWrap(True)
        msg_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        layout.addWidget(msg_label)
        
        # Button
        ok_button = QPushButton("✨ Awesome!")
        ok_button.setStyleSheet("""
            QPushButton {
                background: qlineargradient(x1:0, y1:0, x2:1, y2:0,
                    stop:0 #16a34a, stop:1 #22c55e);
                color: white;
                border: none;
                border-radius: 8px;
                padding: 12px 24px;
                font-size: 14px;
                font-weight: 600;
            }
            QPushButton:hover {
                background: qlineargradient(x1:0, y1:0, x2:1, y2:0,
                    stop:0 #15803d, stop:1 #16a34a);
            }
        """)
        ok_button.clicked.connect(dialog.accept)
        layout.addWidget(ok_button)
        
        dialog.setLayout(layout)
        dialog.setStyleSheet("""
            QDialog {
                background: qlineargradient(x1:0, y1:0, x2:0, y2:1,
                    stop:0 #ffffff, stop:1 #f0fdf4);
            }
        """)
        
        dialog.exec()
        
    def start_study(self, dialog: QDialog):
        """Start studying"""
        dialog.accept()
        if mw:
            mw.moveToState("review")
            
    def snooze_reminder(self, dialog: QDialog):
        """Snooze reminder for 30 minutes"""
        dialog.accept()
        
        # Add a temporary reminder in 30 minutes
        snooze_time = (datetime.now() + timedelta(minutes=30)).strftime("%H:%M")
        if snooze_time not in self.reminder_times:
            self.reminder_times.append(snooze_time)
            tooltip("⏰ Reminder snoozed for 30 minutes")
            
    def get_study_stats(self):
        """Get study statistics"""
        if not mw or not mw.col:
            return {"due": 0, "new": 0}
            
        try:
            deck = mw.col.decks.current()
            counts = mw.col.sched.counts()
            
            return {
                "new": counts[0] if counts else 0,
                "learning": counts[1] if len(counts) > 1 else 0,
                "due": counts[2] if len(counts) > 2 else 0,
            }
        except Exception as e:
            print(f"Error getting study stats: {e}")
            return {"due": 0, "new": 0}
            
    def set_reminder_times(self, times: list[str]):
        """Set reminder times (format: HH:MM)"""
        self.reminder_times = times
        
    def add_reminder_time(self, time: str):
        """Add a reminder time"""
        if time not in self.reminder_times:
            self.reminder_times.append(time)
            
    def remove_reminder_time(self, time: str):
        """Remove a reminder time"""
        if time in self.reminder_times:
            self.reminder_times.remove(time)


# Global instance
_reminder: Optional[StudyReminder] = None


def get_study_reminder() -> StudyReminder:
    """Get or create study reminder instance"""
    global _reminder
    if _reminder is None:
        _reminder = StudyReminder()
    return _reminder


def init_study_reminder():
    """Initialize and start study reminder"""
    reminder = get_study_reminder()
    reminder.start()
    return reminder

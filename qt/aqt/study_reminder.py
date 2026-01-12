# Copyright: Ankitects Pty Ltd and contributors
# License: GNU AGPL, version 3 or later; http://www.gnu.org/licenses/agpl.html

"""
Study Reminder Notification System
Sends push notifications to remind users to study
"""

import datetime
import json
import os
import platform
import subprocess
from typing import Optional, Dict, Any
from pathlib import Path

from aqt import mw
from aqt.qt import QTimer, QTime
from anki.utils import int_time


class StudyReminder:
    """Manage study reminder notifications"""

    def __init__(self):
        self.config: Dict[str, Any] = self._load_config()
        self.timer = QTimer()
        self.timer.timeout.connect(self._check_and_send_reminder)
        self._setup_timer()

    def _load_config(self) -> Dict[str, Any]:
        """Load reminder configuration"""
        default_config = {
            "enabled": True,
            "reminder_times": ["09:00", "14:00", "19:00"],  # 9 AM, 2 PM, 7 PM
            "min_cards_due": 5,  # Minimum cards due before reminding
            "notification_title": "📚 Anki Study Reminder",
            "notification_message": "You have {cards} cards to review!",
            "streak_enabled": True,
            "daily_goal": 20,  # Daily review goal
            "last_study_date": None,
            "current_streak": 0,
        }

        config_path = self._get_config_path()
        if config_path.exists():
            try:
                with open(config_path, "r", encoding="utf-8") as f:
                    saved_config = json.load(f)
                    default_config.update(saved_config)
            except Exception as e:
                print(f"Error loading reminder config: {e}")

        return default_config

    def _save_config(self) -> None:
        """Save reminder configuration"""
        try:
            config_path = self._get_config_path()
            config_path.parent.mkdir(parents=True, exist_ok=True)

            with open(config_path, "w", encoding="utf-8") as f:
                json.dump(self.config, f, indent=2)
        except Exception as e:
            print(f"Error saving reminder config: {e}")

    def _get_config_path(self) -> Path:
        """Get configuration file path"""
        if mw and mw.pm and mw.pm.profileFolder():
            profile_path = Path(mw.pm.profileFolder())
            return profile_path / "study_reminders.json"
        else:
            # Fallback to home directory
            return Path.home() / ".anki_study_reminders.json"

    def _setup_timer(self) -> None:
        """Setup timer to check reminders every minute"""
        # Check every minute
        self.timer.start(60000)

    def _check_and_send_reminder(self) -> None:
        """Check if it's time to send a reminder"""
        if not self.config["enabled"]:
            return

        if not mw or not mw.col:
            return

        current_time = QTime.currentTime().toString("HH:mm")

        # Check if current time matches any reminder time
        if current_time in self.config["reminder_times"]:
            self._send_reminder()

    def _send_reminder(self) -> None:
        """Send study reminder notification"""
        if not mw or not mw.col:
            return

        # Get cards due
        cards_due = self._get_cards_due()

        if cards_due < self.config["min_cards_due"]:
            return

        # Update streak
        self._update_streak()

        # Prepare notification message
        message = self.config["notification_message"].format(cards=cards_due)

        if self.config["streak_enabled"] and self.config["current_streak"] > 0:
            message += f"\n🔥 Current streak: {self.config['current_streak']} days"

        # Send notification based on platform
        self._send_platform_notification(
            self.config["notification_title"], message
        )

    def _get_cards_due(self) -> int:
        """Get number of cards due"""
        if not mw or not mw.col:
            return 0

        return mw.col.sched.counts()[0] + mw.col.sched.counts()[1] + mw.col.sched.counts()[2]

    def _update_streak(self) -> None:
        """Update study streak"""
        today = datetime.date.today().isoformat()
        last_study = self.config.get("last_study_date")

        if last_study == today:
            # Already studied today
            return

        if last_study:
            last_date = datetime.date.fromisoformat(last_study)
            days_diff = (datetime.date.today() - last_date).days

            if days_diff == 1:
                # Consecutive day
                self.config["current_streak"] += 1
            elif days_diff > 1:
                # Streak broken
                self.config["current_streak"] = 1
        else:
            # First study
            self.config["current_streak"] = 1

        self.config["last_study_date"] = today
        self._save_config()

    def _send_platform_notification(self, title: str, message: str) -> None:
        """Send notification based on operating system"""
        system = platform.system()

        try:
            if system == "Darwin":  # macOS
                self._send_macos_notification(title, message)
            elif system == "Linux":
                self._send_linux_notification(title, message)
            elif system == "Windows":
                self._send_windows_notification(title, message)
        except Exception as e:
            print(f"Error sending notification: {e}")

    def _send_macos_notification(self, title: str, message: str) -> None:
        """Send notification on macOS"""
        script = f'''
        display notification "{message}" with title "{title}" sound name "Ping"
        '''
        subprocess.run(["osascript", "-e", script], check=False)

    def _send_linux_notification(self, title: str, message: str) -> None:
        """Send notification on Linux"""
        try:
            subprocess.run(
                ["notify-send", title, message, "-i", "anki"],
                check=False
            )
        except FileNotFoundError:
            print("notify-send not found. Install libnotify.")

    def _send_windows_notification(self, title: str, message: str) -> None:
        """Send notification on Windows"""
        try:
            from win10toast import ToastNotifier
            toaster = ToastNotifier()
            toaster.show_toast(
                title,
                message,
                icon_path=None,
                duration=5,
                threaded=True
            )
        except ImportError:
            print("win10toast not installed. Install with: pip install win10toast")

    def set_reminder_times(self, times: list[str]) -> None:
        """Set reminder times (format: HH:MM)"""
        self.config["reminder_times"] = times
        self._save_config()

    def set_enabled(self, enabled: bool) -> None:
        """Enable or disable reminders"""
        self.config["enabled"] = enabled
        self._save_config()

    def set_daily_goal(self, goal: int) -> None:
        """Set daily review goal"""
        self.config["daily_goal"] = goal
        self._save_config()

    def get_streak(self) -> int:
        """Get current study streak"""
        return self.config.get("current_streak", 0)

    def mark_studied_today(self) -> None:
        """Mark that user studied today"""
        self._update_streak()

    def send_test_notification(self) -> None:
        """Send a test notification"""
        self._send_platform_notification(
            "🧪 Test Notification",
            "Anki notifications are working! You'll receive study reminders."
        )


# Global instance
_reminder: Optional[StudyReminder] = None


def get_reminder() -> StudyReminder:
    """Get or create study reminder instance"""
    global _reminder
    if _reminder is None:
        _reminder = StudyReminder()
    return _reminder


def init_reminder() -> None:
    """Initialize study reminder system"""
    get_reminder()


def on_answer_card() -> None:
    """Called when user answers a card"""
    reminder = get_reminder()
    reminder.mark_studied_today()

# Copyright: Ankitects Pty Ltd and contributors
# License: GNU AGPL, version 3 or later; http://www.gnu.org/licenses/agpl.html

"""
Modern Back/Close Button for Anki Windows
Adds a beautiful back button with gradient styling to all windows
"""

from __future__ import annotations

from aqt.qt import *


def add_modern_back_button(
    window: QMainWindow | QDialog,
    text: str = "← Quay lại",
    on_close: callable = None,
    show_home: bool = True,
) -> QToolBar:
    """
    Add a modern gradient back button to any window
    
    Args:
        window: The QMainWindow or QDialog to add button to
        text: Button text (default: "← Quay lại")
        on_close: Custom close handler (default: window.close)
        show_home: Show home icon button (default: True)
    
    Returns:
        QToolBar: The created toolbar
    """
    # Create toolbar
    toolbar = QToolBar("Navigation")
    toolbar.setObjectName("modernBackToolbar")
    toolbar.setMovable(False)
    toolbar.setFloatable(False)
    toolbar.setIconSize(QSize(24, 24))
    
    # Modern gradient styling - very compact version
    toolbar.setStyleSheet("""
        QToolBar {
            background: qlineargradient(x1:0, y1:0, x2:1, y2:0,
                stop:0 #2563eb, stop:1 #3b82f6);
            border: none;
            border-bottom: 1px solid rgba(37, 99, 235, 0.3);
            padding: 4px 8px;
            spacing: 6px;
            max-height: 36px;
            min-height: 36px;
        }
        QToolButton {
            background: rgba(255, 255, 255, 0.15);
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 5px;
            padding: 4px 12px;
            font-weight: 600;
            font-size: 12px;
            min-width: 80px;
            max-height: 28px;
        }
        QToolButton:hover {
            background: rgba(255, 255, 255, 0.25);
            border-color: rgba(255, 255, 255, 0.5);
        }
        QToolButton:pressed {
            background: rgba(255, 255, 255, 0.35);
        }
    """)
    
    # Add toolbar based on window type
    if isinstance(window, QMainWindow):
        window.addToolBar(Qt.ToolBarArea.TopToolBarArea, toolbar)
    elif isinstance(window, QDialog):
        # For QDialog, add toolbar to layout
        if window.layout() is None:
            layout = QVBoxLayout()
            window.setLayout(layout)
        else:
            layout = window.layout()
        
        # Create widget container for toolbar
        toolbar_widget = QWidget()
        toolbar_layout = QHBoxLayout(toolbar_widget)
        toolbar_layout.setContentsMargins(0, 0, 0, 0)
        toolbar_layout.setSpacing(0)
        
        # Style the container - very compact version
        toolbar_widget.setStyleSheet("""
            QWidget {
                background: qlineargradient(x1:0, y1:0, x2:1, y2:0,
                    stop:0 #2563eb, stop:1 #3b82f6);
                border-bottom: 1px solid rgba(37, 99, 235, 0.3);
                padding: 4px 8px;
                max-height: 36px;
                min-height: 36px;
            }
        """)
        
        # Add buttons directly to layout
        back_btn = QPushButton(text)
        back_btn.setStyleSheet("""
            QPushButton {
                background: rgba(255, 255, 255, 0.15);
                color: white;
                border: 1px solid rgba(255, 255, 255, 0.3);
                border-radius: 5px;
                padding: 4px 12px;
                font-weight: 600;
                font-size: 12px;
                min-width: 80px;
                max-height: 28px;
            }
            QPushButton:hover {
                background: rgba(255, 255, 255, 0.25);
                border-color: rgba(255, 255, 255, 0.5);
            }
            QPushButton:pressed {
                background: rgba(255, 255, 255, 0.35);
            }
        """)
        
        if on_close:
            back_btn.clicked.connect(on_close)
        else:
            back_btn.clicked.connect(window.close)
        
        toolbar_layout.addWidget(back_btn)
        toolbar_layout.addStretch()
        
        if show_home:
            home_btn = QPushButton("⌂ Trang chủ")
            home_btn.setStyleSheet(back_btn.styleSheet())
            home_btn.clicked.connect(window.close)
            toolbar_layout.addWidget(home_btn)
        
        # Insert at top of layout
        if isinstance(layout, QVBoxLayout):
            layout.insertWidget(0, toolbar_widget)
        
        return toolbar
    
    # Create back action
    back_action = QAction(text, window)
    back_action.setShortcut("Ctrl+B")
    back_action.setToolTip(f"{text} (Ctrl+B)")
    
    if on_close:
        qconnect(back_action.triggered, on_close)
    else:
        qconnect(back_action.triggered, window.close)
    
    toolbar.addAction(back_action)
    
    # Add spacer
    spacer = QWidget()
    spacer.setSizePolicy(QSizePolicy.Policy.Expanding, QSizePolicy.Policy.Expanding)
    toolbar.addWidget(spacer)
    
    # Add home button if requested
    if show_home:
        home_action = QAction("⌂ Trang chủ", window)
        home_action.setToolTip("Đóng cửa sổ")
        qconnect(home_action.triggered, window.close)
        toolbar.addAction(home_action)
    
    # Add ESC shortcut for easy close
    esc_shortcut = QShortcut(QKeySequence("Esc"), window)
    qconnect(esc_shortcut.activated, window.close)
    
    return toolbar


def add_close_button_to_dialog(dialog: QDialog, text: str = "✖ Đóng") -> QPushButton:
    """
    Add a modern close button to dialog's button box
    
    Args:
        dialog: The QDialog to add button to
        text: Button text (default: "✖ Đóng")
    
    Returns:
        QPushButton: The created button
    """
    # Find or create button box
    button_box = dialog.findChild(QDialogButtonBox)
    
    if not button_box:
        button_box = QDialogButtonBox(QDialogButtonBox.StandardButton.Close)
        if dialog.layout():
            dialog.layout().addWidget(button_box)
    
    # Style the button box
    button_box.setStyleSheet("""
        QDialogButtonBox {
            padding: 12px;
        }
        QPushButton {
            background: qlineargradient(x1:0, y1:0, x2:1, y2:0,
                stop:0 #ef4444, stop:1 #dc2626);
            color: white;
            border: none;
            border-radius: 8px;
            padding: 10px 24px;
            font-weight: 600;
            font-size: 14px;
            min-width: 100px;
        }
        QPushButton:hover {
            background: qlineargradient(x1:0, y1:0, x2:1, y2:0,
                stop:0 #dc2626, stop:1 #b91c1c);
        }
        QPushButton:pressed {
            background: qlineargradient(x1:0, y1:0, x2:1, y2:0,
                stop:0 #b91c1c, stop:1 #991b1b);
        }
    """)
    
    # Connect close
    qconnect(button_box.rejected, dialog.close)
    
    return button_box


def add_keyboard_shortcuts_info(window: QWidget) -> QLabel:
    """
    Add a keyboard shortcuts info label to window
    
    Args:
        window: The window to add label to
    
    Returns:
        QLabel: The created label
    """
    info_label = QLabel("💡 Phím tắt: <b>ESC</b> hoặc <b>Ctrl+B</b> để đóng")
    info_label.setStyleSheet("""
        QLabel {
            background: #dbeafe;
            color: #1e40af;
            padding: 8px 16px;
            border-radius: 8px;
            font-size: 13px;
            border: 1px solid #93c5fd;
        }
    """)
    info_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
    
    return info_label

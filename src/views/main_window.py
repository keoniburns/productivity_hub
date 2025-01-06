from PyQt6.QtWidgets import (
    QMainWindow,
    QWidget,
    QVBoxLayout,
    QTabWidget,
)
from PyQt6.QtGui import QShortcut
from PyQt6.QtCore import Qt
from .calendar_view import CalendarView
from .journal_view import JournalView
from .leetcode_view import LeetCodeView
from .news_view import NewsView


class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Productivity Hub")

        # Create and set up the central widget
        central_widget = QWidget()
        self.setCentralWidget(central_widget)

        # Create main layout
        main_layout = QVBoxLayout(central_widget)
        main_layout.setContentsMargins(20, 20, 20, 20)

        # Create tab widget
        tab_widget = QTabWidget()
        tab_widget.setObjectName("tab_widget")

        # Create tabs
        calendar_tab = CalendarView()
        journal_tab = JournalView()
        leetcode_tab = LeetCodeView()
        news_tab = NewsView()

        # Add tabs to tab widget
        tab_widget.addTab(calendar_tab, "Calendar")
        tab_widget.addTab(journal_tab, "Journal")
        tab_widget.addTab(leetcode_tab, "LeetCode")
        tab_widget.addTab(news_tab, "News")

        # Set up keyboard shortcuts for tabs
        QShortcut("Alt+1", self).activated.connect(
            lambda: tab_widget.setCurrentIndex(0)
        )
        QShortcut("Alt+2", self).activated.connect(
            lambda: tab_widget.setCurrentIndex(1)
        )
        QShortcut("Alt+3", self).activated.connect(
            lambda: tab_widget.setCurrentIndex(2)
        )
        QShortcut("Alt+4", self).activated.connect(
            lambda: tab_widget.setCurrentIndex(3)
        )

        # Add tab widget to main layout
        main_layout.addWidget(tab_widget)

        # Apply custom styling
        self.apply_styles()

        # Set a reasonable window size
        self.resize(1200, 800)

    def apply_styles(self):
        """Apply custom styles to the application"""
        self.setStyleSheet(
            """
            QMainWindow {
                background-color: #2d2d2d;
            }
            
            QTabWidget::pane {
                border: none;
                background-color: #2d2d2d;
                border-radius: 8px;
            }
            
            QTabBar::tab {
                background-color: #363636;
                color: #ffffff;
                padding: 8px 20px;
                margin: 4px;
                border-radius: 15px;
                min-width: 80px;
            }
            
            QTabBar::tab:selected {
                background-color: #1e1e1e;
                color: #ffffff;
            }
            
            QTabBar::tab:!selected:hover {
                background-color: #4d4d4d;
            }
            
            QTabWidget {
                background-color: #1e1e1e;
            }
        """
        )

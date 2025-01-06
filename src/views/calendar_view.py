from PyQt6.QtWidgets import (
    QWidget,
    QVBoxLayout,
    QCalendarWidget,
    QHBoxLayout,
    QLabel,
    QPushButton,
    QDialog,
    QLineEdit,
    QTimeEdit,
    QDialogButtonBox,
    QComboBox,
)
from PyQt6.QtCore import Qt, QDate, QTime
from PyQt6.QtGui import QTextCharFormat, QColor, QFont, QPen


class AddEventDialog(QDialog):
    def __init__(self, parent=None, date=None):
        super().__init__(parent)
        self.setWindowTitle("Add Event")
        self.setModal(True)
        self.setMinimumWidth(400)
        self.setStyleSheet(
            """
            QDialog {
                background-color: #282a36;
                color: #f8f8f2;
            }
            QLineEdit, QTimeEdit {
                background-color: #1e1e1e;
                color: #f8f8f2;
                border: 1px solid #404040;
                border-radius: 10px;
                padding: 8px;
                font-size: 14px;
            }
            QLineEdit:focus, QTimeEdit:focus {
                border: 1px solid #6272a4;
            }
            
            /* Hide time editor arrows */
            QTimeEdit::up-button,
            QTimeEdit::down-button {
                width: 0;
                border: none;
            }
            
            QComboBox {
                background-color: #1e1e1e;
                color: #f8f8f2;
                border: 1px solid #404040;
                border-radius: 10px;
                padding: 8px;
                min-width: 70px;
            }
            
            QComboBox::drop-down {
                border: none;
            }
    
            
            QComboBox:on {
                border: 1px solid #6272a4;
            }
            
            QComboBox QAbstractItemView {
                background-color: #1e1e1e;
                color: #f8f8f2;
                selection-background-color: #4d4d4d;
            }
            
            QPushButton {
                background-color: #44475a;
                color: #f8f8f2;
                border: none;
                border-radius: 10px;
                padding: 8px 16px;
                min-width: 80px;
            }
            QPushButton:hover {
                background-color: #6272a4;
            }
            QLabel {
                color: #f8f8f2;
                font-size: 14px;
                padding: 4px;
            }
        """
        )

        layout = QVBoxLayout(self)
        layout.setSpacing(15)
        layout.setContentsMargins(20, 20, 20, 20)

        # Event title
        title_label = QLabel("Event Title:")
        layout.addWidget(title_label)

        self.title_input = QLineEdit()
        self.title_input.setPlaceholderText("Enter event title")
        layout.addWidget(self.title_input)

        # Time selection
        time_label = QLabel("Event Time:")
        layout.addWidget(time_label)

        time_layout = QHBoxLayout()

        self.time_edit = QTimeEdit()
        self.time_edit.setDisplayFormat("hh:mm")
        current_time = QTime.currentTime()
        hour = current_time.hour()
        self.time_edit.setTime(QTime(hour % 12 or 12, current_time.minute()))
        self.time_edit.setButtonSymbols(QTimeEdit.ButtonSymbols.NoButtons)
        self.time_edit.setMinimumWidth(100)

        self.period_combo = QComboBox()
        self.period_combo.addItems(["AM", "PM"])
        self.period_combo.setMaximumWidth(80)
        self.period_combo.setCurrentText("PM" if hour >= 12 else "AM")
        self.period_combo.setStyleSheet(
            """
            QComboBox {
                background-color: #1e1e1e;
                color: #f8f8f2;
                border: 1px solid #404040;
                border-radius: 4px;
                padding: 8px;
                min-width: 70px;
            }
            
            QComboBox::drop-down {
                border: none;
            }
            
            QComboBox::down-arrow {
                image: none;
                border-top: 5px solid #f8f8f2;
                border-left: 4px solid transparent;
                border-right: 4px solid transparent;
                margin-right: 8px;
            }
            
            QComboBox:on {
                border: 1px solid #6272a4;
            }
            
            QComboBox QAbstractItemView {
                background-color: #1e1e1e;
                color: #f8f8f2;
                selection-background-color: #44475a;
            }
        """
        )

        time_layout.addWidget(self.time_edit)
        time_layout.addWidget(self.period_combo)
        time_layout.addStretch()

        layout.addLayout(time_layout)

        # Add some spacing before buttons
        layout.addSpacing(10)

        # Dialog buttons
        button_box = QDialogButtonBox(
            QDialogButtonBox.StandardButton.Ok | QDialogButtonBox.StandardButton.Cancel
        )
        button_box.accepted.connect(self.accept)
        button_box.rejected.connect(self.reject)

        # Style individual buttons
        for button in button_box.buttons():
            if button_box.buttonRole(button) == QDialogButtonBox.ButtonRole.AcceptRole:
                button.setStyleSheet(
                    """
                    QPushButton {
                        background-color: #50fa7b;
                        color: #282a36;
                    }
                    QPushButton:hover {
                        background-color: #69ff94;
                    }
                """
                )

        layout.addWidget(button_box)

        # Set initial focus to title input
        self.title_input.setFocus()


class CalendarView(QWidget):
    def __init__(self):
        super().__init__()
        
        # Create main layout with proper spacing
        layout = QHBoxLayout(self)
        layout.setContentsMargins(20, 20, 20, 20)
        layout.setSpacing(20)

        # Create left panel for tasks
        tasks_widget = QWidget()
        tasks_layout = QVBoxLayout(tasks_widget)
        tasks_layout.setSpacing(10)

        # tasks_layout.setContentsMargins(0, 0, 0, 0)

        # Header layout with date and add button
        header_layout = QHBoxLayout()
        header_layout.setContentsMargins(10, 10, 10, 10)
        
        # Date label styling
        self.selected_date_label = QLabel()
        self.selected_date_label.setStyleSheet("""
            QLabel {
                color: #f8f8f2;
                font-size: 18px;
                font-weight: bold;
                padding: 5px;
            }
        """)
        
        # Add button styling
        self.add_event_btn = QPushButton("+")
        self.add_event_btn.setFixedSize(32, 32)
        self.add_event_btn.setStyleSheet("""
            QPushButton {
                background-color: #44475a;
                color: #f8f8f2;
                border: none;
                border-radius: 16px;
                font-size: 18px;
                font-weight: bold;
            }
            QPushButton:hover {
                background-color: #6272a4;
            }
        """)
        
        header_layout.addWidget(self.selected_date_label)
        header_layout.addWidget(self.add_event_btn)
        tasks_layout.addLayout(header_layout)

        # Nothing planned label
        self.no_events_label = QLabel("Nothing planned")
        self.no_events_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        self.no_events_label.setStyleSheet("""
            QLabel {
                color: #6272a4;
                font-size: 14px;
                font-style: italic;
                padding: 20px;
            }
        """)
        tasks_layout.addWidget(self.no_events_label)
        tasks_layout.addStretch()

        # Style the tasks panel
        tasks_widget.setStyleSheet("""
            QWidget {
                background-color: #1e1e1e;
                border-radius: 8px;
            }
        """)
        
        # Calendar styling
        self.calendar = QCalendarWidget()
        self.calendar.setVerticalHeaderFormat(QCalendarWidget.VerticalHeaderFormat.NoVerticalHeader)

        # Mark today's date with a custom format
        today = QDate.currentDate()
        today_format = QTextCharFormat()
        today_format.setForeground(QColor("#50fa7b"))  # Dracula theme green
        today_format.setBackground(QColor("#1e1e1e"))  # Match calendar background
        today_format.setFontWeight(QFont.Weight.Bold)
        today_format.setFontFamily("Noto Sans")
        today_format.setFontUnderline(True)
        today_format.setUnderlineColor(QColor("#50fa7b"))
        self.calendar.setDateTextFormat(today, today_format)

        # Create selected date format
        self.selected_format = QTextCharFormat()
        self.selected_format.setForeground(QColor("#f8f8f2"))
        self.selected_format.setBackground(QColor("#1e1e1e"))
        self.selected_format.setFontWeight(QFont.Weight.Bold)
        self.selected_format.setProperty(QTextCharFormat.Property.OutlinePen, QPen(QColor("#6272a4"), 2))

        # Connect selection changed signal
        self.calendar.selectionChanged.connect(self.update_selected_date_format)

        self.calendar.setStyleSheet("""
            /* Main calendar widget */
            QCalendarWidget {
                background-color: #1e1e1e;
            }
            
            QCalendarWidget QWidget#qt_calendar_navigationbar {
                background-color: #1e1e1e;
                padding: 4px;
            }
            
            /* Month/Year labels */
            QCalendarWidget QToolButton {
                color: #f8f8f2;
                background-color: transparent;
                border-radius: 10px;
                padding: 4px 8px;
                margin: 2px;
                font-size: 14px;
            }
            QCalendarWidget QToolButton:hover {
                background-color: #44475a;
            }
            
            /* Arrow buttons */
            QCalendarWidget QToolButton::menu-indicator { 
                image: none;
            }
            
            QCalendarWidget QToolButton#qt_calendar_prevmonth {
                qproperty-icon: none;
                qproperty-text: "◀";
            }
            
            QCalendarWidget QToolButton#qt_calendar_nextmonth {
                qproperty-icon: none;
                qproperty-text: "▶";
            }
            
            /* Calendar grid */
            QCalendarWidget QTableView {
                background-color: #1e1e1e;
                alternate-background-color: #1e1e1e;
                outline: none;
                border: none;
                border-radius: 10px;
            }
            
            /* Date cells */
            QCalendarWidget QTableView QAbstractItemView {
                outline: none;
                color: #f8f8f2;
                padding: 4px;
                background-color: #1e1e1e;
            }
            
            /* Out of month dates */
            QCalendarWidget QTableView QAbstractItemView:!enabled {
                color: #3d3d3d;
            }
        """)

        # Add widgets to layout
        layout.addWidget(tasks_widget, 1)  # 1 part
        layout.addWidget(self.calendar, 2)  # 2 parts

        # Connect signals
        self.calendar.selectionChanged.connect(self.on_date_selected)
        self.calendar.activated.connect(self.show_add_event_dialog)
        self.add_event_btn.clicked.connect(self.show_add_event_dialog)

        # Initialize with today's date
        self.on_date_selected()

    def on_date_selected(self):
        selected_date = self.calendar.selectedDate()
        formatted_date = selected_date.toString("dddd, MMMM d, yyyy")
        self.selected_date_label.setText(formatted_date)

    def show_add_event_dialog(self):
        dialog = AddEventDialog(self, self.calendar.selectedDate())
        if dialog.exec() == QDialog.DialogCode.Accepted:
            event_title = dialog.title_input.text()
            event_time = dialog.time_edit.time()
            period = dialog.period_combo.currentText()
            print(
                f"New event: {event_title} at {event_time.toString('hh:mm')} {period}"
            )
            # TODO: Save event to database

    def update_selected_date_format(self):
        # Get today's date and selected date
        today = QDate.currentDate()
        selected_date = self.calendar.selectedDate()
        
        # If selected date is today, keep today's format
        if selected_date == today:
            today_format = QTextCharFormat()
            today_format.setForeground(QColor("#50fa7b"))
            today_format.setBackground(QColor("#1e1e1e"))
            today_format.setFontWeight(QFont.Weight.Bold)
            today_format.setFontFamily("Noto Sans")
            today_format.setFontUnderline(True)
            today_format.setUnderlineColor(QColor("#50fa7b"))
            today_format.setProperty(QTextCharFormat.Property.OutlinePen, QPen(QColor("#6272a4"), 2))
            self.calendar.setDateTextFormat(selected_date, today_format)
        else:
            # Apply selected format to the newly selected date
            self.calendar.setDateTextFormat(selected_date, self.selected_format)

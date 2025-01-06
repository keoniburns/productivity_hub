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
from PyQt6.QtGui import QIcon


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
                border-radius: 4px;
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
            
            /* Hide the focus rectangle */
            QComboBox:focus {
                border: 1px solid #6272a4;
            }
            
            QPushButton {
                background-color: #44475a;
                color: #f8f8f2;
                border: none;
                border-radius: 4px;
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
            
            /* Hide the focus rectangle */
            QComboBox:focus {
                border: 1px solid #6272a4;
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

        # Create main layout
        layout = QHBoxLayout(self)
        layout.setContentsMargins(20, 20, 20, 20)
        layout.setSpacing(20)

        # Create left panel for tasks
        tasks_widget = QWidget()
        tasks_layout = QVBoxLayout(tasks_widget)

        # Add date label
        self.selected_date_label = QLabel()
        self.selected_date_label.setStyleSheet(
            """
            QLabel {
                color: #f8f8f2;
                font-size: 16px;
                font-weight: bold;
                padding: 10px;
            }
        """
        )
        tasks_layout.addWidget(self.selected_date_label)

        # Add "Nothing planned" label
        self.no_events_label = QLabel("Nothing planned")
        self.no_events_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        self.no_events_label.setStyleSheet(
            """
            QLabel {
                color: #6272a4;
                font-size: 14px;
                font-style: italic;
                padding: 20px;
            }
        """
        )
        tasks_layout.addWidget(self.no_events_label)

        tasks_layout.addStretch()
        tasks_widget.setStyleSheet(
            """
            QWidget {
                background-color: #1e1e1e;
                border-radius: 10px;
                color: #f8f8f2;
            }
        """
        )
        layout.addWidget(tasks_widget)

        # Create calendar widget
        self.calendar = QCalendarWidget()
        self.calendar.setGridVisible(True)
        self.calendar.setVerticalHeaderFormat(
            QCalendarWidget.VerticalHeaderFormat.NoVerticalHeader
        )
        self.calendar.setNavigationBarVisible(True)

        # Connect date selection signal
        self.calendar.selectionChanged.connect(self.on_date_selected)

        # Set today's date by default
        self.on_date_selected()

        # Style the calendar
        self.calendar.setStyleSheet(
            """
            QCalendarWidget {
                background-color: #1e1e1e;
                border-radius: 10px;
            }
            
            /* Navigation bar styling */
            QCalendarWidget QWidget#qt_calendar_navigationbar {
                background-color: #1e1e1e;
                padding: 16px;
                border-top-left-radius: 10px;
                border-top-right-radius: 10px;
            }
            
            /* Month/Year buttons */
            QCalendarWidget QToolButton {
                color: #f8f8f2;
                background-color: transparent;
                border-radius: 4px;
                margin: 2px;
                padding: 8px 16px;
                font-size: 16px;
                font-weight: bold;
            }

            /* Navigation arrows */
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
            
            QCalendarWidget QToolButton:hover {
                background-color: #44475a;
            }
            
            /* Calendar table */
            QCalendarWidget QTableView {
                background-color: #1e1e1e;
                selection-background-color: #3d3d3d;
                selection-color: #f8f8f2;
                alternate-background-color: transparent;
                gridline-color: #2d2d2d;
            }
            
            /* Header row (Mon to Sun) */
            QCalendarWidget QTableView QHeaderView::section {
                color: #6272a4;
                padding: 8px;
                font-size: 13px;
                font-weight: normal;
                border: none;
                border-bottom: 1px solid #2d2d2d;
                background-color: #1e1e1e;
            }
            
            /* Date cells */
            QCalendarWidget QTableView QAbstractItemView {
                outline: 0;
                color: #f8f8f2;
                font-size: 13px;
                font-weight: normal;
                padding: 0px;
                border: 1px solid #2d2d2d;
                min-height: 60px;
            }
            
            /* Individual date numbers */
            QCalendarWidget QTableView QAbstractItemView::item {
                color: #f8f8f2;
                margin: 0px;

                text-align: left;
                vertical-align: top;
            }
            
            /* Selected date */
            QCalendarWidget QTableView QAbstractItemView:selected {
                background-color: #3d3d3d;
                border-radius: 0px;
                color: #f8f8f2;
            }
            
            /* Today */
            QCalendarWidget QTableView QAbstractItemView[today="true"] {
                background-color: #44475a;
                border-radius: 20px;
                font-weight: bold;
            }
            
            /* Hovered date */
            QCalendarWidget QTableView QAbstractItemView:hover:!selected {
                background-color: #44475a;
                border-radius: 20px;
            }
            
            /* Previous/Next month dates */
            QCalendarWidget QTableView QAbstractItemView:disabled {
                color: #44475a;
            }
            
            /* Spinbox for year */
            QCalendarWidget QSpinBox {
                color: #f8f8f2;
                background-color: transparent;
                selection-background-color: #44475a;
                selection-color: #f8f8f2;
                border-radius: 4px;
                padding: 4px;
                font-size: 16px;
            }
            
            /* Calendar date cells */
            QCalendarWidget QTableView {
                selection-background-color: #44475a;
                selection-color: #f8f8f2;
            }

            QCalendarWidget QTableView QTableCornerButton::section {
                background-color: #282a36;
            }

            /* Individual date cells */
            QCalendarWidget QTableView QLabel {
                qproperty-alignment: 'AlignTop | AlignLeft';
                padding: 2px;
            }

            /* Weekend numbers */
            QCalendarWidget QTableView {
                alternate-background-color: transparent;
            }
            
            QCalendarWidget QAbstractItemView:enabled {
                color: #f8f8f2;  /* Weekday color */
            }
            
            QCalendarWidget QAbstractItemView:disabled {
                color: #44475a;  /* Weekend color */
            }
            
            /* Weekend day headers (Sat/Sun) */
            QCalendarWidget QTableView QHeaderView::section:first,
            QCalendarWidget QTableView QHeaderView::section:last {
                color: #44475a;
            }

            /* All date numbers default color */
            QCalendarWidget QTableView QAbstractItemView {
                color: #f8f8f2;
            }

            /* Weekend numbers specifically */
            QCalendarWidget QTableView QAbstractItemView[weekendDay="true"] {
                color: #44475a;
            }
        """
        )

        # Add calendar to layout
        layout.addWidget(self.calendar)

        # Set layout stretch factors
        layout.setStretch(0, 1)  # Tasks panel
        layout.setStretch(1, 2)  # Calendar

        # Add event button
        self.add_event_btn = QPushButton()
        self.add_event_btn.setIcon(QIcon.fromTheme("list-add"))
        self.add_event_btn.setFixedSize(32, 32)
        self.add_event_btn.setStyleSheet(
            """
            QPushButton {
                background-color: #44475a;
                border: none;
                border-radius: 8px;
                padding: 8px;
            }
            QPushButton:hover {
                background-color: #6272a4;
            }
        """
        )
        self.add_event_btn.clicked.connect(self.show_add_event_dialog)

        # Add button to tasks layout (after date label)
        date_button_layout = QHBoxLayout()
        date_button_layout.addWidget(self.selected_date_label)
        date_button_layout.addWidget(self.add_event_btn)
        tasks_layout.insertLayout(0, date_button_layout)

        # Connect double-click signal
        self.calendar.activated.connect(self.show_add_event_dialog)

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

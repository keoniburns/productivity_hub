from PyQt6.QtWidgets import (
    QWidget,
    QVBoxLayout,
    QHBoxLayout,
    QPushButton,
    QTextEdit,
    QLabel,
    QListWidget,
    QSplitter,
    QLineEdit,
    QMenu,
)
from PyQt6.QtCore import Qt
from PyQt6.QtGui import QIcon
import markdown2


class JournalView(QWidget):
    def __init__(self):
        super().__init__()

        # Create main layout
        layout = QHBoxLayout(self)
        layout.setContentsMargins(20, 20, 20, 20)

        # Initialize widgets
        # Create a container widget for title/prompt
        self.title_prompt_container = QWidget()
        title_prompt_layout = QHBoxLayout(self.title_prompt_container)
        title_prompt_layout.setContentsMargins(0, 0, 0, 0)

        self.title_input = QLineEdit()
        self.title_input.setPlaceholderText("Enter title (optional)")
        self.title_input.setStyleSheet(
            """
            QLineEdit {
                background-color: #1e1e1e;
                color: #f8f8f2;
                border: 1px solid #404040;
                border-radius: 8px;
                padding: 8px;
                font-size: 14px;
            }
            QLineEdit:focus {
                border: 1px solid #505050;
            }
        """
        )

        self.prompt_label = QLabel()
        self.prompt_label.setStyleSheet(
            """
            QLabel {

                color: #bd93f9;
                font-size: 14px;
            }
        """
        )
        self.prompt_label.hide()

        # Create a stacked layout for title/prompt
        title_prompt_layout.addWidget(self.title_input)
        title_prompt_layout.addWidget(self.prompt_label)

        # Create top bar with title/prompt container and icons
        top_bar = QHBoxLayout()
        top_bar.setSpacing(10)

        # Add title/prompt container with stretch
        top_bar.addWidget(self.title_prompt_container, stretch=1)

        # Create new entry button with dropdown
        self.new_entry_button = QPushButton()
        self.new_entry_button.setIcon(QIcon.fromTheme("list-add"))
        self.new_entry_button.setFixedSize(32, 32)
        self.new_entry_button.setStyleSheet(
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
        self.new_entry_button.clicked.connect(self.show_new_entry_menu)

        # Create save button
        self.save_button = QPushButton()
        self.save_button.setIcon(QIcon.fromTheme("document-save"))
        self.save_button.setFixedSize(32, 32)
        self.save_button.setStyleSheet(
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
        self.save_button.clicked.connect(self.save_entry)

        # Add buttons to top bar
        top_bar.addWidget(self.new_entry_button)
        top_bar.addWidget(self.save_button)

        # Create right panel
        right_panel = QWidget()
        right_layout = QVBoxLayout(right_panel)
        right_layout.setContentsMargins(0, 0, 0, 0)

        # Add top bar to right layout
        right_layout.addLayout(top_bar)

        # Add text editor
        self.text_edit = QTextEdit()
        self.text_edit.setMinimumHeight(600)
        self.text_edit.setMinimumWidth(600)
        self.text_edit.setStyleSheet(
            """
            QTextEdit {
                background-color: #1e1e1e;
                color: #f8f8f2;
                border: 1px solid #404040;
                border-radius: 10px;
                padding: 15px;
                font-size: 14px;
            }
            QTextEdit:focus {
                border: 1px solid #505050;
            }
        """
        )
        right_layout.addWidget(self.text_edit)

        # Create left panel for entries list
        left_panel = QWidget()
        left_layout = QVBoxLayout(left_panel)
        left_layout.setContentsMargins(0, 0, 20, 0)

        # Add "Previous Entries" label
        entries_label = QLabel("Previous Entries")
        entries_label.setStyleSheet("color: #f8f8f2; padding-bottom: 10px;")
        left_layout.addWidget(entries_label)

        # Create entries list
        self.entries_list = QListWidget()
        self.entries_list.setMinimumWidth(200)
        self.entries_list.setStyleSheet(
            """
            QListWidget {
                background-color: #1e1e1e;
                color: #f8f8f2;
                border: 1px solid #404040;
                border-radius: 10px;
                padding: 5px;
            }
            QListWidget::item {
                padding: 8px;
                border-radius: 5px;
            }
            QListWidget::item:selected {
                background-color: #44475a;
            }
            QListWidget::item:hover {
                background-color: #2c2f3a;
            }
        """
        )
        left_layout.addWidget(self.entries_list)

        # Create splitter and add panels
        splitter = QSplitter(Qt.Orientation.Horizontal)
        splitter.addWidget(left_panel)
        splitter.addWidget(right_panel)
        splitter.setStretchFactor(1, 2)

        layout.addWidget(splitter)

    def show_new_entry_menu(self):
        menu = QMenu(self)
        blank_action = menu.addAction("Blank Entry")
        prompt_action = menu.addAction("Random Prompt")

        blank_action.triggered.connect(self.create_blank_entry)
        prompt_action.triggered.connect(self.get_random_prompt)

        # Show menu below the button
        menu.exec(
            self.new_entry_button.mapToGlobal(self.new_entry_button.rect().bottomLeft())
        )

    def save_entry(self):
        """Save the current journal entry"""
        if self.prompt_label.isVisible():
            title = self.prompt_label.text()  # Use prompt as title
        else:
            title = self.title_input.text()

        content = self.text_edit.toPlainText()

        # For now, just print the entry (we'll add database storage later)
        print(f"Saving entry: {title}")
        print(f"Content: {content}")

        # Clear the editor
        self.text_edit.clear()
        self.title_input.clear()
        self.title_input.show()  # Show title input after saving
        self.prompt_label.hide()

    def create_blank_entry(self):
        """Create a new blank journal entry"""
        self.prompt_label.hide()
        self.title_input.show()  # Show title input for blank entries
        self.text_edit.clear()
        self.title_input.clear()
        self.title_input.setFocus()

    def get_random_prompt(self):
        """Get a random writing prompt"""
        # Sample prompts (we'll add more and possibly fetch from an API later)
        prompts = [
            "What's a challenge you're currently facing?",
            "What are you grateful for today?",
            "What's something you'd like to achieve this month?",
            "Describe your ideal day.",
            "What's a recent lesson you've learned?",
        ]
        import random

        prompt = random.choice(prompts)
        self.title_input.hide()  # Hide title input for prompted entries
        self.prompt_label.setText(prompt)
        self.prompt_label.show()
        self.text_edit.clear()
        self.text_edit.setFocus()

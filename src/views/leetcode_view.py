from PyQt6.QtWidgets import (
    QWidget,
    QVBoxLayout,
    QHBoxLayout,
    QPushButton,
    QTextEdit,
    QLabel,
    QTreeWidget,
    QTreeWidgetItem,
    QSplitter,
    QComboBox,
)
from PyQt6.QtCore import Qt
from PyQt6.Qsci import QsciScintilla, QsciLexerPython  # pip install QScintilla
from PyQt6.QtGui import QColor  # Add this import


class LeetCodeView(QWidget):
    def __init__(self):
        super().__init__()

        # Create main layout
        layout = QHBoxLayout(self)
        layout.setContentsMargins(20, 20, 20, 20)

        # Create left panel for problem organization
        left_panel = QWidget()
        left_layout = QVBoxLayout(left_panel)

        # Create problem tree widget
        self.problem_tree = QTreeWidget()
        self.problem_tree.setHeaderLabel("Problems by Concept")
        self.problem_tree.setMinimumWidth(250)
        self.problem_tree.setStyleSheet(
            """
            QTreeWidget {
                background-color: #1e1e1e;
                color: #f8f8f2;
                border: 1px solid #404040;
                border-radius: 10px;
                padding: 5px;
            }
            QTreeWidget::item {
                padding: 5px;
            }
            QTreeWidget::item:selected {
                background-color: #2d2d2d;
            }
            QTreeWidget::item:hover {
                background-color: #4d4d4d;
            }
        """
        )

        # Add sample categories (to be replaced with API data)
        self.populate_sample_problems()
        left_layout.addWidget(self.problem_tree)

        # Create right panel
        right_panel = QWidget()
        right_layout = QVBoxLayout(right_panel)

        # Add language selector
        self.language_selector = QComboBox()
        self.language_selector.addItems(["Python", "Java", "C++", "JavaScript"])
        self.language_selector.setStyleSheet(
            """
            QComboBox {
                background-color: #1e1e1e;
                color: #f8f8f2;
                border: 1px solid #404040;
                border-radius: 5px;
                padding: 5px;
            }
            QComboBox::drop-down {
                border: none;
            }
            QComboBox::down-arrow {
                image: none;
            }
        """
        )
        right_layout.addWidget(self.language_selector)

        # Add problem description
        self.description = QTextEdit()
        self.description.setReadOnly(True)
        self.description.setMinimumHeight(200)
        self.description.setStyleSheet(
            """
            QTextEdit {
                background-color: #1e1e1e;
                color: #f8f8f2;
                border: 1px solid #404040;
                border-radius: 10px;
                padding: 15px;
            }
        """
        )
        right_layout.addWidget(self.description)

        # Add code editor with Vim bindings
        self.editor = QsciScintilla()
        self.editor.setMinimumHeight(400)

        # Configure editor
        self.setup_editor()
        right_layout.addWidget(self.editor)

        # Add submit button
        self.submit_button = QPushButton("Submit Solution")
        self.submit_button.setStyleSheet(
            """
            QPushButton {
                background-color: #1d1d1d;
                color: #f8f8f2;
                border: none;
                border-radius: 10px;
                padding: 10px;
                font-weight: bold;
            }
            QPushButton:hover {
                background-color: #3d3d3d;
            }
            QPushButton:pressed {
                background-color: #50fa7b;
            }
        """
        )
        self.submit_button.clicked.connect(self.submit_solution)
        right_layout.addWidget(self.submit_button)

        # Create splitter
        splitter = QSplitter(Qt.Orientation.Horizontal)
        splitter.addWidget(left_panel)
        splitter.addWidget(right_panel)
        splitter.setStretchFactor(1, 2)

        layout.addWidget(splitter)

        # Connect signals
        self.problem_tree.itemClicked.connect(self.load_problem)

    def setup_editor(self):
        """Configure the code editor"""
        # Set up Python lexer with custom colors
        lexer = QsciLexerPython()
        lexer.setDefaultColor(QColor("#f8f8f2"))  # Default text
        lexer.setDefaultPaper(QColor("#1e1e1e"))  # Default background
        lexer.setColor(
            QColor("#e06c75"), QsciLexerPython.ClassName
        )  # Class names - coral
        lexer.setColor(
            QColor("#61afef"), QsciLexerPython.FunctionMethodName
        )  # Functions - blue
        lexer.setColor(QColor("#c678dd"), QsciLexerPython.Keyword)  # Keywords - purple
        lexer.setColor(
            QColor("#98c379"), QsciLexerPython.DoubleQuotedString
        )  # Strings - green
        lexer.setColor(
            QColor("#98c379"), QsciLexerPython.SingleQuotedString
        )  # Strings - green
        lexer.setColor(
            QColor("#f8f8f2"), QsciLexerPython.UnclosedString
        )  # Unclosed strings - white
        lexer.setColor(
            QColor("#d4843e"), QsciLexerPython.Comment
        )  # Comments - rust orange
        lexer.setColor(QColor("#d19a66"), QsciLexerPython.Number)  # Numbers - orange
        lexer.setColor(
            QColor("#e06c75"), QsciLexerPython.HighlightedIdentifier
        )  # Special identifiers - coral
        lexer.setColor(QColor("#f8f8f2"), QsciLexerPython.Operator)  # Operators - white

        self.editor.setLexer(lexer)

        # Set theme colors using QColor
        self.editor.setColor(QColor("#f8f8f2"))  # Text color
        self.editor.setPaper(QColor("#1e1e1e"))  # Background color
        self.editor.setMarginsForegroundColor(QColor("#f8f8f2"))
        self.editor.setMarginsBackgroundColor(QColor("#1e1e1e"))

        # Line numbers
        self.editor.setMarginType(0, QsciScintilla.MarginType.NumberMargin)
        self.editor.setMarginWidth(0, "000")

        # Improved auto-indentation
        self.editor.setAutoIndent(True)
        self.editor.setIndentationGuides(True)
        self.editor.setIndentationsUseTabs(False)  # Use spaces
        self.editor.setTabWidth(4)  # Python standard
        self.editor.setIndentationWidth(4)
        self.editor.setBackspaceUnindents(True)

        # Cursor and caret settings
        self.editor.setCaretForegroundColor(QColor("#f8f8f2"))
        self.editor.setCaretWidth(2)
        self.editor.setCaretLineVisible(True)
        self.editor.setCaretLineBackgroundColor(QColor("#3d3d3d"))

    def populate_sample_problems(self):
        """Add sample problem categories and problems"""
        categories = {
            "Arrays & Hashing": ["Two Sum", "Valid Anagram", "Contains Duplicate"],
            "Two Pointers": ["Valid Palindrome", "3Sum", "Container With Most Water"],
            "Sliding Window": [
                "Best Time to Buy Sell Stock",
                "Longest Substring Without Repeating Chars",
            ],
            "Stack": [
                "Valid Parentheses",
                "Min Stack",
                "Evaluate Reverse Polish Notation",
            ],
            "Binary Search": [
                "Binary Search",
                "Search a 2D Matrix",
                "Koko Eating Bananas",
            ],
            "Trees": [
                "Invert Binary Tree",
                "Maximum Depth of Binary Tree",
                "Same Tree",
            ],
        }

        for category, problems in categories.items():
            category_item = QTreeWidgetItem([category])
            self.problem_tree.addTopLevelItem(category_item)
            for problem in problems:
                problem_item = QTreeWidgetItem([problem])
                category_item.addChild(problem_item)

    def load_problem(self, item):
        """Load the selected problem"""
        # This will be replaced with actual API call
        if item.parent():  # If it's a problem (not a category)
            self.description.setText(
                f"Problem: {item.text(0)}\n\nDescription will be loaded from LeetCode API"
            )
            self.editor.setText(
                "def solution():\n    # Write your solution here\n    pass"
            )

    def submit_solution(self):
        """Submit the solution to LeetCode"""
        # This will be implemented when API is ready
        code = self.editor.text()
        print("Submitting solution:", code)

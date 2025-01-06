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
        lexer = QsciLexerPython()
        
        # Fix the font setup
        font = lexer.defaultFont(0)
        font.setPointSize(12)
        
        # Apply font and background to all styles
        for style in range(32):
            lexer.setFont(font, style)
            lexer.setPaper(QColor("#1e1e1e"), style)
        
        # Configure syntax highlighting with more muted colors
        lexer.setColor(QColor("#b39ddb"), 1)  # Keywords - soft lavender
        # Alternative keyword colors you might prefer:
        # lexer.setColor(QColor("#9e9e9e"), 1)  # Keywords - neutral gray
        # lexer.setColor(QColor("#a89984"), 1)  # Keywords - warm gray
        # lexer.setColor(QColor("#d4bfff"), 1)  # Keywords - very soft purple
        
        lexer.setColor(QColor("#61afef"), 8)  # ClassName - muted blue
        lexer.setColor(QColor("#98c379"), 9)  # FunctionMethodName - sage green
        lexer.setColor(QColor("#e5c07b"), 4)  # DoubleQuotedString - warm gold
        lexer.setColor(QColor("#e5c07b"), 3)  # SingleQuotedString - warm gold
        lexer.setColor(QColor("#d19a66"), 2)  # Number - soft orange
        lexer.setColor(QColor("#7f848e"), 12)  # Comment - subtle gray
        lexer.setColor(QColor("#abb2bf"), 0)  # Default - light gray
        
        # Set default colors
        lexer.setDefaultPaper(QColor("#1e1e1e"))
        lexer.setDefaultColor(QColor("#abb2bf"))
        
        self.editor.setLexer(lexer)
        self.editor.setFont(font)
        
        # Configure margins (line numbers)
        self.editor.setMarginsForegroundColor(QColor("#6272a4"))
        self.editor.setMarginsBackgroundColor(QColor("#1e1e1e"))
        self.editor.setMarginWidth(0, "0000")
        
        # Configure cursor
        self.editor.setCaretLineVisible(False)
        self.editor.setCaretWidth(2)
        self.editor.setCaretForegroundColor(QColor("#f8f8f2"))
        
        # Adjust line spacing
        self.editor.setExtraAscent(-1)
        self.editor.setExtraDescent(-1)
        
        # Ensure editor background is set
        self.editor.setPaper(QColor("#1e1e1e"))

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
        if item.parent():
            self.description.setText(
                f"Problem: {item.text(0)}\n\nDescription will be loaded from LeetCode API"
            )
            
            # Clear and set new text
            self.editor.clear()  # Clear first
            self.editor.setPaper(QColor("#1e1e1e"))  # Reset background
            self.editor.setText(
                "def solution():\n    # Write your solution here\n    pass"
            )
            
            # Force refresh
            self.editor.recolor()

    def submit_solution(self):
        """Submit the solution to LeetCode"""
        # This will be implemented when API is ready
        code = self.editor.text()
        print("Submitting solution:", code)

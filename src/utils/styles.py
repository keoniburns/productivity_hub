import sys

GLOBAL_FONT = "Segoe UI" if sys.platform == "win32" else "SF Pro Display" if sys.platform == "darwin" else "Noto Sans"

GLOBAL_STYLES = f"""
QWidget {{
    font-family: "{GLOBAL_FONT}";
}}

QMainWindow, QDialog {{
    background-color: #282a36;
    color: #f8f8f2;
}}

/* Standard Input Elements */
QLineEdit, QTextEdit, QPlainTextEdit {{
    background-color: #1e1e1e;
    color: #f8f8f2;
    border: 1px solid #404040;
    border-radius: 8px;
    padding: 8px;
    font-size: 14px;
}}

/* Buttons */
QPushButton {{
    background-color: #44475a;
    color: #f8f8f2;
    border: none;
    border-radius: 8px;
    padding: 8px 16px;
    font-size: 14px;
}}

QPushButton:hover {{
    background-color: #6272a4;
}}

QPushButton:pressed {{
    background-color: #50fa7b;
    color: #282a36;
}}

/* Dropdowns */
QComboBox {{
    background-color: #1e1e1e;
    color: #f8f8f2;
    border: 1px solid #404040;
    border-radius: 8px;
    padding: 8px;
    min-width: 70px;
}}

QComboBox::drop-down {{
    border: none;
}}

QComboBox::down-arrow {{
    image: none;
}}

/* Scrollbars */
QScrollBar:vertical {{
    border: none;
    background: #282a36;
    width: 10px;
    margin: 0px;
}}

QScrollBar::handle:vertical {{
    background: #44475a;
    min-height: 20px;
    border-radius: 5px;
}}

QScrollBar::add-line:vertical, 
QScrollBar::sub-line:vertical {{
    border: none;
    background: none;
}}

/* Lists and Trees */
QTreeWidget, QListWidget {{
    background-color: #1e1e1e;
    border: 1px solid #404040;
    border-radius: 8px;
    padding: 5px;
}}

QTreeWidget::item, QListWidget::item {{
    color: #f8f8f2;
    padding: 8px;
    border-radius: 4px;
}}

QTreeWidget::item:selected, 
QListWidget::item:selected {{
    background-color: #44475a;
}}

QTreeWidget::item:hover,
QListWidget::item:hover {{
    background-color: #2c2f3a;
}}
""" 
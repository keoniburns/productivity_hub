from PyQt6.QtGui import QIcon
import sys
import os

def get_icon(name):
    """Get platform-specific icon path"""
    if sys.platform == "darwin":
        # macOS-specific icon path
        icon_path = f":/icons/mac/{name}.svg"
    elif sys.platform == "win32":
        # Windows-specific icon path
        icon_path = f":/icons/win/{name}.svg"
    else:
        # Linux/default icon path
        icon_path = f":/icons/linux/{name}.svg"
    
    return QIcon(icon_path) 
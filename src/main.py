import sys
from PyQt6.QtWidgets import QApplication
from views.main_window import MainWindow
from utils.file_watcher import setup_file_watcher


def main():
    app = QApplication(sys.argv)

    if "--dev" in sys.argv:
        observer = setup_file_watcher()

    window = MainWindow()
    window.show()

    sys.exit(app.exec())


if __name__ == "__main__":
    main()

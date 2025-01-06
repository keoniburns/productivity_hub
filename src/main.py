import sys
from PyQt6.QtWidgets import QApplication
from views.main_window import MainWindow
from utils.file_watcher import setup_file_watcher


def main():
    # Remove --dev from sys.argv before creating QApplication
    dev_mode = "--dev" in sys.argv
    if dev_mode:
        sys.argv.remove("--dev")

    app = QApplication(sys.argv)
    
    # Set up file watcher if in dev mode
    global observer
    observer = setup_file_watcher() if dev_mode else None

    window = MainWindow()
    window.show()

    try:
        sys.exit(app.exec())
    finally:
        if observer:
            observer.stop()
            observer.join()


if __name__ == "__main__":
    main()

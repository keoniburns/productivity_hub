from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import os
import sys
from PyQt6.QtCore import QProcess


class FileChangeHandler(FileSystemEventHandler):
    def __init__(self):
        super().__init__()
        self._last_triggered = 0
        
    def on_modified(self, event):
        if not event.src_path.endswith('.py') or not os.path.isfile(event.src_path):
            return
            
        current_time = os.path.getmtime(event.src_path)
        if current_time - self._last_triggered < 1:
            return
            
        self._last_triggered = current_time
        print(f"Reloading due to changes in {event.src_path}")
        
        # Get the correct Python executable path
        if hasattr(sys, '_MEIPASS'):  # For PyInstaller
            python = sys.executable
        else:
            python = sys.executable
        
        # Get the main.py path
        main_script = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'main.py')
        
        # Construct arguments
        args = [main_script, '--dev']
        
        # Start new process
        QProcess.startDetached(python, args)
        os._exit(0)


def setup_file_watcher():
    event_handler = FileChangeHandler()
    observer = Observer()
    current_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    observer.schedule(event_handler, path=current_dir, recursive=True)
    observer.start()
    return observer

from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import os
import sys
from PyQt6.QtCore import QProcess


class FileChangeHandler(FileSystemEventHandler):
    def on_modified(self, event):
        if event.src_path.endswith(".py"):
            print(f"Reloading due to changes in {event.src_path}")
            # Restart the application
            QProcess.startDetached(sys.executable, sys.argv)
            os._exit(0)


def setup_file_watcher():
    event_handler = FileChangeHandler()
    observer = Observer()
    observer.schedule(event_handler, path="src", recursive=True)
    observer.start()
    return observer

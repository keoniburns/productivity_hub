import sys
from PyQt6.QtWidgets import QApplication, QMainWindow, QPushButton


class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()

        self.setWindowTitle("My App")

        button = QPushButton("Press Me!")
        button.setCheckable(True)
        print(button.isChecked())

        button.clicked.connect(self.the_button_was_clicked())
        # button.clicked.connect(self.is_checked())

        # Set the central widget of the Window.
        self.setCentralWidget(button)

    def the_button_was_clicked(self):
        print(button.setCheckAble())
        print("Clicked!")

    def is_checked(self):
        print()
        # print("button is checked!")


app = QApplication(sys.argv)

window = MainWindow()
window.show()

app.exec()

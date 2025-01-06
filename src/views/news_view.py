from PyQt6.QtWidgets import (
    QMainWindow,
    QWidget,
    QVBoxLayout,
    QLabel,
    QScrollArea,
    QFrame,
    QHBoxLayout,
    QGridLayout,
    QPushButton,
    QListWidget,
    QListWidgetItem,
    QSizePolicy,
)
from PyQt6.QtCore import (
    QThread,
    pyqtSignal,
    Qt,
)

from PyQt6.QtGui import QColor

class NewsWorker(QThread):
    finished = pyqtSignal(list)

    def run(self):
        # Expanded dummy data
        dummy_articles = [
            {
                "title": "OpenAI Announces GPT-5: A New Era in AI",
                "source": {"name": "Tech Daily"},
                "description": "Breaking news in AI development...",
                "content": "OpenAI has announced the release of GPT-5, a new AI model that promises to revolutionize the way we interact with technology. The company claims that GPT-5 is capable of understanding and generating human language with unprecedented accuracy.",
            },
            {
                "title": "Python 4.0 Release Date Confirmed",
                "source": {"name": "Programming Weekly"},
                "description": "The next major Python version...",
                "content": "Python 4.0 has been officially confirmed to be released in June 2025. This new version promises to bring significant improvements to the language, including better performance and more efficient memory management.",
            },
            {
                "title": "New Quantum Computing Breakthrough",
                "source": {"name": "Science Today"},
                "description": "Scientists achieve quantum supremacy...",
                "content": "A team of researchers has successfully demonstrated quantum supremacy, marking a significant milestone in quantum computing. This breakthrough could revolutionize fields from cryptography to drug discovery.",
            },
            {
                "title": "SpaceX Successfully Launches Starship",
                "source": {"name": "Space News"},
                "description": "Historic launch marks new era...",
                "content": "SpaceX has successfully launched its Starship spacecraft, marking a historic moment in space exploration. The launch represents a major step toward making human life multi-planetary.",
            },
            {
                "title": "Major Updates Coming to Git",
                "source": {"name": "Dev Chronicles"},
                "description": "New features for developers...",
                "content": "Git is set to receive major updates that will enhance developer productivity. New features include improved merge conflict resolution and better handling of large repositories.",
            },
            {
                "title": "AI-Powered Code Generation Tools Rise",
                "source": {"name": "Tech Insider"},
                "description": "The future of programming...",
                "content": "AI-powered code generation tools are becoming increasingly sophisticated, raising questions about the future of software development. These tools can now handle complex programming tasks.",
            },
            {
                "title": "New JavaScript Framework Released",
                "source": {"name": "Web Dev News"},
                "description": "Another framework joins the ecosystem...",
                "content": "A new JavaScript framework has been released, promising better performance and developer experience. The framework focuses on simplicity and ease of use.",
            },
            {
                "title": "Cybersecurity Threats on the Rise",
                "source": {"name": "Security Weekly"},
                "description": "Experts warn of new vulnerabilities...",
                "content": "Cybersecurity experts are warning of an increase in sophisticated attacks. Organizations are advised to strengthen their security measures.",
            },
            {
                "title": "Machine Learning Models Get Smaller",
                "source": {"name": "AI Weekly"},
                "description": "Efficient AI development...",
                "content": "Researchers have developed new techniques to create smaller, more efficient machine learning models. These models can run on edge devices while maintaining high accuracy.",
            },
            {
                "title": "Cloud Computing Costs Drop",
                "source": {"name": "Cloud Tech News"},
                "description": "Good news for businesses...",
                "content": "Major cloud providers have announced significant price reductions for their services. This move is expected to make cloud computing more accessible to smaller businesses.",
            },
            {
                "title": "New Database Technology Emerges",
                "source": {"name": "Database Weekly"},
                "description": "Revolutionary data storage...",
                "content": "A new database technology promises to combine the benefits of SQL and NoSQL databases. Early benchmarks show impressive performance improvements.",
            },
            {
                "title": "Linux Kernel Gets Major Update",
                "source": {"name": "Open Source Daily"},
                "description": "Significant improvements...",
                "content": "The Linux kernel has received a major update that improves system performance and adds support for new hardware. The update also includes important security patches.",
            },
            {
                "title": "AR Development Made Easier",
                "source": {"name": "AR/VR Today"},
                "description": "New tools for AR developers...",
                "content": "New development tools have been released that simplify the creation of augmented reality applications. These tools make AR development more accessible to regular developers.",
            },
            {
                "title": "5G Networks Expand Coverage",
                "source": {"name": "Tech Networks"},
                "description": "Faster connectivity coming...",
                "content": "5G network coverage is expanding rapidly across major cities. The improved connectivity is enabling new applications and services.",
            },
            {
                "title": "Blockchain in Supply Chain",
                "source": {"name": "Chain News"},
                "description": "Technology meets logistics...",
                "content": "Major retailers are adopting blockchain technology to improve supply chain transparency. The technology helps track products from source to consumer.",
            },
        ]
        self.finished.emit(dummy_articles)


class NewsCard(QFrame):
    def __init__(self, title, source, description, content):
        super().__init__()
        self.setObjectName("newsCard")
        layout = QVBoxLayout(self)
        layout.setSpacing(8)
        layout.setContentsMargins(20, 20, 20, 20)

        # Remove fixed size to allow responsiveness
        self.setMinimumSize(300, 200)
        self.setSizePolicy(QSizePolicy.Policy.Expanding, QSizePolicy.Policy.Expanding)

        # Title with transparent background
        title_label = QLabel(title)
        title_label.setWordWrap(True)
        title_label.setStyleSheet(
            """
            font-size: 16px;
            font-weight: bold;
            color: #f8f8f2;
            background: transparent;
            border: none;
            padding: 2px;
        """
        )

        # Description with transparent background
        description_label = QLabel(description)
        description_label.setWordWrap(True)
        description_label.setStyleSheet(
            """
            color: #f8f8f2;
            font-size: 14px;
            line-height: 1.4;
            background: transparent;
            border: none;
            padding: 2px;
        """
        )

        # Content preview with transparent background
        content_label = QLabel(f"{content[:150]}...")
        content_label.setWordWrap(True)
        content_label.setStyleSheet(
            """
            color: #f8f8f2;
            font-size: 13px;
            font-style: italic;
            line-height: 1.4;
            background: transparent;
            border: none;
            padding: 2px;
        """
        )

        # Source with transparent background
        source_label = QLabel(f"📰 {source}")
        source_label.setStyleSheet(
            """
            color: #bd93f9;
            font-size: 13px;
            padding-top: 5px;
            background: transparent;
            border: none;
            padding: 2px;
        """
        )

        layout.addWidget(title_label)
        layout.addWidget(description_label)
        layout.addWidget(content_label)
        layout.addWidget(source_label)
        layout.addStretch()

        self.setStyleSheet(
            """
            QFrame#newsCard {
                background-color: #44475a;
                border: 1px solid transparent;
                border-radius: 10px;
                padding: 0px;
                margin: 0px;
            }
            QFrame#newsCard:hover {
                background-color: #6272a4;
            }
        """
        )


class NewsView(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("News Feed")

        # Initialize pagination variables
        self.current_page = 0
        self.articles_per_page = 6
        self.all_articles = []

        # Main widget with horizontal layout
        main_widget = QWidget()
        self.setCentralWidget(main_widget)
        main_layout = QHBoxLayout(main_widget)
        main_layout.setContentsMargins(0, 0, 0, 0)
        main_layout.setSpacing(0)  # Reduce spacing between main components

        # Left panel for topics
        topics_panel = QFrame()
        topics_panel.setObjectName("topicsPanel")
        topics_panel.setFixedWidth(200)
        topics_layout = QVBoxLayout(topics_panel)

        # Topics header
        header = QLabel("Topics")
        header.setStyleSheet(
            """
            font-size: 18px;
            font-weight: bold;
            color: #f8f8f2;
            padding: 10px;
        """
        )

        # Topics list
        self.topics_list = QListWidget()
        self.topics_list.setStyleSheet(
            """
            QListWidget {
                background-color: #1e1e1e;
                border: 1px solid #404040;
                border-radius: 10px;
                padding: 5px;
            }
            QListWidget::item {
                color: #f8f8f2;
                padding: 8px;
                margin: 2px;
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

        # Add topics
        topics = [
            "Technology",
            "Programming",
            "Science",
            "AI",
            "Space",
            "Cybersecurity",
        ]
        for topic in topics:
            item = QListWidgetItem(topic)
            self.topics_list.addItem(item)

        topics_layout.addWidget(header)
        topics_layout.addWidget(self.topics_list)

        # Style the topics panel
        topics_panel.setStyleSheet(
            """
            QFrame#topicsPanel {
                background-color: #1e1e1e;
                border: 1px solid #404040;
                border-radius: 10px;
                margin: 10px;
            }
        """
        )

        # News container and layout
        news_container = QWidget()
        news_layout = QVBoxLayout(news_container)
        news_layout.setContentsMargins(0, 0, 0, 0)
        news_layout.setSpacing(0)  # Reduce spacing in news container

        # Scroll area setup
        scroll = QScrollArea()
        scroll.setWidgetResizable(True)
        scroll.setHorizontalScrollBarPolicy(Qt.ScrollBarPolicy.ScrollBarAlwaysOff)
        scroll.setStyleSheet(
            """
            QScrollArea {
                background-color: transparent;
                border: none;
                border-radius: 10px;
            }
            QScrollBar:vertical {
                border: none;
                background: #282a36;
                width: 10px;
                margin: 0px;
            }
            QScrollBar::handle:vertical {
                background: #44475a;
                min-height: 20px;
                border-radius: 5px;
            }
            QScrollBar::add-line:vertical, QScrollBar::sub-line:vertical {
                border: none;
                background: none;
            }
        """
        )

        content = QWidget()
        content.setStyleSheet(
            """
            QWidget {
                background-color: transparent;
            }
        """
        )

        self.grid_layout = QGridLayout(content)
        self.grid_layout.setSpacing(8)
        self.grid_layout.setContentsMargins(8, 8, 8, 8)
        self.grid_layout.setColumnStretch(0, 1)
        self.grid_layout.setColumnStretch(1, 1)
        scroll.setWidget(content)

        # Create pagination controls
        pagination_widget = QWidget()
        pagination_layout = QHBoxLayout(pagination_widget)

        self.prev_button = QPushButton("Previous")
        self.next_button = QPushButton("Next")
        self.page_label = QLabel("Page 1")

        self.prev_button.setEnabled(False)

        pagination_layout.addStretch()
        pagination_layout.addWidget(self.prev_button)
        pagination_layout.addWidget(self.page_label)
        pagination_layout.addWidget(self.next_button)
        pagination_layout.addStretch()

        # Add widgets to layouts
        news_layout.addWidget(scroll)
        news_layout.addWidget(pagination_widget)

        # Add both panels to main layout
        main_layout.addWidget(topics_panel)
        main_layout.addWidget(news_container)

        # Connect signals
        self.prev_button.clicked.connect(self.previous_page)
        self.next_button.clicked.connect(self.next_page)
        self.topics_list.itemClicked.connect(self.update_topic)

        # Initial news load
        self.worker = NewsWorker()
        self.worker.finished.connect(self.update_news)
        self.worker.start()

    def update_topic(self, item):
        # This will eventually fetch news for the selected topic
        topic = item.text()
        print(f"Fetching news for: {topic}")
        self.worker.start()  # Restart worker with new topic

    def update_news(self, articles):
        self.all_articles = articles
        self.current_page = 0
        self.update_page()

    def update_page(self):
        # Calculate start and end indices
        start_idx = self.current_page * self.articles_per_page
        end_idx = start_idx + self.articles_per_page
        current_articles = self.all_articles[start_idx:end_idx]

        # Update page label
        total_pages = (len(self.all_articles) - 1) // self.articles_per_page + 1
        self.page_label.setText(f"Page {self.current_page + 1} of {total_pages}")

        # Update button states
        self.prev_button.setEnabled(self.current_page > 0)
        self.next_button.setEnabled(end_idx < len(self.all_articles))

        # Clear existing widgets
        for i in reversed(range(self.grid_layout.count())):
            self.grid_layout.itemAt(i).widget().deleteLater()

        # Add current page's articles
        for i, article in enumerate(current_articles):
            row = i // 2
            col = i % 2

            card = NewsCard(
                article["title"],
                article["source"]["name"],
                article["description"],
                article["content"],
            )
            self.grid_layout.addWidget(card, row, col)

    def next_page(self):
        self.current_page += 1
        self.update_page()

    def previous_page(self):
        self.current_page -= 1
        self.update_page()

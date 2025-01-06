package storage

import (
	"database/sql"
	"time"

	_ "github.com/mattn/go-sqlite3"
)

type Store struct {
	db *sql.DB
}

func NewStore(dbPath string) (*Store, error) {
	db, err := sql.Open("sqlite3", dbPath)
	if err != nil {
		return nil, err
	}

	// Create tables if they don't exist
	if err := db.Ping(); err != nil {
		return nil, err
	}

	return &Store{db: db}, nil
}

func (s *Store) SaveArticle(article Article) error {
	_, err := s.db.Exec(`
		INSERT INTO saved_articles (title, url, saved_at)
		VALUES (?, ?, ?)`,
		article.Title, article.URL, time.Now())
	return err
}

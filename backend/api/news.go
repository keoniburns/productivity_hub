package api

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

type NewsClient struct {
	apiKey string
}

type Article struct {
	Title       string    `json:"title"`
	Description string    `json:"description"`
	URL         string    `json:"url"`
	PublishedAt time.Time `json:"publishedAt"`
}

func NewNewsClient(apiKey string) *NewsClient {
	return &NewsClient{apiKey: apiKey}
}

func (c *NewsClient) GetNews(topic string) ([]Article, error) {
	url := fmt.Sprintf("https://newsapi.org/v2/everything?q=%s&apiKey=%s",
		topic, c.apiKey)

	resp, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var result struct {
		Articles []Article `json:"articles"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}

	return result.Articles, nil
}

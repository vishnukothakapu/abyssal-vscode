package main

import (
	"context"
	"errors"
	"fmt"
	"sync"
	"time"
)

const (
	apiURL         = "https://api.example.com"
	defaultTimeout = 30 * time.Second
)

type User struct {
	ID     int
	Name   string
	Email  string
	Active bool
}

type UserRepository interface {
	GetUser(ctx context.Context, id int) (*User, error)
	GetUsers(ctx context.Context, ids []int) ([]*User, error)
}

type UserService struct {
	repository UserRepository
	timeout    time.Duration
}

func NewUserService(
	repository UserRepository,
	timeout time.Duration,
) *UserService {
	return &UserService{
		repository: repository,
		timeout:    timeout,
	}
}

func (s *UserService) GetUser(
	ctx context.Context,
	id int,
) (*User, error) {
	if id <= 0 {
		return nil, errors.New("user ID must be positive")
	}

	user, err := s.repository.GetUser(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("get user: %w", err)
	}

	return user, nil
}

func (s *UserService) GetUsers(
	ctx context.Context,
	ids []int,
) ([]*User, error) {
	users := make([]*User, 0, len(ids))

	for _, id := range ids {
		user, err := s.GetUser(ctx, id)

		if err != nil {
			fmt.Printf(
				"failed to fetch user %d: %v\n",
				id,
				err,
			)
			continue
		}

		users = append(users, user)
	}

	return users, nil
}

func formatUser(user *User) string {
	status := "inactive"

	if user.Active {
		status = "active"
	}

	return fmt.Sprintf(
		"%s <%s> [%s]",
		user.Name,
		user.Email,
		status,
	)
}

func worker(
	ctx context.Context,
	id int,
	results chan<- *User,
	wg *sync.WaitGroup,
) {
	defer wg.Done()

	select {
	case <-time.After(100 * time.Millisecond):
		user := &User{
			ID:     id,
			Name:   fmt.Sprintf("User %d", id),
			Email:  fmt.Sprintf("user%d@example.com", id),
			Active: id%2 == 0,
		}

		results <- user

	case <-ctx.Done():
		fmt.Println("worker cancelled")
	}
}

func main() {
	ctx, cancel := context.WithTimeout(
		context.Background(),
		defaultTimeout,
	)
	defer cancel()

	results := make(chan *User, 3)

	var wg sync.WaitGroup

	for id := 1; id <= 3; id++ {
		wg.Add(1)

		go worker(
			ctx,
			id,
			results,
			&wg,
		)
	}

	wg.Wait()
	close(results)

	for user := range results {
		fmt.Println(formatUser(user))
	}

	fmt.Println("API:", apiURL)
}

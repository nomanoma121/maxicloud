package domain

import "errors"

type ValidationError struct {
	Message string
}

func (e ValidationError) Error() string {
	return e.Message
}

func IsValidationError(err error) bool {
	var ve ValidationError
	return errors.As(err, &ve)
}

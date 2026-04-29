package handler

import (
	"connectrpc.com/connect"
	"github.com/saitamau-maximum/maxicloud/internal/domain"
)

func toConnectError(err error) error {
	if domain.IsValidationError(err) {
		return connect.NewError(connect.CodeInvalidArgument, err)
	}
	return connect.NewError(connect.CodeInternal, err)
}

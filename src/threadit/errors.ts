import { createError } from "apollo-errors";

export enum errors {
    USER_ALREADY_EXISTS = "USER_ALREADY_EXISTS",
    USER_NOT_FOUND = "USER_NOT_FOUND",
    INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
    GENERAL_ERROR = "GENERAL_ERROR",
    INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
}

export const UnknownError = createError("UnknownError", {
    message: "An unknown error has occurred!  Please try again later"
});

export const ForbiddenError = createError("ForbiddenError", {
    message: 'You are not allowed to do this!'
});

export const AuthenticationRequiredError = createError('AuthenticationRequiredError', {
    message: 'You must be logged in to do this!'
});

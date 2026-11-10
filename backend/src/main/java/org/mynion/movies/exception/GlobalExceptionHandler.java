
package org.mynion.movies.exception;

import jakarta.validation.ConstraintViolationException;
import org.mynion.movies.dto.ApiErrorDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorDto> handleValidation(
            MethodArgumentNotValidException ex
    ) {
        String message = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .findFirst()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .orElse("Nieprawidłowe dane żądania.");

        return buildError(HttpStatus.BAD_REQUEST, message);
    }

    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<ApiErrorDto> handleUserAlreadyExists(
            UserAlreadyExistsException ex
    ) {
        return buildError(HttpStatus.CONFLICT, ex.getMessage());
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ApiErrorDto> handleAuthentication(
            AuthenticationException ex
    ) {
        return buildError(
                HttpStatus.UNAUTHORIZED,
                "Nieprawidłowa nazwa użytkownika lub hasło."
        );
    }

    @ExceptionHandler(HttpClientErrorException.NotFound.class)
    public ResponseEntity<ApiErrorDto> handleNotFound(
            HttpClientErrorException.NotFound ex
    ) {
        return buildError(
                HttpStatus.NOT_FOUND,
                "Nie znaleziono wskazanej produkcji, sezonu lub odcinka."
        );
    }

    @ExceptionHandler(RestClientException.class)
    public ResponseEntity<ApiErrorDto> handleTmdbError(
            RestClientException ex
    ) {
        return buildError(
                HttpStatus.BAD_GATEWAY,
                "Nie udało się pobrać danych z TMDB."
        );
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiErrorDto> handleConstraintViolation(
            ConstraintViolationException ex
    ) {
        String message = ex.getConstraintViolations()
                .stream()
                .map(violation ->
                        violation.getPropertyPath() + ": "
                                + violation.getMessage())
                .findFirst()
                .orElse("Nieprawidłowe parametry żądania.");

        return buildError(HttpStatus.BAD_REQUEST, message);
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ApiErrorDto> handleTypeMismatch(
            MethodArgumentTypeMismatchException ex
    ) {
        return buildError(
                HttpStatus.BAD_REQUEST,
                "Nieprawidłowa wartość parametru: " + ex.getName()
        );
    }

    @ExceptionHandler(RatingAlreadyExistsException.class)
    public ResponseEntity<ApiErrorDto> handleRatingAlreadyExists(
            RatingAlreadyExistsException ex
    ) {
        return buildError(HttpStatus.CONFLICT, ex.getMessage());
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiErrorDto> handleIllegalArgument(
            IllegalArgumentException ex
    ) {
        return buildError(
                HttpStatus.BAD_REQUEST,
                ex.getMessage()
        );
    }

    private ResponseEntity<ApiErrorDto> buildError(
            HttpStatus status,
            String message
    ) {
        return ResponseEntity.status(status)
                .body(new ApiErrorDto(status.value(), message));
    }

    @ExceptionHandler(RatingNotFoundException.class)
    public ResponseEntity<ApiErrorDto> handleRatingNotFound(
            RatingNotFoundException ex
    ) {
        return buildError(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    @ExceptionHandler(RatingAccessDeniedException.class)
    public ResponseEntity<ApiErrorDto> handleRatingAccessDenied(
            RatingAccessDeniedException ex
    ) {
        return buildError(HttpStatus.FORBIDDEN, ex.getMessage());
    }
}

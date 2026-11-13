
package org.mynion.movies.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Positive;
import org.mynion.movies.dto.review.CreateReviewRequestDto;
import org.mynion.movies.dto.review.ReviewResponseDto;
import org.mynion.movies.dto.review.UpdateReviewRequestDto;
import org.mynion.movies.entity.User;
import org.mynion.movies.enums.MediaType;
import org.mynion.movies.exception.UserNotFoundException;
import org.mynion.movies.repository.UserRepo;
import org.mynion.movies.service.ReviewService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@Validated
public class ReviewController {

    private final ReviewService reviewService;
    private final UserRepo userRepo;

    public ReviewController(
            ReviewService reviewService,
            UserRepo userRepo
    ) {
        this.reviewService = reviewService;
        this.userRepo = userRepo;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ReviewResponseDto createReview(
            @Valid @RequestBody CreateReviewRequestDto request,
            Authentication authentication
    ) {
        return reviewService.createReview(
                request,
                getCurrentUserId(authentication)
        );
    }

    @GetMapping("/me")
    public List<ReviewResponseDto> getMyReviews(
            Authentication authentication
    ) {
        return reviewService.getUserReviews(
                getCurrentUserId(authentication)
        );
    }

    @GetMapping("/media")
    public List<ReviewResponseDto> getMediaReviews(
            @RequestParam MediaType mediaType,
            @RequestParam @Positive Long tmdbId,
            @RequestParam(required = false) @Min(0) Integer seasonNumber,
            @RequestParam(required = false) @Min(1) Integer episodeNumber
    ) {
        return reviewService.getMediaReviews(
                mediaType,
                tmdbId,
                seasonNumber,
                episodeNumber
        );
    }

    @GetMapping("/{id}")
    public ReviewResponseDto getReview(
            @PathVariable @Positive Long id,
            Authentication authentication
    ) {
        Long userId = authentication != null
                && authentication.isAuthenticated()
                && !(authentication.getPrincipal() instanceof String
                && authentication.getPrincipal().equals("anonymousUser"))
                ? getCurrentUserId(authentication)
                : null;

        return reviewService.getReview(id, userId);
    }

    @PutMapping("/{id}")
    public ReviewResponseDto updateReview(
            @PathVariable @Positive Long id,
            @Valid @RequestBody UpdateReviewRequestDto request,
            Authentication authentication
    ) {
        return reviewService.updateReview(
                id,
                request,
                getCurrentUserId(authentication)
        );
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteReview(
            @PathVariable @Positive Long id,
            Authentication authentication
    ) {
        reviewService.deleteReview(
                id,
                getCurrentUserId(authentication)
        );
    }

    private Long getCurrentUserId(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new org.springframework.security.access.AccessDeniedException(
                    "Wymagane jest zalogowanie."
            );
        }

        User user = userRepo.findByUsername(authentication.getName())
                .orElseThrow(UserNotFoundException::new);

        return user.getId();
    }
}

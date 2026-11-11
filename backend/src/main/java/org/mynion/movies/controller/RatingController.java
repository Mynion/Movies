
package org.mynion.movies.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import org.mynion.movies.dto.rating.CreateRatingRequestDto;
import org.mynion.movies.dto.rating.RatingResponseDto;
import org.mynion.movies.dto.rating.UpdateRatingRequestDto;
import org.mynion.movies.entity.User;
import org.mynion.movies.repository.UserRepo;
import org.mynion.movies.service.RatingService;
import org.mynion.movies.enums.MediaType;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ratings")
public class RatingController {

    private final RatingService ratingService;
    private final UserRepo userRepo;

    public RatingController(RatingService ratingService, UserRepo userRepo) {
        this.ratingService = ratingService;
        this.userRepo = userRepo;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public RatingResponseDto createRating(
            @Valid @RequestBody CreateRatingRequestDto request,
            Authentication authentication
    ) {
        User user = userRepo.findByUsername(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Nie znaleziono użytkownika."
                ));

        return ratingService.createRating(request, user.getId());
    }


    @GetMapping("/me")
    public List<RatingResponseDto> getMyRatings(
            Authentication authentication
    ) {
        User user = userRepo.findByUsername(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Nie znaleziono użytkownika."
                ));

        return ratingService.getUserRatings(user.getId());
    }

    @GetMapping("/media")
    public List<RatingResponseDto> getMediaRatings(
            @RequestParam @Positive Long tmdbId,
            @RequestParam MediaType mediaType
    ) {
        return ratingService.getMediaRatings(mediaType, tmdbId);
    }

    @GetMapping("/{id}")
    public RatingResponseDto getRating(
            @PathVariable @Positive Long id
    ) {
        return ratingService.getRating(id);
    }


    @PutMapping("/{id}")
    public RatingResponseDto updateRating(
            @PathVariable @Positive Long id,
            @Valid @RequestBody UpdateRatingRequestDto request,
            Authentication authentication
    ) {
        User user = userRepo.findByUsername(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Nie znaleziono użytkownika."
                ));

        return ratingService.updateRating(id, request, user.getId());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteRating(
            @PathVariable @Positive Long id,
            Authentication authentication
    ) {
        User user = userRepo.findByUsername(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Nie znaleziono użytkownika."
                ));

        ratingService.deleteRating(id, user.getId());
    }

}

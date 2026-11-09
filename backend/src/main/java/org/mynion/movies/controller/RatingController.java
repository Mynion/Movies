
package org.mynion.movies.controller;

import jakarta.validation.Valid;
import org.mynion.movies.dto.rating.CreateRatingRequestDto;
import org.mynion.movies.model.Rating;
import org.mynion.movies.model.User;
import org.mynion.movies.repository.UserRepo;
import org.mynion.movies.service.RatingService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

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
    public void createRating(
            @Valid @RequestBody CreateRatingRequestDto request,
            Authentication authentication
    ) {
        User user = userRepo.findByUsername(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException(
                        "User not found"
                ));

        ratingService.createRating(request, user.getId());
    }
}

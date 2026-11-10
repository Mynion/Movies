
package org.mynion.movies.service;

import org.mynion.movies.dto.rating.CreateRatingRequestDto;
import org.mynion.movies.dto.rating.CreateRatingScoreDto;
import org.mynion.movies.exception.RatingAlreadyExistsException;
import org.mynion.movies.model.MediaItem;
import org.mynion.movies.model.Rating;
import org.mynion.movies.model.RatingScore;
import org.mynion.movies.model.User;
import org.mynion.movies.repository.RatingRepository;
import org.mynion.movies.repository.UserRepo;
import org.mynion.movies.util.MediaType;
import org.mynion.movies.util.ScoreType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RatingService {

    private final RatingRepository ratingRepository;
    private final UserRepo userRepo;
    private final MediaItemService mediaItemService;

    public RatingService(
            RatingRepository ratingRepository,
            UserRepo userRepo,
            MediaItemService mediaItemService
    ) {
        this.ratingRepository = ratingRepository;
        this.userRepo = userRepo;
        this.mediaItemService = mediaItemService;
    }

    @Transactional
    public Rating createRating(CreateRatingRequestDto request, Long userId) {
        if (request.mediaType() != MediaType.MOVIE
                && request.mediaType() != MediaType.TV_SERIES) {
            throw new IllegalArgumentException(
                    "Rating this media type is not supported yet"
            );
        }

        User user = userRepo.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "User not found"
                ));

        MediaItem mediaItem = mediaItemService.findOrCreate(
                request.mediaType(),
                request.tmdbId()
        );

        if (ratingRepository.existsByUserIdAndMediaItemId(
                userId, mediaItem.getId()
        )) {
            throw new RatingAlreadyExistsException();
        }

        Rating rating = new Rating();
        rating.setUser(user);
        rating.setMediaItem(mediaItem);
        rating.setValue(request.value());

        if (request.scores() != null) {
            for (CreateRatingScoreDto scoreDto : request.scores()) {
                validateScore(scoreDto);

                RatingScore ratingScore = new RatingScore();
                ratingScore.setScoreType(scoreDto.scoreType());
                ratingScore.setScore(scoreDto.score());
                ratingScore.setToAverage(scoreDto.toAverage());
                ratingScore.setCustomName(scoreDto.customName());

                rating.addScore(ratingScore);
            }
        }

        return ratingRepository.save(rating);
    }

    private void validateScore(CreateRatingScoreDto scoreDto) {
        if (scoreDto.scoreType() == ScoreType.CUSTOM_SCORE) {
            if (scoreDto.customName() == null
                    || scoreDto.customName().isBlank()) {
                throw new IllegalArgumentException(
                        "Custom score must have a name"
                );
            }
        } else if (scoreDto.customName() != null) {
            throw new IllegalArgumentException(
                    "Only custom scores can have a custom name"
            );
        }
    }
}

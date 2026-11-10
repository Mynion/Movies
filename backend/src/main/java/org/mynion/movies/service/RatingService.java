
package org.mynion.movies.service;

import org.mynion.movies.dto.rating.CreateRatingRequestDto;
import org.mynion.movies.dto.rating.CreateRatingScoreDto;
import org.mynion.movies.dto.rating.RatingResponseDto;
import org.mynion.movies.entity.MediaItem;
import org.mynion.movies.entity.Rating;
import org.mynion.movies.entity.RatingScore;
import org.mynion.movies.entity.User;
import org.mynion.movies.repository.MediaItemRepository;
import org.mynion.movies.enums.MediaType;
import org.mynion.movies.enums.ScoreType;
import org.mynion.movies.exception.RatingAlreadyExistsException;
import org.mynion.movies.mapper.RatingMapper;
import org.mynion.movies.repository.RatingRepository;
import org.mynion.movies.repository.UserRepo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.mynion.movies.exception.RatingNotFoundException;

import java.util.List;

@Service
public class RatingService {

    private final RatingRepository ratingRepository;
    private final UserRepo userRepo;
    private final MediaItemService mediaItemService;
    private final RatingMapper ratingMapper;
    private final MediaItemRepository mediaItemRepository;

    public RatingService(
            RatingRepository ratingRepository,
            UserRepo userRepo,
            MediaItemService mediaItemService,
            RatingMapper ratingMapper,
            MediaItemRepository mediaItemRepository
    ) {
        this.ratingRepository = ratingRepository;
        this.userRepo = userRepo;
        this.mediaItemService = mediaItemService;
        this.ratingMapper = ratingMapper;
        this.mediaItemRepository = mediaItemRepository;
    }

    @Transactional
    public RatingResponseDto createRating(
            CreateRatingRequestDto request,
            Long userId
    ) {
        if (request.mediaType() != MediaType.MOVIE
                && request.mediaType() != MediaType.TV_SERIES) {
            throw new IllegalArgumentException(
                    "Ten typ produkcji nie jest jeszcze obsługiwany."
            );
        }

        User user = userRepo.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Nie znaleziono użytkownika."
                ));

        MediaItem mediaItem = mediaItemService.findOrCreate(
                request.mediaType(),
                request.tmdbId()
        );

        if (ratingRepository.existsByUserIdAndMediaItemId(
                userId,
                mediaItem.getId()
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

                RatingScore score = new RatingScore();
                score.setScoreType(scoreDto.scoreType());
                score.setScore(scoreDto.score());
                score.setToAverage(scoreDto.toAverage());
                score.setCustomName(scoreDto.customName());

                rating.addScore(score);
            }
        }

        Rating savedRating = ratingRepository.saveAndFlush(rating);

        return ratingMapper.toDto(savedRating);
    }

    private void validateScore(CreateRatingScoreDto dto) {
        if (dto.scoreType() == ScoreType.CUSTOM_SCORE) {
            if (dto.customName() == null
                    || dto.customName().isBlank()) {
                throw new IllegalArgumentException(
                        "Własne kryterium oceny musi mieć nazwę."
                );
            }
        } else if (dto.customName() != null) {
            throw new IllegalArgumentException(
                    "Nazwa własna jest dozwolona tylko dla kryteriów niestandardowych."
            );
        }
    }


    @Transactional(readOnly = true)
    public List<RatingResponseDto> getUserRatings(Long userId) {
        return ratingRepository.findByUserId(userId)
                .stream()
                .map(ratingMapper::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<RatingResponseDto> getMediaRatings(
            MediaType mediaType,
            Long tmdbId
    ) {
        return mediaItemRepository
                .findByMediaTypeAndTmdbId(mediaType, tmdbId)
                .map(mediaItem -> ratingRepository
                        .findByMediaItemId(mediaItem.getId())
                        .stream()
                        .map(ratingMapper::toDto)
                        .toList())
                .orElse(List.of());
    }

    @Transactional(readOnly = true)
    public RatingResponseDto getRating(Long id) {
        Rating rating = ratingRepository.findById(id)
                .orElseThrow(RatingNotFoundException::new);

        return ratingMapper.toDto(rating);
    }
}

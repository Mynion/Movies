
package org.mynion.movies.service;

import org.mynion.movies.dto.rating.*;
import org.mynion.movies.entity.MediaItem;
import org.mynion.movies.entity.Rating;
import org.mynion.movies.entity.RatingScore;
import org.mynion.movies.entity.User;
import org.mynion.movies.exception.RatingAccessDeniedException;
import org.mynion.movies.repository.MediaItemRepository;
import org.mynion.movies.enums.MediaType;
import org.mynion.movies.enums.ScoreType;
import org.mynion.movies.exception.RatingAlreadyExistsException;
import org.mynion.movies.mapper.RatingMapper;
import org.mynion.movies.repository.RatingRepository;
import org.mynion.movies.repository.UserRepo;
import org.mynion.movies.repository.projection.RatingStatsProjection;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.mynion.movies.exception.RatingNotFoundException;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Optional;

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
        validateMediaType(request);

        User user = userRepo.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Nie znaleziono użytkownika."
                ));

        MediaItem mediaItem = mediaItemService.findOrCreate(
                request.mediaType(),
                request.tmdbId(),
                request.seasonNumber(),
                request.episodeNumber()
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


    private void validateMediaType(CreateRatingRequestDto request) {
        switch (request.mediaType()) {
            case MOVIE, TV_SERIES -> {
                if (request.seasonNumber() != null
                        || request.episodeNumber() != null) {
                    throw new IllegalArgumentException(
                            "Film lub serial nie może mieć numeru sezonu ani odcinka."
                    );
                }
            }
            case SEASON -> {
                if (request.seasonNumber() == null
                        || request.episodeNumber() != null) {
                    throw new IllegalArgumentException(
                            "Ocena sezonu wymaga numeru sezonu i nie może zawierać numeru odcinka."
                    );
                }
            }
            case EPISODE -> {
                if (request.seasonNumber() == null
                        || request.episodeNumber() == null) {
                    throw new IllegalArgumentException(
                            "Ocena odcinka wymaga numeru sezonu i odcinka."
                    );
                }
            }
        }
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
            Long tmdbId,
            Integer seasonNumber,
            Integer episodeNumber
    ) {
        return findMediaItem(mediaType, tmdbId, seasonNumber, episodeNumber)
                .map(item -> ratingRepository
                        .findByMediaItemId(item.getId())
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


    @Transactional
    public RatingResponseDto updateRating(
            Long ratingId,
            UpdateRatingRequestDto request,
            Long userId
    ) {
        Rating rating = ratingRepository.findById(ratingId)
                .orElseThrow(RatingNotFoundException::new);

        if (!rating.getUser().getId().equals(userId)) {
            throw new RatingAccessDeniedException();
        }

        rating.setValue(request.value());

        rating.getScores().clear();

        for (CreateRatingScoreDto scoreDto : request.scores()) {
            validateScore(scoreDto);

            RatingScore score = new RatingScore();
            score.setScoreType(scoreDto.scoreType());
            score.setScore(scoreDto.score());
            score.setToAverage(scoreDto.toAverage());
            score.setCustomName(scoreDto.customName());

            rating.addScore(score);
        }

        ratingRepository.flush();

        return ratingMapper.toDto(rating);
    }

    @Transactional
    public void deleteRating(Long ratingId, Long userId) {
        Rating rating = ratingRepository.findById(ratingId)
                .orElseThrow(RatingNotFoundException::new);

        if (!rating.getUser().getId().equals(userId)) {
            throw new RatingAccessDeniedException();
        }

        ratingRepository.delete(rating);
    }

    private Optional<MediaItem> findMediaItem(
            MediaType mediaType,
            Long tmdbId,
            Integer seasonNumber,
            Integer episodeNumber
    ) {
        return switch (mediaType) {
            case MOVIE, TV_SERIES -> {
                if (seasonNumber != null || episodeNumber != null) {
                    throw new IllegalArgumentException(
                            "Film lub serial nie może mieć numeru sezonu ani odcinka."
                    );
                }

                yield mediaItemRepository.findByMediaTypeAndTmdbId(
                        mediaType, tmdbId
                );
            }

            case SEASON -> {
                if (seasonNumber == null || episodeNumber != null) {
                    throw new IllegalArgumentException(
                            "Podaj numer sezonu bez numeru odcinka."
                    );
                }

                yield mediaItemRepository
                        .findByMediaTypeAndTmdbId(MediaType.TV_SERIES, tmdbId)
                        .flatMap(series -> mediaItemRepository
                                .findByParentIdAndSeasonNumber(
                                        series.getId(), seasonNumber
                                ));
            }

            case EPISODE -> {
                if (seasonNumber == null || episodeNumber == null) {
                    throw new IllegalArgumentException(
                            "Podaj numer sezonu i odcinka."
                    );
                }

                yield mediaItemRepository
                        .findByMediaTypeAndTmdbId(MediaType.TV_SERIES, tmdbId)
                        .flatMap(series -> mediaItemRepository
                                .findByParentIdAndSeasonNumber(
                                        series.getId(), seasonNumber
                                ))
                        .flatMap(season -> mediaItemRepository
                                .findByParentIdAndEpisodeNumber(
                                        season.getId(), episodeNumber
                                ));
            }
        };
    }


    @Transactional(readOnly = true)
    public RatingStatsDto getMediaRatingStats(
            MediaType mediaType,
            Long tmdbId,
            Integer seasonNumber,
            Integer episodeNumber
    ) {
        Optional<MediaItem> mediaItem = findMediaItem(
                mediaType, tmdbId, seasonNumber, episodeNumber
        );

        if (mediaItem.isEmpty()) {
            return new RatingStatsDto(null, 0);
        }

        RatingStatsProjection stats = ratingRepository.getRatingStats(
                mediaItem.get().getId()
        );

        BigDecimal averageRating = stats.getAverageRating() == null
                ? null
                : BigDecimal.valueOf(stats.getAverageRating())
                .setScale(2, RoundingMode.HALF_UP);

        return new RatingStatsDto(
                averageRating,
                stats.getRatingsCount()
        );
    }

}

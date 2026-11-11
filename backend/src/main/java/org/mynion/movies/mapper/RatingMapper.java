
package org.mynion.movies.mapper;

import org.mynion.movies.dto.rating.RatingResponseDto;
import org.mynion.movies.dto.rating.RatingScoreResponseDto;
import org.mynion.movies.entity.MediaItem;
import org.mynion.movies.entity.Rating;
import org.mynion.movies.entity.RatingScore;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Component
public class RatingMapper {

    public RatingResponseDto toDto(Rating rating) {
        MediaItem mediaItem = rating.getMediaItem();

        List<RatingScoreResponseDto> scores = rating.getScores()
                .stream()
                .map(this::toScoreDto)
                .toList();

        return new RatingResponseDto(
                rating.getId(),
                mediaItem.getId(),
                getTmdbId(mediaItem),
                mediaItem.getMediaType(),
                mediaItem.getSeasonNumber(),
                mediaItem.getEpisodeNumber(),
                rating.getValue(),
                calculateSuggestedAverage(rating.getScores()),
                rating.getCreatedAt(),
                scores
        );
    }

    private RatingScoreResponseDto toScoreDto(RatingScore score) {
        return new RatingScoreResponseDto(
                score.getId(),
                score.getScoreType(),
                score.getScore(),
                score.isToAverage(),
                score.getCustomName()
        );
    }

    private Long getTmdbId(MediaItem mediaItem) {
        return switch (mediaItem.getMediaType()) {
            case MOVIE, TV_SERIES ->
                    mediaItem.getTmdbId();

            case SEASON ->
                    mediaItem.getParent().getTmdbId();

            case EPISODE ->
                    mediaItem.getParent().getParent().getTmdbId();
        };
    }

    private BigDecimal calculateSuggestedAverage(
            List<RatingScore> scores
    ) {
        List<BigDecimal> includedScores = scores.stream()
                .filter(RatingScore::isToAverage)
                .map(RatingScore::getScore)
                .toList();

        if (includedScores.isEmpty()) {
            return null;
        }

        BigDecimal sum = includedScores.stream()
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return sum.divide(
                BigDecimal.valueOf(includedScores.size()),
                2,
                RoundingMode.HALF_UP
        );
    }
}

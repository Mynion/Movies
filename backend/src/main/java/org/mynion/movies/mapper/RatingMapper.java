
package org.mynion.movies.mapper;

import org.mynion.movies.dto.rating.RatingResponseDto;
import org.mynion.movies.dto.rating.RatingScoreResponseDto;
import org.mynion.movies.entity.Rating;
import org.mynion.movies.entity.RatingScore;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Component
public class RatingMapper {

    public RatingResponseDto toDto(Rating rating) {
        List<RatingScoreResponseDto> scores = rating.getScores()
                .stream()
                .map(this::toScoreDto)
                .toList();

        return new RatingResponseDto(
                rating.getId(),
                rating.getMediaItem().getId(),
                rating.getMediaItem().getTmdbId(),
                rating.getMediaItem().getMediaType(),
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

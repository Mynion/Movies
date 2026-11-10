
package org.mynion.movies.dto.rating;

import org.mynion.movies.util.MediaType;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record RatingResponseDto(
        Long id,
        Long mediaItemId,
        Long tmdbId,
        MediaType mediaType,
        BigDecimal value,
        BigDecimal suggestedAverage,
        Instant createdAt,
        List<RatingScoreResponseDto> scores
) {
}

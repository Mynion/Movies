
package org.mynion.movies.dto.rating;

import org.mynion.movies.util.ScoreType;

import java.math.BigDecimal;

public record RatingScoreResponseDto(
        Long id,
        ScoreType scoreType,
        BigDecimal score,
        boolean toAverage,
        String customName
) {
}

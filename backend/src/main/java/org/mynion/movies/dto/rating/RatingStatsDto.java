package org.mynion.movies.dto.rating;

import java.math.BigDecimal;

public record RatingStatsDto(
        BigDecimal averageRating,
        long ratingsCount
) {
}
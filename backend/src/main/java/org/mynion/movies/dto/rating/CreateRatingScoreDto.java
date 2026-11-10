
package org.mynion.movies.dto.rating;

import jakarta.validation.constraints.*;
import org.mynion.movies.enums.ScoreType;

import java.math.BigDecimal;

public record CreateRatingScoreDto(
        @NotNull
        ScoreType scoreType,

        @NotNull
        @DecimalMin("1.0")
        @DecimalMax("10.0")
        @Digits(integer = 2, fraction = 1)
        BigDecimal score,

        boolean toAverage,

        @Size(max = 100)
        String customName
) {}

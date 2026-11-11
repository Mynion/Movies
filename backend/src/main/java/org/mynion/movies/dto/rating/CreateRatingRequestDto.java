
package org.mynion.movies.dto.rating;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.mynion.movies.enums.MediaType;

import java.math.BigDecimal;
import java.util.List;

public record CreateRatingRequestDto(
        @NotNull
        @Positive
        Long tmdbId,

        @NotNull
        MediaType mediaType,

        @Min(0)
        Integer seasonNumber,

        @Min(1)
        Integer episodeNumber,

        @NotNull
        @DecimalMin("1.0")
        @DecimalMax("10.0")
        @Digits(integer = 2, fraction = 1)
        BigDecimal value,

        @Size(max = 10)
        List<@NotNull @Valid CreateRatingScoreDto> scores
) {
}

package org.mynion.movies.dto.rating;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.util.List;

public record UpdateRatingRequestDto(
        @NotNull
        @DecimalMin("1.0")
        @DecimalMax("10.0")
        @Digits(integer = 2, fraction = 1)
        BigDecimal value,

        @NotNull
        @Size(max = 10)
        List<@NotNull @Valid CreateRatingScoreDto> scores
) {
}
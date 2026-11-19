package org.mynion.movies.dto.review;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.mynion.movies.enums.Visibility;

public record UpdateReviewRequestDto(

        @Size(max = 200)
        String title,

        @NotBlank
        String content,

        @NotNull
        Visibility visibility
) {
}

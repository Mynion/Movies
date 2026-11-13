
package org.mynion.movies.dto.review;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import org.mynion.movies.enums.MediaType;
import org.mynion.movies.enums.ReviewVisibility;

public record CreateReviewRequestDto(

        @NotNull
        @Positive
        Long tmdbId,

        @NotNull
        MediaType mediaType,

        @Min(0)
        Integer seasonNumber,

        @Min(1)
        Integer episodeNumber,

        @Size(max = 200)
        String title,

        @NotBlank
        String content,

        @NotNull
        ReviewVisibility visibility
) {
}

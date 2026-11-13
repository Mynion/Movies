
package org.mynion.movies.dto.review;

import org.mynion.movies.enums.MediaType;
import org.mynion.movies.enums.ReviewVisibility;

import java.time.Instant;

public record ReviewResponseDto(

        Long id,

        Long userId,

        String username,

        Long mediaItemId,

        Long tmdbId,

        MediaType mediaType,

        Integer seasonNumber,

        Integer episodeNumber,

        String title,

        String content,

        ReviewVisibility visibility,

        Instant createdAt
) {
}

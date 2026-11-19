
package org.mynion.movies.dto.watchhistory;

import org.mynion.movies.dto.media.MediaItemReferenceDto;

import java.time.Instant;
import java.util.List;

public record WatchHistoryResponseDto(
        Long id,
        Long userId,
        Instant watchedAt,
        Integer progress,
        List<MediaItemReferenceDto> mediaItems
) {
}

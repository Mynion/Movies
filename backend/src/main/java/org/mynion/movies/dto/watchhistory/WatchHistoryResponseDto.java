
package org.mynion.movies.dto.watchhistory;

import java.time.Instant;
import java.util.List;

public record WatchHistoryResponseDto(
        Long id,
        Long userId,
        Instant watchedAt,
        Integer progress,
        List<WatchHistoryMediaItemDto> mediaItems
) {
}

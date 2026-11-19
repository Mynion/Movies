
package org.mynion.movies.mapper;

import org.mynion.movies.dto.media.MediaItemReferenceDto;
import org.mynion.movies.dto.watchhistory.WatchHistoryResponseDto;
import org.mynion.movies.entity.MediaItem;
import org.mynion.movies.entity.WatchHistory;
import org.springframework.stereotype.Component;

@Component
public class WatchHistoryMapper {

    public WatchHistoryResponseDto toDto(WatchHistory history) {
        return new WatchHistoryResponseDto(
                history.getId(),
                history.getUser().getId(),
                history.getWatchedAt(),
                history.getProgress(),
                history.getMediaItems()
                        .stream()
                        .map(this::toMediaItemDto)
                        .toList()
        );
    }

    private MediaItemReferenceDto toMediaItemDto(MediaItem mediaItem) {
        return new MediaItemReferenceDto(
                getTmdbId(mediaItem),
                mediaItem.getMediaType(),
                mediaItem.getSeasonNumber(),
                mediaItem.getEpisodeNumber()
        );
    }

    private Long getTmdbId(MediaItem mediaItem) {
        return switch (mediaItem.getMediaType()) {
            case MOVIE, TV_SERIES -> mediaItem.getTmdbId();
            case SEASON -> mediaItem.getParent().getTmdbId();
            case EPISODE -> mediaItem.getParent().getParent().getTmdbId();
        };
    }
}

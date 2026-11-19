
package org.mynion.movies.mapper;

import org.mynion.movies.dto.list.MediaListResponseDto;
import org.mynion.movies.dto.media.MediaItemReferenceDto;
import org.mynion.movies.entity.MediaItem;
import org.mynion.movies.entity.MediaList;
import org.springframework.stereotype.Component;

@Component
public class MediaListMapper {

    public MediaListResponseDto toDto(MediaList list) {
        return new MediaListResponseDto(
                list.getId(),
                list.getUser().getId(),
                list.getName(),
                list.getDescription(),
                list.getVisibility(),
                list.getCreatedAt(),
                list.getMediaItems()
                        .stream()
                        .map(this::toMediaItemDto)
                        .toList()
        );
    }

    private MediaItemReferenceDto toMediaItemDto(MediaItem item) {
        return new MediaItemReferenceDto(
                getTmdbId(item),
                item.getMediaType(),
                item.getSeasonNumber(),
                item.getEpisodeNumber()
        );
    }

    private Long getTmdbId(MediaItem item) {
        return switch (item.getMediaType()) {
            case MOVIE, TV_SERIES -> item.getTmdbId();
            case SEASON -> item.getParent().getTmdbId();
            case EPISODE -> item.getParent().getParent().getTmdbId();
        };
    }
}

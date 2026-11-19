package org.mynion.movies.dto.list;

import org.mynion.movies.dto.media.MediaItemReferenceDto;
import org.mynion.movies.enums.Visibility;

import java.time.Instant;
import java.util.List;

public record MediaListResponseDto(
        Long id,
        Long userId,
        String name,
        String description,
        Visibility visibility,
        Instant createdAt,
        List<MediaItemReferenceDto> mediaItems
) {}

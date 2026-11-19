package org.mynion.movies.dto.watchhistory;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import org.mynion.movies.dto.media.MediaItemReferenceDto;

import java.time.Instant;
import java.util.List;

public record UpdateWatchHistoryRequestDto(
        @NotNull
        Instant watchedAt,

        @Min(0)
        @Max(100)
        Integer progress,

        @NotEmpty
        List<@Valid MediaItemReferenceDto> mediaItems
) {
}

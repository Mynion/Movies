package org.mynion.movies.dto.media;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import org.mynion.movies.enums.MediaType;

public record MediaItemReferenceDto(
        @NotNull @Positive Long tmdbId,
        @NotNull MediaType mediaType,
        @Min(0) Integer seasonNumber,
        @Min(1) Integer episodeNumber
) {}

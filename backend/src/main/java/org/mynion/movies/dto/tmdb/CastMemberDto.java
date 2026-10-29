package org.mynion.movies.dto.tmdb;

import com.fasterxml.jackson.annotation.JsonProperty;

public record CastMemberDto(
        Long id,

        String name,

        @JsonProperty("character")
        String character,

        @JsonProperty("profile_path")
        String profilePath,

        @JsonProperty("order")
        Integer order
) {}
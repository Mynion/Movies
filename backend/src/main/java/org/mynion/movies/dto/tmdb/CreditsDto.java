package org.mynion.movies.dto.tmdb;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public record CreditsDto(
        List<CastMemberDto> cast
) {}
package org.mynion.movies.dto.tmdb;

import java.util.List;

public record CreditsDto(
        List<CastMemberDto> cast
) {}
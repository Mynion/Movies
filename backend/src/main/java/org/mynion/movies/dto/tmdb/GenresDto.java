package org.mynion.movies.dto.tmdb;

import java.util.List;

public record GenresDto(
        List<GenreDto> genres
) {}

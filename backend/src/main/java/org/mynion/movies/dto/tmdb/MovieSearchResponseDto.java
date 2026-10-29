package org.mynion.movies.dto.tmdb;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.mynion.movies.dto.tmdb.MovieDto;

import java.util.List;

public record MovieSearchResponseDto(
        int page,
        List<MovieDto> results,

        @JsonProperty("total_pages")
        int totalPages,

        @JsonProperty("total_results")
        int totalResults
) {}

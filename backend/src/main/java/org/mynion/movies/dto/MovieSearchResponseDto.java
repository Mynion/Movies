package org.mynion.movies.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public record MovieSearchResponseDto(
        int page,
        List<MovieDto> results,

        @JsonProperty("total_pages")
        int totalPages,

        @JsonProperty("total_results")
        int totalResults
) {}

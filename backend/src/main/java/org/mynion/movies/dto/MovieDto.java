package org.mynion.movies.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public record MovieDto(
        Long id,
        String title,
        String overview,

        @JsonProperty("poster_path")
        String posterPath,

        @JsonProperty("release_date")
        String releaseDate,

        @JsonProperty("genre_ids")
        List<Integer> genreIds
) {}

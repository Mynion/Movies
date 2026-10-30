package org.mynion.movies.dto.tmdb;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public record SeriesDto(
        Long id,
        String name,
        String overview,

        @JsonProperty("poster_path")
        String posterPath,

        @JsonProperty("first_air_date")
        String firstAirDate,

        @JsonProperty("genre_ids")
        List<Integer> genreIds
) {}
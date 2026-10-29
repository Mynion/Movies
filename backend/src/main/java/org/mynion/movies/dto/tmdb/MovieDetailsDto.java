package org.mynion.movies.dto.tmdb;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public record MovieDetailsDto(
        Long id,
        String title,
        String overview,

        @JsonProperty("poster_path")
        String posterPath,

        @JsonProperty("backdrop_path")
        String backdropPath,

        @JsonProperty("release_date")
        String releaseDate,

        List<GenreDto> genres,
        Integer runtime,

        @JsonProperty("vote_average")
        Double voteAverage,

        CreditsDto credits
) {}
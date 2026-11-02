package org.mynion.movies.dto.tmdb;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public record SeriesDetailsDto(
        Long id,
        String name,
        String overview,

        @JsonProperty("poster_path")
        String posterPath,

        @JsonProperty("backdrop_path")
        String backdropPath,

        @JsonProperty("first_air_date")
        String firstAirDate,

        List<GenreDto> genres,

        @JsonProperty("number_of_seasons")
        Integer numberOfSeasons,

        @JsonProperty("number_of_episodes")
        Integer numberOfEpisodes,

        @JsonProperty("vote_average")
        Double voteAverage,

        CreditsDto credits
) {}

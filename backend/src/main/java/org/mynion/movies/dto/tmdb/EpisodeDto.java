package org.mynion.movies.dto.tmdb;

import com.fasterxml.jackson.annotation.JsonProperty;

public record EpisodeDto(
        Long id,
        String name,
        String overview,

        @JsonProperty("air_date")
        String airDate,

        @JsonProperty("episode_number")
        Integer episodeNumber,

        @JsonProperty("season_number")
        Integer seasonNumber,

        Integer runtime,

        @JsonProperty("still_path")
        String stillPath,

        @JsonProperty("vote_average")
        Double voteAverage
) {}
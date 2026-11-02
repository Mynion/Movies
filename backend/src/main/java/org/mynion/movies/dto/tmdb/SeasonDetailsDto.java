package org.mynion.movies.dto.tmdb;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public record SeasonDetailsDto(
        Long id,
        String name,
        String overview,

        @JsonProperty("season_number")
        Integer seasonNumber,

        @JsonProperty("air_date")
        String airDate,

        @JsonProperty("poster_path")
        String posterPath,

        List<EpisodeDto> episodes
) {}
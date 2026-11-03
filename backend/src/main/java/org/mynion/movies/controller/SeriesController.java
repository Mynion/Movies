package org.mynion.movies.controller;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import org.mynion.movies.dto.tmdb.*;
import org.mynion.movies.service.TmdbService;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@Validated
@RestController
@RequestMapping("api/series")
public class SeriesController {
    private final TmdbService tmdbService;

    public SeriesController(TmdbService tmdbService) {
        this.tmdbService = tmdbService;
    }

    @GetMapping("/{id}")
    public SeriesDetailsDto getSeriesDetails(@PathVariable @Positive Long id) {
        return tmdbService.getSeriesDetails(id);
    }

    @GetMapping("/search")
    public SeriesSearchResponseDto searchSeries(@RequestParam @NotBlank String query) {
        return tmdbService.searchSeries(query);
    }

    @GetMapping()
    public SeriesSearchResponseDto getSeries(@RequestParam(defaultValue = "1") @Min(1) int page,
                                             @RequestParam(required = false) @Positive Integer genreId) {
        return tmdbService.getSeries(page, genreId);
    }

    @GetMapping("/{id}/seasons/{seasonNumber}")
    public SeasonDetailsDto getSeasonDetails(
            @PathVariable @Positive Long id,
            @PathVariable @Min(0) Integer seasonNumber
    ) {
        return tmdbService.getSeasonDetails(id, seasonNumber);
    }

    @GetMapping("/{id}/seasons/{seasonNumber}/episodes/{episodeNumber}")
    public EpisodeDto getEpisodeDetails(
            @PathVariable @Positive Long id,
            @PathVariable @Min(0) Integer seasonNumber,
            @PathVariable @Min(1) Integer episodeNumber
    ) {
        return tmdbService.getEpisodeDetails(id, seasonNumber, episodeNumber);
    }
}

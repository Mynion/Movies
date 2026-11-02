package org.mynion.movies.controller;

import org.mynion.movies.dto.tmdb.*;
import org.mynion.movies.service.TmdbService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/series")
public class SeriesController {
    private final TmdbService tmdbService;

    public SeriesController(TmdbService tmdbService) {
        this.tmdbService = tmdbService;
    }

    @GetMapping("/{id}")
    public SeriesDetailsDto getSeriesDetails(@PathVariable Long id) {
        return tmdbService.getSeriesDetails(id);
    }

    @GetMapping("/search")
    public SeriesSearchResponseDto searchSeries(@RequestParam String query) {
        return tmdbService.searchSeries(query);
    }

    @GetMapping()
    public SeriesSearchResponseDto getSeries(@RequestParam(defaultValue = "1") int page, @RequestParam(required = false) Integer genreId) {
        return tmdbService.getSeries(page, genreId);
    }

    @GetMapping("/{id}/seasons/{seasonNumber}")
    public SeasonDetailsDto getSeasonDetails(
            @PathVariable Long id,
            @PathVariable Integer seasonNumber
    ) {
        return tmdbService.getSeasonDetails(id, seasonNumber);
    }

    @GetMapping("/{id}/seasons/{seasonNumber}/episodes/{episodeNumber}")
    public EpisodeDto getEpisodeDetails(
            @PathVariable Long id,
            @PathVariable Integer seasonNumber,
            @PathVariable Integer episodeNumber
    ) {
        return tmdbService.getEpisodeDetails(id, seasonNumber, episodeNumber);
    }
}

package org.mynion.movies.controller;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import org.mynion.movies.dto.tmdb.MovieDetailsDto;
import org.mynion.movies.dto.tmdb.MovieSearchResponseDto;
import org.mynion.movies.service.TmdbService;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/movies")
@Validated
public class MovieController {

    private final TmdbService tmdbService;

    public MovieController(TmdbService tmdbService) {
        this.tmdbService = tmdbService;
    }

    @GetMapping("/search")
    public MovieSearchResponseDto searchMovies(@RequestParam @NotBlank String query) {
        return tmdbService.searchMovies(query);
    }

    @GetMapping("/{id}")
    public MovieDetailsDto getMovieDetails(@PathVariable @Positive Long id) {
        return tmdbService.getMovieDetails(id);
    }

    @GetMapping
    public MovieSearchResponseDto getMovies(
            @RequestParam(defaultValue = "1") @Min(1) int page,
            @RequestParam(required = false) @Positive Integer genreId) {

        return tmdbService.getMovies(page, genreId);
    }
}

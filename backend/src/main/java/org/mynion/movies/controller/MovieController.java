package org.mynion.movies.controller;

import org.mynion.movies.dto.tmdb.MovieDetailsDto;
import org.mynion.movies.dto.tmdb.MovieSearchResponseDto;
import org.mynion.movies.service.TmdbService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/movies")
public class MovieController {

    private final TmdbService tmdbService;

    public MovieController(TmdbService tmdbService) {
        this.tmdbService = tmdbService;
    }

    @GetMapping("/search")
    public MovieSearchResponseDto searchMovies(@RequestParam String query) {
        return tmdbService.searchMovies(query);
    }

    @GetMapping("/{id}")
    public MovieDetailsDto getMovieDetails(@PathVariable Long id) {
        return tmdbService.getMovieDetails(id);
    }

    @GetMapping
    public MovieSearchResponseDto getMovies(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(required = false) Integer genreId) {

        return tmdbService.getM ovies(page, genreId);
    }
}

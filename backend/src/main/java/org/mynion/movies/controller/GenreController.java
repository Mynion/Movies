package org.mynion.movies.controller;

import org.mynion.movies.dto.tmdb.GenresDto;
import org.mynion.movies.service.TmdbService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/genres")
public class GenreController {

    private final TmdbService tmdbService;

    public GenreController(TmdbService tmdbService) {
        this.tmdbService = tmdbService;
    }

    @GetMapping
    public GenresDto getGenres(@RequestParam String type){
        return tmdbService.getGenres(type);
    }
}

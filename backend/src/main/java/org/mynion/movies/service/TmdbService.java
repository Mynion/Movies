package org.mynion.movies.service;

import org.mynion.movies.dto.tmdb.MovieDetailsDto;
import org.mynion.movies.dto.tmdb.MovieSearchResponseDto;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class TmdbService {

    private final RestClient tmdbRestClient;

    public TmdbService(RestClient tmdbRestClient) {
        this.tmdbRestClient = tmdbRestClient;
    }

    public MovieSearchResponseDto searchMovies(String query) {
        return tmdbRestClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/search/movie")
                        .queryParam("query", query)
                        .queryParam("language", "pl-PL")
                        .build())
                .retrieve()
                .body(MovieSearchResponseDto.class);
    }

    public MovieDetailsDto getMovieDetails(Long id) {
        return tmdbRestClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/movie/{id}")
                        .queryParam("language", "pl-PL")
                        .queryParam("append_to_response", "credits")
                        .build(id))
                .retrieve()
                .body(MovieDetailsDto.class);
    }

    public MovieSearchResponseDto getMovies(int page, Integer genreId) {
        return tmdbRestClient.get()
                .uri(uriBuilder -> {
                    uriBuilder
                            .path("/discover/movie")
                            .queryParam("language", "pl-PL")
                            .queryParam("page", page);

                    if (genreId != null) {
                        uriBuilder.queryParam("with_genres", genreId);
                    }

                    return uriBuilder.build();
                })
                .retrieve()
                .body(MovieSearchResponseDto.class);
    }
}

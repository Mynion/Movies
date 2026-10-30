package org.mynion.movies.service;

import org.mynion.movies.dto.tmdb.*;
import org.mynion.movies.util.MediaType;
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

                    if (genreId != null) uriBuilder.queryParam("with_genres", genreId);

                    return uriBuilder.build();
                })
                .retrieve()
                .body(MovieSearchResponseDto.class);
    }

    public GenresDto getGenres(MediaType mediaType) {
        String tmdbType = switch (mediaType) {
            case MOVIE -> "movie";
            case TV_SERIES -> "tv";
            case SEASON, EPISODE ->
                    throw new IllegalArgumentException("Genres are not available for seasons or episodes");
        };

        return tmdbRestClient.get()
                .uri(uriBuilder ->
                        uriBuilder
                                .path("/genre/{mediaType}/list")
                                .queryParam("language", "pl-PL")
                                .build(tmdbType))
                .retrieve()
                .body(GenresDto.class);
    }

    public SeriesSearchResponseDto searchSeries(String query) {
        return tmdbRestClient.get()
                .uri(uriBuilder ->
                        uriBuilder
                                .path("/search/tv")
                                .queryParam("query", query)
                                .queryParam("language", "pl-PL")
                                .build())
                .retrieve()
                .body(SeriesSearchResponseDto.class);
    }

    public SeriesDto getSeriesDetails(Long id) {
        return tmdbRestClient.get()
                .uri(uriBuilder ->
                        uriBuilder
                                .path("/tv/{id}")
                                .queryParam("language", "pl-PL")
                                .build(id))
                .retrieve()
                .body(SeriesDto.class);

    }

    public SeriesSearchResponseDto getSeries(int page, Integer genreId) {
        return tmdbRestClient.get()
                .uri(uriBuilder ->
                {
                    uriBuilder
                            .path("/discover/tv")
                            .queryParam("page", page)
                            .queryParam("language", "pl-PL");

                    if (genreId != null) uriBuilder.queryParam("with_genres", genreId);

                    return uriBuilder.build();
                })
                .retrieve()
                .body(SeriesSearchResponseDto.class);
    }
}

package org.mynion.movies.service;

import java.util.List;
import org.mynion.movies.dto.tmdb.SeasonDetailsDto;
import org.mynion.movies.dto.tmdb.SeriesDetailsDto;
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


    public SeriesDetailsDto getSeriesDetails(Long id) {

        SeriesDetailsDto series = tmdbRestClient.get()
                .uri(uriBuilder ->
                        uriBuilder
                                .path("/tv/{id}")
                                .queryParam("language", "pl-PL")
                                .queryParam("append_to_response", "credits")
                                .build(id))
                .retrieve()
                .body(SeriesDetailsDto.class);

        if (series == null || series.seasons() == null) {
            return series;
        }

        List<SeasonDetailsDto> seasons = series.seasons().stream()
                .map(season -> getSeasonDetails(id, season.seasonNumber()))
                .toList();

        return new SeriesDetailsDto(
                series.id(),
                series.name(),
                series.overview(),
                series.posterPath(),
                series.backdropPath(),
                series.firstAirDate(),
                series.genres(),
                series.numberOfSeasons(),
                series.numberOfEpisodes(),
                series.voteAverage(),
                series.credits(),
                seasons
        );
    }

    public SeasonDetailsDto getSeasonDetails(Long seriesId, Integer seasonNumber) {

        return tmdbRestClient.get()
                .uri(uriBuilder ->
                        uriBuilder
                                .path("/tv/{id}/season/{seasonNumber}")
                                .queryParam("language", "pl-PL")
                                .build(seriesId, seasonNumber))
                .retrieve()
                .body(SeasonDetailsDto.class);
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

    public EpisodeDto getEpisodeDetails(
            Long seriesId,
            Integer seasonNumber,
            Integer episodeNumber
    ) {
        return tmdbRestClient.get()
                .uri(uriBuilder ->
                        uriBuilder.path("/tv/{series_id}/season/{season_number}/episode/{episode_number}")
                                .queryParam("language", "pl-PL")
                                .build(seriesId, seasonNumber, episodeNumber))
                .retrieve()
                .body(EpisodeDto.class);
    }
}

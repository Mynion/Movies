package org.mynion.movies.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mynion.movies.dto.tmdb.*;
import org.mynion.movies.util.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

public class TmdbServiceTest {
    private static final String BASE_URL =
            "https://api.themoviedb.org/3";
    private TmdbService tmdbService;
    private MockRestServiceServer mockServer;

    @BeforeEach
    void setUp() {
        RestClient.Builder builder = RestClient.builder()
                .baseUrl(BASE_URL);
        mockServer = MockRestServiceServer.bindTo(builder).build();
        tmdbService = new TmdbService(builder.build());
    }

    @Test
    void shouldReturnMovieGenres() {
        // Arrange
        mockServer.expect(requestTo(
                        BASE_URL + "/genre/movie/list?language=pl-PL"))
                .andRespond(withSuccess(
                        """
                                {
                                    "genres": [
                                        {"id": 28, "name": "Action"},
                                        {"id": 18, "name": "Drama"}
                                    ]
                                }
                                """,
                        org.springframework.http.MediaType.APPLICATION_JSON
                ));

        // Act
        GenresDto result = tmdbService.getGenres(MediaType.MOVIE);

        // Assert
        assertNotNull(result);
        assertEquals(2, result.genres().size());
        assertEquals("Action", result.genres().get(0).name());

        mockServer.verify();
    }

    @Test
    void shouldThrowExceptionForSeasonGenres() {
        // Act & Assert
        assertThrows(
                IllegalArgumentException.class,
                () -> tmdbService.getGenres(MediaType.SEASON)
        );
    }

    @Test
    void shouldReturnSeriesGenres() {
        // Arrange
        mockServer.expect(requestTo(
                        BASE_URL + "/genre/tv/list?language=pl-PL"))
                .andRespond(withSuccess(
                        """
                                {
                                    "genres": [
                                        {"id": 18, "name": "Drama"},
                                        {"id": 35, "name": "Comedy"}
                                    ]
                                }
                                """,
                        org.springframework.http.MediaType.APPLICATION_JSON
                ));

        // Act
        GenresDto result = tmdbService.getGenres(MediaType.TV_SERIES);

        // Assert
        assertNotNull(result);
        assertEquals(2, result.genres().size());
        assertEquals("Drama", result.genres().get(0).name());

        mockServer.verify();
    }

    @Test
    void shouldReturnMovies() {
        String query = "Inception";

        mockServer.expect(requestTo(BASE_URL + "/search/movie?query=" + query + "&language=pl-PL"))
                .andRespond(withSuccess(
                        """
                                {
                                    "page": 1,
                                    "results": [
                                        {
                                            "id": 1,
                                            "title": "Movie Title",
                                            "overview": "Movie Overview"
                                        }
                                    ],
                                    "total_pages": 1,
                                    "total_results": 1
                                }
                                """,
                        org.springframework.http.MediaType.APPLICATION_JSON
                ));

        MovieSearchResponseDto responseDto = tmdbService.searchMovies(query);

        assertNotNull(responseDto);
        assertEquals(1, responseDto.page());
        assertEquals(1, responseDto.results().size());
        assertEquals("Movie Title", responseDto.results().get(0).title());

        mockServer.verify();
    }

    @Test
    void shouldReturnSeries() {
        // Arrange
        String query = "Breaking Bad";

        mockServer.expect(requestTo(
                        BASE_URL + "/search/tv?query=Breaking%20Bad&language=pl-PL"))
                .andRespond(withSuccess(
                        """
                                {
                                    "page": 1,
                                    "results": [
                                        {
                                            "id": 1,
                                            "name": "Breaking Bad",
                                            "overview": "A chemistry teacher starts producing methamphetamine."
                                        }
                                    ],
                                    "total_pages": 1,
                                    "total_results": 1
                                }
                                """,
                        org.springframework.http.MediaType.APPLICATION_JSON
                ));

        // Act
        SeriesSearchResponseDto responseDto = tmdbService.searchSeries(query);

        // Assert
        assertNotNull(responseDto);
        assertEquals(1, responseDto.page());
        assertEquals(1, responseDto.results().size());
        assertEquals("Breaking Bad", responseDto.results().get(0).name());

        mockServer.verify();
    }

    @Test
    void shouldReturnMovieDetails() {
        // Arrange
        Long movieId = 550L;

        mockServer.expect(requestTo(
                        BASE_URL + "/movie/" + movieId + "?language=pl-PL&append_to_response=credits"))
                .andRespond(withSuccess(
                        """
                                {
                                    "id": 550,
                                    "title": "Fight Club",
                                    "overview": "A ticking-time-bomb insomniac...",
                                    "release_date": "1999-10-15",
                                    "runtime": 139,
                                    "vote_average": 8.4,
                                    "genres": [
                                        {
                                            "id": 18,
                                            "name": "Drama"
                                        }
                                    ],
                                    "credits": {
                                        "cast": [
                                            {
                                                "id": 819,
                                                "name": "Edward Norton",
                                                "character": "The Narrator",
                                                "order": 0
                                            }
                                        ]
                                    }
                                }
                                """,
                        org.springframework.http.MediaType.APPLICATION_JSON
                ));

        // Act
        MovieDetailsDto result = tmdbService.getMovieDetails(movieId);

        // Assert
        assertNotNull(result);
        assertEquals(550L, result.id());
        assertEquals("Fight Club", result.title());
        assertEquals(139, result.runtime());
        assertEquals("Drama", result.genres().get(0).name());
        assertEquals("Edward Norton", result.credits().cast().get(0).name());

        mockServer.verify();
    }

    @Test
    void shouldReturnSeriesDetails() {
        // Arrange
        Long seriesId = 1396L;

        mockServer.expect(requestTo(
                        BASE_URL + "/tv/" + seriesId + "?language=pl-PL"))
                .andRespond(withSuccess(
                        """
                                {
                                    "id": 1396,
                                    "name": "Breaking Bad",
                                    "overview": "A chemistry teacher starts producing methamphetamine.",
                                    "first_air_date": "2008-01-20",
                                    "number_of_seasons": 5,
                                    "number_of_episodes": 62,
                                    "vote_average": 8.9,
                                    "genres": [
                                        {
                                            "id": 18,
                                            "name": "Drama"
                                        }
                                    ]
                                }
                                """,
                        org.springframework.http.MediaType.APPLICATION_JSON
                ));

        // Act
        SeriesDetailsDto result = tmdbService.getSeriesDetails(seriesId);

        // Assert
        assertNotNull(result);
        assertEquals(1396L, result.id());
        assertEquals("Breaking Bad", result.name());
        assertEquals(5, result.numberOfSeasons());
        assertEquals(62, result.numberOfEpisodes());
        assertEquals("Drama", result.genres().get(0).name());

        mockServer.verify();
    }

    @Test
    void shouldReturnSeasonDetails() {
        // Arrange
        Long seriesId = 1396L;
        Integer seasonNumber = 1;

        mockServer.expect(requestTo(
                        BASE_URL + "/tv/" + seriesId
                                + "/season/" + seasonNumber + "?language=pl-PL"))
                .andRespond(withSuccess(
                        """
                        {
                            "id": 3572,
                            "name": "Season 1",
                            "overview": "The first season.",
                            "season_number": 1,
                            "air_date": "2008-01-20",
                            "episodes": [
                                {
                                    "id": 62085,
                                    "name": "Pilot",
                                    "overview": "A high school chemistry teacher...",
                                    "air_date": "2008-01-20",
                                    "episode_number": 1,
                                    "season_number": 1,
                                    "runtime": 58,
                                    "vote_average": 8.0
                                },
                                {
                                    "id": 62086,
                                    "name": "Cat's in the Bag...",
                                    "overview": "The story continues.",
                                    "air_date": "2008-01-27",
                                    "episode_number": 2,
                                    "season_number": 1,
                                    "runtime": 48,
                                    "vote_average": 7.9
                                }
                            ]
                        }
                        """,
                        org.springframework.http.MediaType.APPLICATION_JSON
                ));

        // Act
        SeasonDetailsDto result =
                tmdbService.getSeasonDetails(seriesId, seasonNumber);

        // Assert
        assertNotNull(result);
        assertEquals(3572L, result.id());
        assertEquals("Season 1", result.name());
        assertEquals(1, result.seasonNumber());

        assertEquals(2, result.episodes().size());
        assertEquals("Pilot", result.episodes().get(0).name());
        assertEquals(1, result.episodes().get(0).episodeNumber());

        mockServer.verify();
    }

    @Test
    void shouldReturnEpisodeDetails() {
        // Arrange
        Long seriesId = 1396L;
        Integer seasonNumber = 1;
        Integer episodeNumber = 1;

        mockServer.expect(requestTo(
                        BASE_URL + "/tv/" + seriesId
                                + "/season/" + seasonNumber
                                + "/episode/" + episodeNumber
                                + "?language=pl-PL"))
                .andRespond(withSuccess(
                        """
                        {
                            "id": 62085,
                            "name": "Pilot",
                            "overview": "A high school chemistry teacher...",
                            "air_date": "2008-01-20",
                            "episode_number": 1,
                            "season_number": 1,
                            "runtime": 58,
                            "vote_average": 8.0
                        }
                        """,
                        org.springframework.http.MediaType.APPLICATION_JSON
                ));

        // Act
        EpisodeDto result = tmdbService.getEpisodeDetails(
                seriesId, seasonNumber, episodeNumber
        );

        // Assert
        assertNotNull(result);
        assertEquals(62085L, result.id());
        assertEquals("Pilot", result.name());
        assertEquals(1, result.seasonNumber());
        assertEquals(1, result.episodeNumber());
        assertEquals(58, result.runtime());

        mockServer.verify();
    }
}

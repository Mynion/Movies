package org.mynion.movies.service;

import org.junit.jupiter.api.Test;
import org.mynion.movies.dto.tmdb.GenresDto;
import org.mynion.movies.util.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

public class TmdbServiceTest {
    private static final String BASE_URL =
            "https://api.themoviedb.org/3";

    @Test
    void shouldReturnMovieGenres() {
        // Arrange
        RestClient.Builder builder = RestClient.builder()
                .baseUrl(BASE_URL);

        MockRestServiceServer mockServer =
                MockRestServiceServer.bindTo(builder).build();

        TmdbService tmdbService = new TmdbService(builder.build());

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
        // Arrange
        TmdbService tmdbService = new TmdbService(
                RestClient.builder().build()
        );

        // Act & Assert
        assertThrows(
                IllegalArgumentException.class,
                () -> tmdbService.getGenres(MediaType.SEASON)
        );
    }

    @Test
    void shouldReturnSeriesGenres(){
        // Arrange
        TmdbService tmdbService = new TmdbService(RestClient.builder().build());

    }
}

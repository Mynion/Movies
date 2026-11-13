
package org.mynion.movies.service;

import org.mynion.movies.entity.MediaItem;
import org.mynion.movies.enums.MediaType;
import org.mynion.movies.exception.InvalidMediaItemException;
import org.mynion.movies.repository.MediaItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class MediaItemService {

    private final MediaItemRepository mediaItemRepository;
    private final TmdbService tmdbService;

    public MediaItemService(
            MediaItemRepository mediaItemRepository,
            TmdbService tmdbService
    ) {
        this.mediaItemRepository = mediaItemRepository;
        this.tmdbService = tmdbService;
    }


    @Transactional
    public MediaItem findOrCreate(
            MediaType mediaType,
            Long tmdbId,
            Integer seasonNumber,
            Integer episodeNumber
    ) {
        validateMediaType(
                mediaType,
                tmdbId,
                seasonNumber,
                episodeNumber
        );

        return switch (mediaType) {
            case MOVIE -> findOrCreateMovie(tmdbId);
            case TV_SERIES -> findOrCreateSeries(tmdbId);
            case SEASON -> findOrCreateSeason(tmdbId, seasonNumber);
            case EPISODE -> findOrCreateEpisode(
                    tmdbId,
                    seasonNumber,
                    episodeNumber
            );
        };
    }


    @Transactional(readOnly = true)
    public Optional<MediaItem> findExisting(
            MediaType mediaType,
            Long tmdbId,
            Integer seasonNumber,
            Integer episodeNumber
    ) {
        validateMediaType(
                mediaType,
                tmdbId,
                seasonNumber,
                episodeNumber
        );

        return switch (mediaType) {
            case MOVIE, TV_SERIES ->
                    mediaItemRepository.findByMediaTypeAndTmdbId(
                            mediaType, tmdbId
                    );

            case SEASON ->
                    mediaItemRepository
                            .findByMediaTypeAndTmdbId(
                                    MediaType.TV_SERIES, tmdbId
                            )
                            .flatMap(series -> mediaItemRepository
                                    .findByParentIdAndSeasonNumber(
                                            series.getId(),
                                            seasonNumber
                                    ));

            case EPISODE ->
                    mediaItemRepository
                            .findByMediaTypeAndTmdbId(
                                    MediaType.TV_SERIES, tmdbId
                            )
                            .flatMap(series -> mediaItemRepository
                                    .findByParentIdAndSeasonNumber(
                                            series.getId(),
                                            seasonNumber
                                    ))
                            .flatMap(season -> mediaItemRepository
                                    .findByParentIdAndEpisodeNumber(
                                            season.getId(),
                                            episodeNumber
                                    ));
        };
    }


    private void validateMediaType(
            MediaType mediaType,
            Long tmdbId,
            Integer seasonNumber,
            Integer episodeNumber
    ) {
        if (mediaType == null) {
            throw new InvalidMediaItemException(
                    "Typ produkcji jest wymagany."
            );
        }

        if (tmdbId == null || tmdbId <= 0) {
            throw new InvalidMediaItemException(
                    "Identyfikator TMDB musi być dodatni."
            );
        }

        switch (mediaType) {
            case MOVIE, TV_SERIES -> {
                if (seasonNumber != null || episodeNumber != null) {
                    throw new InvalidMediaItemException(
                            "Film lub serial nie może mieć numeru sezonu ani odcinka."
                    );
                }
            }

            case SEASON -> {
                if (seasonNumber == null || seasonNumber < 0
                        || episodeNumber != null) {
                    throw new InvalidMediaItemException(
                            "Sezon wymaga numeru sezonu >= 0 i nie może zawierać numeru odcinka."
                    );
                }
            }

            case EPISODE -> {
                if (seasonNumber == null || seasonNumber < 0
                        || episodeNumber == null || episodeNumber < 1) {
                    throw new InvalidMediaItemException(
                            "Odcinek wymaga numeru sezonu >= 0 i numeru odcinka >= 1."
                    );
                }
            }
        }
    }


    private MediaItem findOrCreateMovie(Long tmdbId) {
        return mediaItemRepository
                .findByMediaTypeAndTmdbId(MediaType.MOVIE, tmdbId)
                .orElseGet(() -> {
                    var movie = tmdbService.getMovieDetails(tmdbId);

                    MediaItem item = new MediaItem();
                    item.setMediaType(MediaType.MOVIE);
                    item.setTmdbId(tmdbId);
                    item.setTitle(movie.title());
                    item.setDescription(movie.overview());
                    item.setDuration(movie.runtime());
                    item.setPosterPath(movie.posterPath());

                    return mediaItemRepository.save(item);
                });
    }

    private MediaItem findOrCreateSeries(Long tmdbId) {
        return mediaItemRepository
                .findByMediaTypeAndTmdbId(MediaType.TV_SERIES, tmdbId)
                .orElseGet(() -> {
                    var series = tmdbService.getSeriesDetails(tmdbId);

                    MediaItem item = new MediaItem();
                    item.setMediaType(MediaType.TV_SERIES);
                    item.setTmdbId(tmdbId);
                    item.setTitle(series.name());
                    item.setDescription(series.overview());
                    item.setPosterPath(series.posterPath());

                    return mediaItemRepository.save(item);
                });
    }

    private MediaItem findOrCreateSeason(
            Long seriesTmdbId,
            Integer seasonNumber
    ) {
        MediaItem series = findOrCreateSeries(seriesTmdbId);

        return mediaItemRepository
                .findByParentIdAndSeasonNumber(
                        series.getId(), seasonNumber
                )
                .orElseGet(() -> {
                    var season = tmdbService.getSeasonDetails(
                            seriesTmdbId, seasonNumber
                    );

                    MediaItem item = new MediaItem();
                    item.setMediaType(MediaType.SEASON);
                    item.setParent(series);
                    item.setSeasonNumber(seasonNumber);
                    item.setTitle(season.name());
                    item.setDescription(season.overview());
                    item.setPosterPath(season.posterPath());

                    return mediaItemRepository.save(item);
                });
    }

    private MediaItem findOrCreateEpisode(
            Long seriesTmdbId,
            Integer seasonNumber,
            Integer episodeNumber
    ) {
        MediaItem season = findOrCreateSeason(
                seriesTmdbId, seasonNumber
        );

        return mediaItemRepository
                .findByParentIdAndEpisodeNumber(
                        season.getId(), episodeNumber
                )
                .orElseGet(() -> {
                    var episode = tmdbService.getEpisodeDetails(
                            seriesTmdbId,
                            seasonNumber,
                            episodeNumber
                    );

                    MediaItem item = new MediaItem();
                    item.setMediaType(MediaType.EPISODE);
                    item.setParent(season);
                    item.setSeasonNumber(seasonNumber);
                    item.setEpisodeNumber(episodeNumber);
                    item.setTitle(episode.name());
                    item.setDescription(episode.overview());
                    item.setDuration(episode.runtime());

                    return mediaItemRepository.save(item);
                });
    }
}

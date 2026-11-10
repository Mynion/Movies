
package org.mynion.movies.service;

import org.mynion.movies.entity.MediaItem;
import org.mynion.movies.repository.MediaItemRepository;
import org.mynion.movies.enums.MediaType;
import org.springframework.stereotype.Service;

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

    public MediaItem findOrCreate(MediaType mediaType, Long tmdbId) {
        return mediaItemRepository.findByMediaTypeAndTmdbId(mediaType, tmdbId)
                .orElseGet(() -> createMediaItem(mediaType, tmdbId));
    }

    private MediaItem createMediaItem(MediaType mediaType, Long tmdbId) {
        MediaItem mediaItem = new MediaItem();
        mediaItem.setMediaType(mediaType);
        mediaItem.setTmdbId(tmdbId);

        switch (mediaType) {
            case MOVIE -> {
                var movie = tmdbService.getMovieDetails(tmdbId);

                mediaItem.setTitle(movie.title());
                mediaItem.setDescription(movie.overview());
                mediaItem.setDuration(movie.runtime());
                mediaItem.setPosterPath(movie.posterPath());
            }

            case TV_SERIES -> {
                var series = tmdbService.getSeriesDetails(tmdbId);

                mediaItem.setTitle(series.name());
                mediaItem.setDescription(series.overview());
                mediaItem.setPosterPath(series.posterPath());
            }

            default -> throw new IllegalArgumentException(
                    "Unsupported media type: " + mediaType
            );
        }

        return mediaItemRepository.save(mediaItem);
    }
}

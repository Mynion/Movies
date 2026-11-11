package org.mynion.movies.repository;

import org.mynion.movies.entity.MediaItem;
import org.mynion.movies.enums.MediaType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MediaItemRepository extends JpaRepository<MediaItem, Long> {

    Optional<MediaItem> findByMediaTypeAndTmdbId(
            MediaType mediaType,
            Long tmdbId
    );

    Optional<MediaItem> findByParentIdAndSeasonNumber(
            Long parentId,
            Integer seasonNumber
    );

    Optional<MediaItem> findByParentIdAndEpisodeNumber(
            Long parentId,
            Integer episodeNumber
    );
}
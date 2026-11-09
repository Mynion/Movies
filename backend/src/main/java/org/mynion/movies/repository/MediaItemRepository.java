package org.mynion.movies.repository;

import org.mynion.movies.model.MediaItem;
import org.mynion.movies.util.MediaType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MediaItemRepository extends JpaRepository<MediaItem, Long> {

    Optional<MediaItem> findByMediaTypeAndTmdbId(
            MediaType mediaType,
            Long tmdbId
    );
}
package org.mynion.movies.repo;

import org.mynion.movies.model.MediaItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MediaItemRepo extends JpaRepository<MediaItem, Long> {}

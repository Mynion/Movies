package org.mynion.movies.repository;

import org.mynion.movies.entity.MediaList;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MediaListRepository extends JpaRepository<MediaList, Long> {

    List<MediaList> findByUserIdOrderByCreatedAtDesc(Long userId);
}
package org.mynion.movies.repository;

import org.mynion.movies.entity.Rating;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RatingRepository extends JpaRepository<Rating, Long> {

    Optional<Rating> findByUserIdAndMediaItemId(
            Long userId,
            Long mediaItemId
    );

    boolean existsByUserIdAndMediaItemId(
            Long userId,
            Long mediaItemId
    );

    List<Rating> findByMediaItemId(Long mediaItemId);

    List<Rating> findByUserId(Long userId);
}
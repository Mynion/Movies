package org.mynion.movies.repository;

import org.mynion.movies.entity.Rating;
import org.mynion.movies.repository.projection.RatingStatsProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

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

    @Query("""
        SELECT
            AVG(r.value) AS averageRating,
            COUNT(r) AS ratingsCount
        FROM Rating r
        WHERE r.mediaItem.id = :mediaItemId
        """)
    RatingStatsProjection getRatingStats(
            @Param("mediaItemId") Long mediaItemId
    );
}
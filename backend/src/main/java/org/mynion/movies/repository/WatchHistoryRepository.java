
package org.mynion.movies.repository;

import org.mynion.movies.entity.WatchHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;

public interface WatchHistoryRepository
        extends JpaRepository<WatchHistory, Long> {

    List<WatchHistory> findByUserIdOrderByWatchedAtDesc(Long userId);

    List<WatchHistory> findByUserIdAndWatchedAtBetweenOrderByWatchedAtDesc(
            Long userId,
            Instant start,
            Instant end
    );
}

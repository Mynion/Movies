
package org.mynion.movies.repository;

import org.mynion.movies.entity.Review;
import org.mynion.movies.enums.ReviewVisibility;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByUserId(Long userId);

    List<Review> findByMediaItemIdAndVisibility(
            Long mediaItemId,
            ReviewVisibility visibility
    );

    List<Review> findByVisibility(ReviewVisibility visibility);
}

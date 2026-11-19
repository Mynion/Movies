
package org.mynion.movies.repository;

import org.mynion.movies.entity.Review;
import org.mynion.movies.enums.Visibility;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByUserId(Long userId);

    List<Review> findByMediaItemIdAndVisibility(
            Long mediaItemId,
            Visibility visibility
    );

    List<Review> findByVisibility(Visibility visibility);
    boolean existsByUserIdAndMediaItemId(
            Long userId,
            Long mediaItemId
    );
}

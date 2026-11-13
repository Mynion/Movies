
package org.mynion.movies.mapper;

import org.mynion.movies.dto.review.ReviewResponseDto;
import org.mynion.movies.entity.MediaItem;
import org.mynion.movies.entity.Review;
import org.springframework.stereotype.Component;

@Component
public class ReviewMapper {

    public ReviewResponseDto toDto(Review review) {
        MediaItem mediaItem = review.getMediaItem();

        return new ReviewResponseDto(
                review.getId(),
                review.getUser().getId(),
                review.getUser().getUsername(),
                mediaItem.getId(),
                getTmdbId(mediaItem),
                mediaItem.getMediaType(),
                mediaItem.getSeasonNumber(),
                mediaItem.getEpisodeNumber(),
                review.getTitle(),
                review.getContent(),
                review.getVisibility(),
                review.getCreatedAt()
        );
    }

    private Long getTmdbId(MediaItem mediaItem) {
        return switch (mediaItem.getMediaType()) {
            case MOVIE, TV_SERIES -> mediaItem.getTmdbId();
            case SEASON -> mediaItem.getParent().getTmdbId();
            case EPISODE -> mediaItem.getParent().getParent().getTmdbId();
        };
    }
}

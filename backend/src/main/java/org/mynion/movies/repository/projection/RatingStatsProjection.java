package org.mynion.movies.repository.projection;

public interface RatingStatsProjection {
    Double getAverageRating();
    Long getRatingsCount();
}

package org.mynion.movies.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "ratings")
@Getter
@Setter
public class Rating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "rating_id")
    private Long id;

    @Column(nullable = false, precision = 3, scale = 1)
    private BigDecimal value;

    @Column(name = "created_at", insertable = false, updatable = false)
    private Instant createdAt;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "fk1_user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "fk2_media_item_id", nullable = false)
    private MediaItem mediaItem;

    @OneToMany(
            mappedBy = "rating",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<RatingScore> scores = new ArrayList<>();

    public void addScore(RatingScore score) {
        scores.add(score);
        score.setRating(this);
    }
}

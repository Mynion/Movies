
package org.mynion.movies.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.mynion.movies.converter.ScoreTypeConverter;
import org.mynion.movies.enums.ScoreType;

import java.math.BigDecimal;

@Entity
@Table(name = "rating_score")
@Getter
@Setter
public class RatingScore {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "rating_score_id")
    private Long id;

    @Convert(converter = ScoreTypeConverter.class)
    @Column(name = "score_type", nullable = false)
    private ScoreType scoreType;

    @Column(nullable = false, precision = 3, scale = 1)
    private BigDecimal score;

    @Column(name = "to_average", nullable = false)
    private boolean toAverage = true;

    @Column(name = "custom_name")
    private String customName;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "fk1_rating_id", nullable = false)
    private Rating rating;
}

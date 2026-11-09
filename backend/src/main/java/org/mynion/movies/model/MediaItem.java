package org.mynion.movies.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.mynion.movies.converter.MediaTypeConverter;
import org.mynion.movies.util.MediaType;

import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "media_items")
@Getter
@Setter
public class MediaItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "media_item_id")
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private Integer duration;

    @Convert(converter = MediaTypeConverter.class)
    @Column(name = "media_type", nullable = false)
    private MediaType mediaType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private MediaItem parent;

    @Column(name = "season_number")
    private Integer seasonNumber;

    @Column(name = "episode_number")
    private Integer episodeNumber;

    @Column(name = "poster_path")
    private String posterPath;

    @Column(name = "tmdb_id")
    private Long tmdbId;

    @Column(name = "release_date")
    private LocalDate releaseDate;

    @Column(name = "created_at", insertable = false, updatable = false)
    private Instant createdAt;
}
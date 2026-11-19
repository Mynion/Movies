package org.mynion.movies.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "watch_history")
@Getter
@Setter
@NoArgsConstructor
public class WatchHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "watch_history_id")
    private Long id;

    @Column(name = "watched_at", nullable = false)
    private Instant watchedAt;

    @Column(name = "progress")
    private Integer progress;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "fk1_user_id", nullable = false)
    private User user;

    @ManyToMany
    @JoinTable(
            name = "watch_history_media_items",
            joinColumns = @JoinColumn(
                    name = "fk1_watch_history_id"
            ),
            inverseJoinColumns = @JoinColumn(
                    name = "fk2_media_item_id"
            )
    )
    private Set<MediaItem> mediaItems = new HashSet<>();
}

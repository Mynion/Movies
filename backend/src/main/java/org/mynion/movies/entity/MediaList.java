
package org.mynion.movies.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Generated;
import org.hibernate.generator.EventType;
import org.mynion.movies.converter.VisibilityConverter;
import org.mynion.movies.enums.Visibility;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "lists")
@Getter
@Setter
@NoArgsConstructor
public class MediaList {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "list_id")
    private Long id;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "description", columnDefinition = "text")
    private String description;

    @Convert(converter = VisibilityConverter.class)
    @Column(name = "visibility", nullable = false, length = 20)
    private Visibility visibility = Visibility.PRIVATE;

    @Generated(event = EventType.INSERT)
    @Column(name = "created_at", nullable = false,
            insertable = false, updatable = false)
    private Instant createdAt;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "fk1_user_id", nullable = false)
    private User user;

    @ManyToMany
    @JoinTable(
            name = "lists_media_items",
            joinColumns = @JoinColumn(name = "s_list_id"),
            inverseJoinColumns = @JoinColumn(name = "d_media_item_id")
    )
    private Set<MediaItem> mediaItems = new HashSet<>();
}

package org.mynion.movies.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcType;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.mynion.movies.util.MediaType;

import java.util.Date;
import java.util.UUID;

@Entity
@Table(name = "media_items")
@Getter
@Setter
public class MediaItem {
    @Id
    @Column(name = "media_item_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String title;
    private String description;
    private Integer duration;
    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    private MediaType media_type;
    private Integer parent_id;
    private Integer season_number;
    private Integer episode_number;
    private String poster_path;
    private int tmdb_id;
    private Date release_date;
    private Date created_at;
}

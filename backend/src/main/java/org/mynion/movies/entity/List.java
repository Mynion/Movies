package org.mynion.movies.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.mynion.movies.enums.Visibility;

import java.time.Instant;

@Entity
@Data
@Table(name = "lists")
public class List {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "list_id")
    private Long id;

    @Column(name = "visibility", nullable = false)
    private Visibility visibility;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "fk1_user_id", nullable = false)
    private User user;
}

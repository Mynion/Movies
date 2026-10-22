package org.mynion.movies.dto;

public record RegisterRequest(
        String username,
        String email,
        String password
) {}

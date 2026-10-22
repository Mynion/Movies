package org.mynion.movies.service;

import org.mynion.movies.dto.RegisterRequest;
import org.mynion.movies.model.User;
import org.mynion.movies.repo.UserRepo;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class AuthService {

    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepo userRepo, PasswordEncoder passwordEncoder) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
    }
    public void register(RegisterRequest request) {
        if(userRepo.existsByEmail(request.email())){
            throw new IllegalArgumentException("Email already exists");
        }
        if(userRepo.existsByUsername(request.username())){
            throw new IllegalArgumentException("Username already exists");
        }

        User user = new User();
        user.setRole("user");
        user.setUsername(request.username());
        user.setEmail(request.email());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setCreatedAt(Instant.now());

        userRepo.save(user);
    }
}

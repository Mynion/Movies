package org.mynion.movies.controller;

import org.mynion.movies.dto.RegisterRequest;
import org.mynion.movies.service.AuthService;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @RequestMapping("/register")
    public void register(@RequestBody RegisterRequest request){
        authService.register(request);
    }

}

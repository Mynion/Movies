package org.mynion.movies.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import org.mynion.movies.dto.list.CreateMediaListRequestDto;
import org.mynion.movies.dto.list.MediaListResponseDto;
import org.mynion.movies.dto.list.UpdateMediaListRequestDto;
import org.mynion.movies.entity.User;
import org.mynion.movies.exception.UserNotFoundException;
import org.mynion.movies.repository.UserRepo;
import org.mynion.movies.service.MediaListService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.validation.annotation.Validated;

import java.util.List;

@RestController
@RequestMapping("/api/lists")
@Validated
public class MediaListController {

    private final MediaListService mediaListService;
    private final UserRepo userRepo;

    public MediaListController(
            MediaListService mediaListService,
            UserRepo userRepo
    ) {
        this.mediaListService = mediaListService;
        this.userRepo = userRepo;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MediaListResponseDto createMediaList(
            @Valid @RequestBody CreateMediaListRequestDto request,
            Authentication authentication
    ) {
        return mediaListService.createMediaList(
                request,
                getCurrentUserId(authentication)
        );
    }

    @GetMapping("/me")
    public List<MediaListResponseDto> getMyLists(
            Authentication authentication
    ) {
        return mediaListService.getMyLists(
                getCurrentUserId(authentication)
        );
    }

    @GetMapping("/{id}")
    public MediaListResponseDto getMediaList(
            @PathVariable @Positive Long id,
            Authentication authentication
    ) {
        Long userId = authentication != null
                && authentication.isAuthenticated()
                && !"anonymousUser".equals(authentication.getPrincipal())
                ? getCurrentUserId(authentication)
                : null;

        return mediaListService.getMediaList(id, userId);
    }

    @PutMapping("/{id}")
    public MediaListResponseDto updateMediaList(
            @PathVariable @Positive Long id,
            @Valid @RequestBody UpdateMediaListRequestDto request,
            Authentication authentication
    ) {
        return mediaListService.updateMediaList(
                id,
                request,
                getCurrentUserId(authentication)
        );
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteMediaList(
            @PathVariable @Positive Long id,
            Authentication authentication
    ) {
        mediaListService.deleteMediaList(
                id,
                getCurrentUserId(authentication)
        );
    }

    private Long getCurrentUserId(Authentication authentication) {
        User user = userRepo.findByUsername(authentication.getName())
                .orElseThrow(UserNotFoundException::new);

        return user.getId();
    }
}

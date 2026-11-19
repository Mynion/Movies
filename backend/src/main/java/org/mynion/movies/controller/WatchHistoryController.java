package org.mynion.movies.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import org.mynion.movies.dto.watchhistory.CreateWatchHistoryRequestDto;
import org.mynion.movies.dto.watchhistory.UpdateWatchHistoryRequestDto;
import org.mynion.movies.dto.watchhistory.WatchHistoryResponseDto;
import org.mynion.movies.entity.User;
import org.mynion.movies.exception.UserNotFoundException;
import org.mynion.movies.repository.UserRepo;
import org.mynion.movies.service.WatchHistoryService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/watch-history")
@Validated
public class WatchHistoryController {

    private final WatchHistoryService watchHistoryService;
    private final UserRepo userRepo;

    public WatchHistoryController(
            WatchHistoryService watchHistoryService,
            UserRepo userRepo
    ) {
        this.watchHistoryService = watchHistoryService;
        this.userRepo = userRepo;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public WatchHistoryResponseDto createWatchHistory(
            @Valid @RequestBody CreateWatchHistoryRequestDto request,
            Authentication authentication
    ) {
        return watchHistoryService.createWatchHistory(
                request,
                getCurrentUserId(authentication)
        );
    }

    @GetMapping("/me")
    public List<WatchHistoryResponseDto> getMyHistory(
            Authentication authentication
    ) {
        return watchHistoryService.getUserHistory(
                getCurrentUserId(authentication)
        );
    }

    @GetMapping("/me/range")
    public List<WatchHistoryResponseDto> getMyHistoryByDateRange(
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            Instant start,

            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            Instant end,

            Authentication authentication
    ) {
        return watchHistoryService.getUserHistoryByDateRange(
                getCurrentUserId(authentication),
                start,
                end
        );
    }

    @GetMapping("/{id}")
    public WatchHistoryResponseDto getWatchHistory(
            @PathVariable @Positive Long id,
            Authentication authentication
    ) {
        return watchHistoryService.getWatchHistory(
                id,
                getCurrentUserId(authentication)
        );
    }

    @PutMapping("/{id}")
    public WatchHistoryResponseDto updateWatchHistory(
            @PathVariable @Positive Long id,
            @Valid @RequestBody UpdateWatchHistoryRequestDto request,
            Authentication authentication
    ) {
        return watchHistoryService.updateWatchHistory(
                id,
                request,
                getCurrentUserId(authentication)
        );
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteWatchHistory(
            @PathVariable @Positive Long id,
            Authentication authentication
    ) {
        watchHistoryService.deleteWatchHistory(
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

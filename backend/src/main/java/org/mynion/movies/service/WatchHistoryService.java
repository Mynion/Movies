
package org.mynion.movies.service;

import org.mynion.movies.dto.watchhistory.*;
import org.mynion.movies.entity.MediaItem;
import org.mynion.movies.entity.User;
import org.mynion.movies.entity.WatchHistory;
import org.mynion.movies.exception.*;
import org.mynion.movies.mapper.WatchHistoryMapper;
import org.mynion.movies.repository.UserRepo;
import org.mynion.movies.repository.WatchHistoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class WatchHistoryService {

    private final WatchHistoryRepository watchHistoryRepository;
    private final UserRepo userRepo;
    private final MediaItemService mediaItemService;
    private final WatchHistoryMapper watchHistoryMapper;

    public WatchHistoryService(
            WatchHistoryRepository watchHistoryRepository,
            UserRepo userRepo,
            MediaItemService mediaItemService,
            WatchHistoryMapper watchHistoryMapper
    ) {
        this.watchHistoryRepository = watchHistoryRepository;
        this.userRepo = userRepo;
        this.mediaItemService = mediaItemService;
        this.watchHistoryMapper = watchHistoryMapper;
    }

    @Transactional
    public WatchHistoryResponseDto createWatchHistory(
            CreateWatchHistoryRequestDto request,
            Long userId
    ) {
        User user = userRepo.findById(userId)
                .orElseThrow(UserNotFoundException::new);

        WatchHistory history = new WatchHistory();
        history.setUser(user);
        history.setWatchedAt(
                request.watchedAt() != null
                        ? request.watchedAt()
                        : Instant.now()
        );
        history.setProgress(request.progress());
        history.setMediaItems(resolveMediaItems(request.mediaItems()));

        WatchHistory saved = watchHistoryRepository.save(history);

        return watchHistoryMapper.toDto(saved);
    }

    @Transactional(readOnly = true)
    public List<WatchHistoryResponseDto> getUserHistory(Long userId) {
        return watchHistoryRepository
                .findByUserIdOrderByWatchedAtDesc(userId)
                .stream()
                .map(watchHistoryMapper::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<WatchHistoryResponseDto> getUserHistoryByDateRange(
            Long userId,
            Instant start,
            Instant end
    ) {
        if (start == null || end == null || !start.isBefore(end)) {
            throw new IllegalArgumentException(
                    "Nieprawidłowy zakres dat."
            );
        }

        return watchHistoryRepository
                .findByUserIdAndWatchedAtBetweenOrderByWatchedAtDesc(
                        userId, start, end
                )
                .stream()
                .map(watchHistoryMapper::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public WatchHistoryResponseDto getWatchHistory(
            Long historyId,
            Long userId
    ) {
        WatchHistory history = getOwnedHistory(historyId, userId);
        return watchHistoryMapper.toDto(history);
    }

    @Transactional
    public WatchHistoryResponseDto updateWatchHistory(
            Long historyId,
            UpdateWatchHistoryRequestDto request,
            Long userId
    ) {
        WatchHistory history = getOwnedHistory(historyId, userId);

        history.setWatchedAt(request.watchedAt());
        history.setProgress(request.progress());
        history.setMediaItems(resolveMediaItems(request.mediaItems()));

        return watchHistoryMapper.toDto(history);
    }

    @Transactional
    public void deleteWatchHistory(Long historyId, Long userId) {
        WatchHistory history = getOwnedHistory(historyId, userId);
        watchHistoryRepository.delete(history);
    }

    private WatchHistory getOwnedHistory(Long historyId, Long userId) {
        WatchHistory history = watchHistoryRepository.findById(historyId)
                .orElseThrow(WatchHistoryNotFoundException::new);

        if (!history.getUser().getId().equals(userId)) {
            throw new WatchHistoryAccessDeniedException();
        }

        return history;
    }

    private Set<MediaItem> resolveMediaItems(
            List<WatchHistoryMediaItemDto> mediaItems
    ) {
        Set<MediaItem> result = new HashSet<>();

        for (WatchHistoryMediaItemDto item : mediaItems) {
            MediaItem mediaItem = mediaItemService.findOrCreate(
                    item.mediaType(),
                    item.tmdbId(),
                    item.seasonNumber(),
                    item.episodeNumber()
            );

            result.add(mediaItem);
        }

        return result;
    }
}

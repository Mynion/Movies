
package org.mynion.movies.service;

import org.mynion.movies.dto.list.CreateMediaListRequestDto;
import org.mynion.movies.dto.list.MediaListResponseDto;
import org.mynion.movies.dto.list.UpdateMediaListRequestDto;
import org.mynion.movies.entity.MediaList;
import org.mynion.movies.entity.User;
import org.mynion.movies.enums.Visibility;
import org.mynion.movies.exception.MediaListAccessDeniedException;
import org.mynion.movies.exception.MediaListNotFoundException;
import org.mynion.movies.exception.UserNotFoundException;
import org.mynion.movies.mapper.MediaListMapper;
import org.mynion.movies.repository.MediaListRepository;
import org.mynion.movies.repository.UserRepo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class MediaListService {

    private final MediaListRepository mediaListRepository;
    private final UserRepo userRepo;
    private final MediaListMapper mediaListMapper;

    public MediaListService(
            MediaListRepository mediaListRepository,
            UserRepo userRepo,
            MediaListMapper mediaListMapper
    ) {
        this.mediaListRepository = mediaListRepository;
        this.userRepo = userRepo;
        this.mediaListMapper = mediaListMapper;
    }

    @Transactional
    public MediaListResponseDto createMediaList(
            CreateMediaListRequestDto request,
            Long userId
    ) {
        User user = userRepo.findById(userId)
                .orElseThrow(UserNotFoundException::new);

        MediaList list = new MediaList();
        list.setUser(user);
        list.setName(request.name());
        list.setDescription(request.description());
        list.setVisibility(
                request.visibility() != null
                        ? request.visibility()
                        : Visibility.PRIVATE
        );

        MediaList saved = mediaListRepository.save(list);

        return mediaListMapper.toDto(saved);
    }

    @Transactional(readOnly = true)
    public List<MediaListResponseDto> getMyLists(Long userId) {
        return mediaListRepository
                .findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(mediaListMapper::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public MediaListResponseDto getMediaList(Long listId, Long userId) {
        MediaList list = mediaListRepository.findById(listId)
                .orElseThrow(MediaListNotFoundException::new);

        if (list.getVisibility() == Visibility.PRIVATE &&
                !list.getUser().getId().equals(userId)) {
            throw new MediaListAccessDeniedException();
        }

        return mediaListMapper.toDto(list);
    }

    @Transactional
    public MediaListResponseDto updateMediaList(
            Long listId,
            UpdateMediaListRequestDto request,
            Long userId
    ) {
        MediaList list = getOwnedList(listId, userId);

        list.setName(request.name());
        list.setDescription(request.description());
        list.setVisibility(request.visibility());

        return mediaListMapper.toDto(list);
    }

    @Transactional
    public void deleteMediaList(Long listId, Long userId) {
        MediaList list = getOwnedList(listId, userId);
        mediaListRepository.delete(list);
    }

    private MediaList getOwnedList(Long listId, Long userId) {
        MediaList list = mediaListRepository.findById(listId)
                .orElseThrow(MediaListNotFoundException::new);

        if (!list.getUser().getId().equals(userId)) {
            throw new MediaListAccessDeniedException();
        }

        return list;
    }
}

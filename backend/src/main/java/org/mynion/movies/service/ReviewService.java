
package org.mynion.movies.service;

import org.mynion.movies.dto.review.CreateReviewRequestDto;
import org.mynion.movies.dto.review.UpdateReviewRequestDto;
import org.mynion.movies.dto.review.ReviewResponseDto;
import org.mynion.movies.entity.MediaItem;
import org.mynion.movies.entity.Review;
import org.mynion.movies.entity.User;
import org.mynion.movies.enums.MediaType;
import org.mynion.movies.enums.ReviewVisibility;
import org.mynion.movies.exception.ReviewAccessDeniedException;
import org.mynion.movies.exception.ReviewAlreadyExistsException;
import org.mynion.movies.exception.ReviewNotFoundException;
import org.mynion.movies.exception.UserNotFoundException;
import org.mynion.movies.mapper.ReviewMapper;
import org.mynion.movies.repository.ReviewRepository;
import org.mynion.movies.repository.UserRepo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepo userRepo;
    private final MediaItemService mediaItemService;
    private final ReviewMapper reviewMapper;

    public ReviewService(
            ReviewRepository reviewRepository,
            UserRepo userRepo,
            MediaItemService mediaItemService,
            ReviewMapper reviewMapper
    ) {
        this.reviewRepository = reviewRepository;
        this.userRepo = userRepo;
        this.mediaItemService = mediaItemService;
        this.reviewMapper = reviewMapper;
    }

    @Transactional
    public ReviewResponseDto createReview(
            CreateReviewRequestDto request,
            Long userId
    ) {

        User user = userRepo.findById(userId)
                .orElseThrow(UserNotFoundException::new);

        MediaItem mediaItem = mediaItemService.findOrCreate(
                request.mediaType(),
                request.tmdbId(),
                request.seasonNumber(),
                request.episodeNumber()
        );

        if (reviewRepository.existsByUserIdAndMediaItemId(
                userId, mediaItem.getId()
        )) {
            throw new ReviewAlreadyExistsException();
        }

        Review review = new Review();
        review.setUser(user);
        review.setMediaItem(mediaItem);
        review.setTitle(request.title());
        review.setContent(request.content());
        review.setVisibility(request.visibility());

        Review saved = reviewRepository.saveAndFlush(review);

        return reviewMapper.toDto(saved);
    }

    @Transactional(readOnly = true)
    public ReviewResponseDto getReview(Long reviewId, Long userId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(ReviewNotFoundException::new);

        if (review.getVisibility() == ReviewVisibility.PRIVATE
                && !review.getUser().getId().equals(userId)) {
            throw new ReviewNotFoundException();
        }

        return reviewMapper.toDto(review);
    }

    @Transactional(readOnly = true)
    public List<ReviewResponseDto> getUserReviews(Long userId) {
        return reviewRepository.findByUserId(userId)
                .stream()
                .map(reviewMapper::toDto)
                .toList();
    }


    @Transactional(readOnly = true)
    public List<ReviewResponseDto> getMediaReviews(
            MediaType mediaType,
            Long tmdbId,
            Integer seasonNumber,
            Integer episodeNumber
    ) {
        return mediaItemService
                .findExisting(
                        mediaType,
                        tmdbId,
                        seasonNumber,
                        episodeNumber
                )
                .map(item -> reviewRepository
                        .findByMediaItemIdAndVisibility(
                                item.getId(),
                                ReviewVisibility.PUBLIC
                        )
                        .stream()
                        .map(reviewMapper::toDto)
                        .toList())
                .orElse(List.of());
    }


    @Transactional
    public ReviewResponseDto updateReview(
            Long reviewId,
            UpdateReviewRequestDto request,
            Long userId
    ) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(ReviewNotFoundException::new);

        if (!review.getUser().getId().equals(userId)) {
            throw new ReviewAccessDeniedException();
        }

        review.setTitle(request.title());
        review.setContent(request.content());
        review.setVisibility(request.visibility());

        reviewRepository.flush();

        return reviewMapper.toDto(review);
    }

    @Transactional
    public void deleteReview(Long reviewId, Long userId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(ReviewNotFoundException::new);

        if (!review.getUser().getId().equals(userId)) {
            throw new ReviewAccessDeniedException();
        }

        reviewRepository.delete(review);
    }
}

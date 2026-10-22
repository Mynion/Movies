package org.mynion.movies.service;

import org.mynion.movies.model.MediaItem;
import org.mynion.movies.repo.MediaItemRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MediaItemService {
    @Autowired
    MediaItemRepo repo;

    public List<MediaItem> getMediaItems(){
        return repo.findAll();
    }

    public void addMediaItem(MediaItem mediaItem) {
        repo.save(mediaItem);
    }
}

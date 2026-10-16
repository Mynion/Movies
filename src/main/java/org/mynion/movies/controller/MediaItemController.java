package org.mynion.movies.controller;

import org.mynion.movies.model.MediaItem;
import org.mynion.movies.service.MediaItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class MediaItemController {

    @Autowired
    MediaItemService service;

    @GetMapping("/mediaitems")
    public List<MediaItem> getMediaItems(){
        return service.getMediaItems();
    }

    @PostMapping("/mediaitem")
    public void addMediaItem(@RequestBody MediaItem mediaItem){
        service.addMediaItem(mediaItem);
    }
}

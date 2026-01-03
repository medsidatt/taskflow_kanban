package com.taskflow.kanban.search.controller;

import com.taskflow.kanban.search.dto.SearchResultDto;
import com.taskflow.kanban.search.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/search")
@RequiredArgsConstructor
public class SearchController {

    private final SearchService searchService;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public SearchResultDto search(@RequestParam("q") String q) {
        return searchService.search(q);
    }
}

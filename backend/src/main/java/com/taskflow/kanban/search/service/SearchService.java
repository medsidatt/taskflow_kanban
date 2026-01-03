package com.taskflow.kanban.search.service;

import com.taskflow.kanban.search.dto.SearchResultDto;

public interface SearchService {
    SearchResultDto search(String q);
}

package com.taskflow.kanban.board.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class BoardUpdateDto {
    private String name;
    private String description;
    
    @JsonProperty("isPrivate")
    private Boolean isPrivate;
    
    private String backgroundColor;
    private Boolean archived;
    private Integer position;
}
